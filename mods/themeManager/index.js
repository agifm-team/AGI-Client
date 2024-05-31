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
        darkTheme.text = blackTheme.text;
        darkTheme.type = blackTheme.type;
      }

      const darkThemeName = getThemeNameById('dark-theme');
      if (darkThemeName) {
        darkThemeName.data = blackTheme.data;
        darkThemeName.text = blackTheme.text;
        darkThemeName.type = blackTheme.type;
      }

      changeDefaultTypeSystem('dark', 'theme-type-dark-solid');
      removeTheme('black-theme');
    },
  );
}
