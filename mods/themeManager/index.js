import './theme.scss';
import tinyAPI from '../../src/util/mods';

export default function startTheme() {
    tinyAPI.on('loadThemes', (data, insertTheme, removeTheme) => {
        removeTheme('black-theme');
    });
};