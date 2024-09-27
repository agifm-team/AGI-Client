import forPromise from 'for-promise';
import $ from 'jquery';

let usingPWA = false;
let deferredPrompt;
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  const body = $('body');
  body.removeClass('window-browser').removeClass('window-standalone');

  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }

  // Log display mode change to analytics
  console.log(`[PWA] DISPLAY_MODE_CHANGED`, displayMode);
  body.addClass(`window-${displayMode}`);
});

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  // e.preventDefault();

  // Stash the event so it can be triggered later.
  deferredPrompt = e;

  // Update UI notify the user they can install the PWA
  // showInstallPromotion();

  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`[PWA] 'beforeinstallprompt' event was fired.`, deferredPrompt);
});

window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  // hideInstallPromotion();

  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;

  // Optionally, send analytics event to indicate successful install
  console.log(`[PWA] PWA was installed`);
});

if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log(`[PWA] This is running as standalone.`);
  $('body').addClass(`window-standalone`);
} else {
  console.log(`[PWA] This is running as browser.`);
  $('body').addClass(`window-browser`);
}

export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  }

  if (navigator.standalone || isStandalone) {
    return 'standalone';
  }

  return 'browser';
}

export function isUsingPWA() {
  return usingPWA;
}

export function clearFetchPwaCache() {
  if (
    ('serviceWorker' in navigator || 'ServiceWorker' in navigator) &&
    navigator.serviceWorker.controller &&
    navigator.serviceWorker.controller.postMessage
  ) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CLEAR_FETCH_CACHE',
    });
  }
}

export function installPWA() {
  if ('serviceWorker' in navigator || 'ServiceWorker' in navigator) {
    // Get Items
    const cacheChecker = { count: 0, removed: false, keep: false };
    navigator.serviceWorker
      .getRegistrations()
      .then((items) => {
        // Register new Service Worker
        const registerNewService = () =>
          navigator.serviceWorker
            .register('./service-worker.js', { scope: './' })
            // Complete
            .then(() => {
              console.log('[PWA] Service Worker Registered.');
              usingPWA = true;
            })
            // Error
            .catch((err) => {
              console.log('[PWA] Service Worker Failed to Register.');
              console.error(err);
            });

        if (items.length > 0) {
          forPromise({ data: items }, async (item, fn, fnErr) => {
            // Get Url data
            const tinyUrl =
              items[item].active &&
              typeof items[item].active.scriptURL === 'string' &&
              items[item].active.scriptURL.length > 0
                ? new URL(items[item].active.scriptURL)
                : {};

            // Remove old stuff
            if (
              cacheChecker.count > 0 ||
              !items[item].active ||
              (items[item].active.state !== 'activated' &&
                items[item].active.state !== 'activating') ||
              tinyUrl.pathname !== '/service-worker.js'
            ) {
              items[item]
                .unregister()
                .then((success) => {
                  if (!success)
                    console.error(`[PWA] Fail to remove the Service Worker ${items[item].scope}`);
                  else cacheChecker.removed = true;
                  fn();
                })
                .catch(fnErr);
            }

            // Update tiny stuff
            else if (
              __ENV_APP__.MXC_SERVICE_WORKER &&
              items[item].active &&
              (items[item].active.state === 'activated' ||
                items[item].active.state === 'activating') &&
              tinyUrl.pathname === '/service-worker.js'
            ) {
              items[item]
                .update()
                .then((success) => {
                  if (!success)
                    console.error(`[PWA] Fail to update the Service Worker ${items[item].scope}`);
                  else {
                    console.log('[PWA] Service Worker Updated.');
                    cacheChecker.keep = true;
                    usingPWA = true;
                  }
                  fn();
                })
                .catch(fnErr);
            }

            // Add count
            cacheChecker.count++;
          })
            // Remove progress complete
            .then(() => {
              if (__ENV_APP__.MXC_SERVICE_WORKER) {
                if (cacheChecker.removed && !cacheChecker.keep) {
                  registerNewService();
                }
              }
            })
            // Error
            .catch((err) => {
              console.log('[PWA] Service Worker Failed to Unregister.');
              console.error(err);
            });
        } else if (__ENV_APP__.MXC_SERVICE_WORKER) registerNewService();
      })
      // Error
      .catch((err) => {
        console.log('[PWA] Service Worker Failed to get Register list.');
        console.error(err);
      });
  }
}
