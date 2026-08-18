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
 * Insert dialogue for the Saylor Code Studio Tiny plugin.
 *
 * @module      tiny_saylorcode/ui
 * @copyright   2026 Saylor Academy
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';
import ModalSaveCancel from 'core/modal_save_cancel';
import ModalEvents from 'core/modal_events';
import Templates from 'core/templates';
import {component} from 'tiny_saylorcode/common';
import {getStableIdPattern} from 'tiny_saylorcode/options';

/**
 * Heights an author may choose, matching the set the filter accepts.
 *
 * Kept aligned with embed_token::ALLOWED_HEIGHTS so the dialogue cannot offer a
 * value the filter would silently discard.
 *
 * @type {number[]}
 */
const ALLOWED_HEIGHTS = [300, 400, 500, 600, 700, 800];

/**
 * Build the token text for the chosen values.
 *
 * @param {Object} values The form values.
 * @returns {string} A well formed embed token.
 */
const buildToken = (values) => {
    const parts = [
        `exercise=${values.exercise}`,
        `mode=${values.mode}`,
        `version=${values.version}`,
    ];

    if (values.height) {
        parts.push(`height=${values.height}`);
    }
    if (!values.showinstructions) {
        parts.push('showinstructions=false');
    }

    return `[[saylorcode:${parts.join(';')}]]`;
};

/**
 * Read the form values out of the modal body.
 *
 * @param {HTMLElement} root The modal body element.
 * @returns {Object} The chosen values.
 */
const readForm = (root) => {
    const value = (name) => {
        const el = root.querySelector(`[name="${name}"]`);
        return el ? el.value.trim() : '';
    };
    const checked = (name) => {
        const el = root.querySelector(`[name="${name}"]`);
        return el ? el.checked : true;
    };

    return {
        exercise: value('exercise').toUpperCase(),
        mode: value('mode') || 'compact',
        version: value('version').trim() || 'latest',
        height: value('height'),
        showinstructions: checked('showinstructions'),
    };
};

/**
 * Show or clear the validation message for the exercise field.
 *
 * @param {HTMLElement} root The modal body element.
 * @param {string} message The message, or an empty string to clear it.
 */
const setValidationMessage = (root, message) => {
    const field = root.querySelector('[name="exercise"]');
    const feedback = root.querySelector('[data-region="exercise-feedback"]');
    if (!field || !feedback) {
        return;
    }

    feedback.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    field.classList.toggle('is-invalid', Boolean(message));
};

/**
 * Open the insert dialogue and place a token in the editor.
 *
 * The reference is validated against the server supplied pattern before
 * anything is inserted, because a malformed reference produces content that
 * looks fine to the author and renders as nothing for the student
 * (specification section 11.2).
 *
 * @param {TinyMCE} editor The editor instance.
 * @returns {Promise} Resolves once the dialogue has been handled.
 */
export const handleAction = async(editor) => {
    const pattern = getStableIdPattern(editor);
    const [title, invalidMessage] = await Promise.all([
        getString('inserttitle', component),
        getString('invalidstableid', component),
    ]);

    const modal = await ModalSaveCancel.create({
        title,
        body: Templates.render('tiny_saylorcode/insert_form', {
            heights: ALLOWED_HEIGHTS.map((h) => ({value: h})),
        }),
        removeOnClose: true,
        large: false,
    });

    modal.getRoot().on(ModalEvents.save, (e) => {
        const root = modal.getBody()[0];
        const values = readForm(root);

        // An empty or malformed reference must not be inserted. Stopping the
        // save keeps the dialogue open with the message visible, rather than
        // closing and leaving a broken token behind.
        const valid = pattern
            ? new RegExp(pattern).test(values.exercise)
            : values.exercise.length > 0;

        if (!valid) {
            e.preventDefault();
            setValidationMessage(root, invalidMessage);
            return;
        }

        editor.insertContent(buildToken(values));
    });

    modal.show();

    return modal;
};
