// Module
import moment from 'moment-timezone';
import { getAppearance } from './appearance';
import { objType } from '../tools';
import { appLocale, defaultLocale } from './locale';

// Module Config
moment.locale(defaultLocale);

export const calendarFormat = [
  { text: 'MM/DD/YYYY' },
  { text: 'DD/MM/YYYY' },
  { text: 'YYYY/MM/DD' },
  { text: 'YYYY/DD/MM' },
  { text: 'MM/YYYY/DD' },
  { text: 'DD/YYYY/MM' },
];

export const localeIs12Hours = (tinyLocale) => {
  try {
    const locale = typeof tinyLocale === 'string' ? tinyLocale : appLocale();
    const value = Intl.DateTimeFormat(
      typeof locale === 'string' && locale.length > 0 ? locale : defaultLocale,
      { hour: 'numeric' },
    ).resolvedOptions().hour12;
    return typeof value === 'boolean' ? value : true;
  } catch (err) {
    console.error(err);
    return true;
  }
};

export const momentFormat = {
  calendar: () => {
    const tinyFormat = calendarFormat[Number(getAppearance().calendarFormat)];
    if (objType(tinyFormat, 'object') && typeof tinyFormat.text === 'string')
      return tinyFormat.text;
    return calendarFormat[0].text;
  },

  clock: () => (!getAppearance().is24hours ? 'hh:mm A' : 'HH:mm'),
  clock2: () => (!getAppearance().is24hours ? 'hh:mm:ss A' : 'HH:mm:ss'),
};

// Export Module
export default moment;

if (__ENV_APP__.MODE === 'development') {
  global.moment = moment;
  global.localeIs12Hours = localeIs12Hours;
}
