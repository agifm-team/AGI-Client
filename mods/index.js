
// import startTest from './test';

// import helloWorld from './hello-world';
// import sinkingYachts from './sinking.yachts';
import customMessages from './customMessages';
import startAgi from './agi-mod';
import unstoppableDomains from './unstoppableDomains';

export default function startMods(firstTime) {

    startAgi(firstTime);

    customMessages(firstTime);
    unstoppableDomains(firstTime);

}; 