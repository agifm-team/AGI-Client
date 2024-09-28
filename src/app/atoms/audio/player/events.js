const evt = {
  backSpace: 8,
  tab: 9,
  clear: 12,
  return: 13,
  shift: 16,
  ctrl: 17,
  alt: 18,
  esc: 27,
  arrowLeft: 37,
  arrowUp: 38,
  arrowRight: 39,
  arrowDown: 40,
  delete: 46,
  home: 36,
  end: 35,
  pageUp: 33,
  pageDown: 34,
  insert: 45,
  capsLock: 20,
  leftCommand: 91,
  rightCommand: 93,
  mozillaCommand: 224,
  rightWindowsStart: 92,
  pause: 19,
  space: 32,
  help: 47,
  leftWindow: 91,
  select: 93,
  numPad0: 96,
  numPad1: 97,
  numPad2: 98,
  numPad3: 99,
  numPad4: 100,
  numPad5: 101,
  numPad6: 102,
  numPad7: 103,
  numPad8: 104,
  numPad9: 105,
  numPadMultiply: 106,
  numPadPlus: 107,
  numPadEnter: 108,
  numPadMinus: 109,
  numPadPeriod: 110,
  numPadDivide: 111,
  f1: 112,
  f2: 113,
  f3: 114,
  f4: 115,
  f5: 116,
  f6: 117,
  f7: 118,
  f8: 119,
  f9: 120,
  f10: 121,
  f11: 122,
  f12: 123,
  f13: 124,
  f14: 125,
  f15: 126,
  numLock: 144,
  scrollLock: 145,
  m: 77,
};

evt.keyCodes = Object.keys(evt).reduce((obj, name) => {
  obj[evt[name]] = name;
  return obj;
}, {});

export default evt;
