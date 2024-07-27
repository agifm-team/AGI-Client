import $ from 'jquery';
import windowEvents from './window';

export const jQueryState = (defaultValue) => {
  let tinyValue = defaultValue;
  const setValue = (value) => {
    tinyValue = value;
  };

  const getValue = () => tinyValue;

  return [getValue, setValue];
};

// Window Hidden Detector
let hiddenWindow = 'windowHidden';
function onPageShow(event) {
  let evt;

  if (event.originalEvent) evt = event.originalEvent;
  else evt = event;

  $('body').removeClass('windowHidden').removeClass('windowVisible');

  const v = 'windowVisible';
  const h = 'windowHidden';
  const evtMap = {
    mouseover: v,
    mouseout: h,
    focus: v,
    focusin: v,
    pageshow: v,
    blur: h,
    focusout: h,
    pagehide: h,
  };

  evt = evt || window.event;
  if (evt.type in evtMap) {
    const result = evtMap[evt.type];
    $('body').addClass(result);
    windowEvents.setEvtMap(result);
  } else {
    const result = this[hiddenWindow] ? 'windowHidden' : 'windowVisible';
    $('body').addClass(result);
    windowEvents.setWindowVisible(result);
  }
}

// Start Query
export default function startQuery() {
  // Window Hidden Detector
  (() => {
    // Standards:
    if (hiddenWindow in document) document.addEventListener('visibilitychange', onPageShow);
    // eslint-disable-next-line no-cond-assign
    else if ((hiddenWindow = 'mozHidden') in document)
      document.addEventListener('mozvisibilitychange', onPageShow);
    // eslint-disable-next-line no-cond-assign
    else if ((hiddenWindow = 'webkitHidden') in document)
      document.addEventListener('webkitvisibilitychange', onPageShow);
    // eslint-disable-next-line no-cond-assign
    else if ((hiddenWindow = 'msHidden') in document)
      document.addEventListener('msvisibilitychange', onPageShow);
    // IE 9 and lower:
    else if ('onfocusin' in document)
      // eslint-disable-next-line no-multi-assign
      document.onfocusin = document.onfocusout = onPageShow;
    // All others:
    // eslint-disable-next-line no-multi-assign
    else window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onPageShow;

    // set the initial state (but only if browser supports the Page Visibility API)
    if (document[hiddenWindow] !== undefined)
      onPageShow({ type: document[hiddenWindow] ? 'blur' : 'focus' });
  })();

  $(document).on('mouseover', onPageShow);
  $(document).on('mouseout', onPageShow);
  $(document).on('blur', onPageShow);
  $(document).on('focus', onPageShow);

  // Select Range
  $.fn.selectRange = function (start, end) {
    if (typeof start === 'number') {
      if (typeof end !== 'number') {
        end = start;
      }

      return this.each(function () {
        if (this.setSelectionRange) {
          this.focus();
          this.setSelectionRange(start, end);
        } else if (this.createTextRange) {
          const range = this.createTextRange();
          range.collapse(true);
          range.moveEnd('character', end);
          range.moveStart('character', start);
          range.select();
        }
      });
    }

    const newStart = this[0].selectionStart;
    const newEnd = this[0].selectionEnd;
    return { newStart, newEnd };
  };

  // Tooltip
  $.fn.tooltip = function (type, configObject) {
    this.each(() => {
      if (!this.data('bs-tooltip')) {
        if (configObject) {
          this.data('bs-tooltip', new bootstrap.Tooltip(this.get(0), configObject));
        } else if (typeof type !== 'string') {
          this.data('bs-tooltip', new bootstrap.Tooltip(this.get(0), type));
        } else {
          this.data('bs-tooltip', new bootstrap.Tooltip(this.get(0)));
        }
      }
    });
  };
}

if (__ENV_APP__.MODE === 'development') global.$ = $;
