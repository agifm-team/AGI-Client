
// import startTest from './test';

// import helloWorld from './hello-world';
// import sinkingYachts from './sinking.yachts';
import startAgi from './agi-mod';
import customMessages from './messages/customMessages';
import unstoppableDomains from './web3/unstoppableDomains';

import catppuccinTheme from './themes/catppuccin';

export function startCustomThemes() {
    catppuccinTheme();
};

export default function startMods(firstTime) {

    startAgi(firstTime);

    customMessages(firstTime);
    unstoppableDomains(firstTime);

}; 