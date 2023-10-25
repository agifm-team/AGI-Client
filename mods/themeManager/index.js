import './theme.scss';
import tinyAPI from '../../src/util/mods';

export default function startTheme() {
    tinyAPI.on('loadThemes', (data, insertTheme, removeTheme, getThemeById, getThemeNameById) => {

        removeTheme('black-theme');

        const darkTheme = getThemeById('dark-theme');
        if (darkTheme) darkTheme.type = 'dark-solid';

        const darkThemeName = getThemeNameById('dark-theme');
        if (darkThemeName) darkThemeName.text = 'Black';

    });
};