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
import {addMenubarItemAfter, addToolbarButtonAfter} from 'editor_tiny/utils';

/**
 * Place the button and menu item near the other content insertion controls.
 *
 * @param {Object} instanceConfig The existing editor configuration.
 * @returns {Object} The adjusted configuration.
 */
export const configure = (instanceConfig) => {
    return {
        toolbar: addToolbarButtonAfter(instanceConfig.toolbar, 'content', 'moodleimage', buttonName),
        menu: addMenubarItemAfter(instanceConfig.menu, 'insert', 'moodleimage', buttonName),
    };
};
