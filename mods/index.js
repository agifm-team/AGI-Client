// import sinkingYachts from './sinking.yachts';
import startAgi from './agi-mod';
import startThemeSettings from './themeManager';
import customMessages from './messages/customMessages';
import unstoppableDomains from './web3/unstoppableDomains';

import catppuccinTheme from './themes/catppuccin';

export function startCustomThemes() {
  catppuccinTheme();
  startThemeSettings();
}

export default function startMods(firstTime) {
  // sinkingYachts(firstTime);
  // helloWorld(firstTime);
  // startTest(firstTime);

  startAgi(firstTime);

  customMessages(firstTime);
  unstoppableDomains(firstTime);
}
