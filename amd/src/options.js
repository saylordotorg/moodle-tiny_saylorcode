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
 * Options for the Saylor Code Studio Tiny plugin.
 *
 * @module      tiny_saylorcode/options
 * @copyright   2026 Saylor Academy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getPluginOptionName} from 'editor_tiny/options';
import {pluginName} from 'tiny_saylorcode/common';

const stableIdPatternName = getPluginOptionName(pluginName, 'stableidpattern');

/**
 * Register the options this plugin reads.
 *
 * @param {TinyMCE} editor The editor instance.
 */
export const register = (editor) => {
    const registerOption = editor.options.register;

    registerOption(stableIdPatternName, {
        processor: 'string',
        "default": '',
    });
};

/**
 * The stable id pattern, supplied by the server.
 *
 * Shared rather than retyped in JavaScript so the client side check cannot
 * drift from the definition the server enforces.
 *
 * @param {TinyMCE} editor The editor instance.
 * @returns {string} The pattern body, without delimiters.
 */
export const getStableIdPattern = (editor) => editor.options.get(stableIdPatternName);
