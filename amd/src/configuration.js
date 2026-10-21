// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Toolbar and menu placement for the Saylor Code Studio Tiny plugin.
 *
 * @module      tiny_saylorcode/configuration
 * @copyright   2026 Saylor Academy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {buttonName} from 'tiny_saylorcode/common';
import {addMenubarItem, addToolbarButton} from 'editor_tiny/utils';

/** @type {string} Moodle's image button and menu item, which ours goes after. */
const imageName = 'tiny_media_image';

/**
 * Whether a toolbar section holds a given button.
 *
 * @param {Array|undefined} toolbar The toolbar configuration.
 * @param {string} section The section name.
 * @param {string} button The button name.
 * @returns {boolean}
 */
const toolbarHas = (toolbar, section, button) => Array.isArray(toolbar)
    && toolbar.some((item) => item.name === section && Array.isArray(item.items) && item.items.indexOf(button) !== -1);

/**
 * Whether a menu holds a given item.
 *
 * @param {Object|undefined} menu The menu configuration.
 * @param {string} section The menu name.
 * @param {string} menuitem The item name.
 * @returns {boolean}
 */
const menuHas = (menu, section, menuitem) => !!menu && !!menu[section]
    && String(menu[section].items).split(' ').indexOf(menuitem) !== -1;

/**
 * Place the button and menu item next to the image control.
 *
 * Core's helpers take the control to follow as an optional last argument,
 * and add nothing at all when that control is missing. The image control
 * belongs to tiny_media, which a site can disable, so the button follows it
 * when it is there and goes at the end of its section when it is not;
 * otherwise the Code Studio button would quietly disappear.
 *
 * @param {Object} instanceConfig The existing editor configuration.
 * @returns {Object} The adjusted configuration.
 */
export const configure = (instanceConfig) => {
    const toolbar = instanceConfig.toolbar;
    const menu = instanceConfig.menu;

    return {
        toolbar: addToolbarButton(toolbar, 'content', buttonName,
            toolbarHas(toolbar, 'content', imageName) ? imageName : null),
        menu: addMenubarItem(menu, 'insert', buttonName,
            menuHas(menu, 'insert', imageName) ? imageName : null),
    };
};
