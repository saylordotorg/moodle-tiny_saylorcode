<?php
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

namespace tiny_saylorcode;

use context;
use editor_tiny\editor;
use editor_tiny\plugin;
use editor_tiny\plugin_with_buttons;
use editor_tiny\plugin_with_configuration;
use editor_tiny\plugin_with_menuitems;

/**
 * Tiny plugin for inserting Saylor Code Studio exercise references.
 *
 * @package    tiny_saylorcode
 * @copyright  2026 Saylor Academy
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class plugininfo extends plugin implements plugin_with_buttons, plugin_with_menuitems, plugin_with_configuration {
    /**
     * Buttons this plugin provides.
     *
     * @return string[]
     */
    public static function get_available_buttons(): array {
        return [
            'tiny_saylorcode/tiny_saylorcode_insert',
        ];
    }

    /**
     * Menu items this plugin provides.
     *
     * @return string[]
     */
    public static function get_available_menuitems(): array {
        return [
            'tiny_saylorcode/tiny_saylorcode_insert',
        ];
    }

    /**
     * Whether the button should be offered in this context.
     *
     * The button inserts a reference to centrally managed content, so it is
     * shown only to users who are allowed to work with that library. Hiding it
     * is a convenience rather than a control: the filter re-checks the
     * reference when it renders, and a token typed by hand is treated exactly
     * the same as one inserted here.
     *
     * @param context $context The context the editor is used in.
     * @param array $options Editor options.
     * @param array $fpoptions File picker options.
     * @param editor|null $editor The editor instance.
     * @return bool
     */
    public static function is_enabled(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): bool {
        return has_capability('local/saylorcode:viewlibrary', $context);
    }

    /**
     * Configuration passed to the JavaScript plugin.
     *
     * The stable id pattern is supplied by the server rather than duplicated in
     * JavaScript, so that the client side check can never drift from the
     * definition the server enforces.
     *
     * @param context $context The context the editor is used in.
     * @param array $options Editor options.
     * @param array $fpoptions File picker options.
     * @param editor|null $editor The editor instance.
     * @return array
     */
    public static function get_plugin_configuration_for_context(
        context $context,
        array $options,
        array $fpoptions,
        ?editor $editor = null
    ): array {
        // Strip the PCRE delimiters so the body can be handed to the JavaScript
        // RegExp constructor. The expression itself is deliberately shared
        // rather than retyped, so the two checks cannot drift apart.
        $pattern = \local_saylorcode\local\stable_id::PATTERN;
        $body = substr($pattern, 1, (int) strrpos($pattern, '/') - 1);

        return [
            'stableidpattern' => $body,
        ];
    }
}
