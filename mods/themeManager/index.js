import './theme.scss';
import tinyAPI from '../../src/util/mods';

export default function startTheme() {
  tinyAPI.on(
    'loadThemes',
    (data, insertTheme, removeTheme, getThemeById, getThemeNameById, changeDefaultTypeSystem) => {
      const blackTheme = getThemeById('black-theme');
      const darkTheme = getThemeById('dark-theme');
      if (darkTheme) {
        darkTheme.data = blackTheme.data;
        darkTheme.type = blackTheme.type;
      }

      const darkThemeName = getThemeNameById('dark-theme');
      const blackThemeName = getThemeNameById('black-theme');
      if (darkThemeName) {
        // darkThemeName.text = blackThemeName.text;
        darkThemeName.text = 'Black';
      }

      changeDefaultTypeSystem('dark', 'theme-type-dark-solid');
      removeTheme('black-theme');
    },
  );
}
