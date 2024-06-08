import './theme.scss';
import tinyAPI from '../../src/util/mods';

export default function startTheme() {
  tinyAPI.on(
    'loadThemes',
    (data, insertTheme, removeTheme, getThemeById, getThemeNameById, changeDefaultTypeSystem) => {
      const blackTheme = getThemeById('black-colors-theme');
      const darkTheme = getThemeById('dark-theme');
      if (darkTheme) {
        darkTheme.data = blackTheme.data;
        darkTheme.type = blackTheme.type;
        darkTheme.coloredIcons = blackTheme.coloredIcons;
      }

      const darkThemeName = getThemeNameById('dark-theme');
      const blackThemeName = getThemeNameById('black-colors-theme');
      if (darkThemeName) {
        // darkThemeName.text = blackThemeName.text;
        darkThemeName.text = 'Black Colors';
      }

      changeDefaultTypeSystem('dark', 'theme-type-dark-solid');
      removeTheme('black-colors-theme');
    },
  );
}
