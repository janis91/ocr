import { OCNotification } from '../../global-oc-types';
import { Configuration } from '../configuration/Configuration';
import { Common } from '../../common/Common';

declare var Choices: any;

export type OcrHandleBarsTemplate = (options: OcrHandleBarsTemplateOptions) => string;

interface OcrHandleBarsTemplateOptions {
    buttonText: string;
    languages: {[value: string]: string};
    hint: string;
}

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class View {

    /** The choices object. */
    public choices: any = undefined;

    constructor(private notification: OCNotification, private ocrTemplate: OcrHandleBarsTemplate, private document: Document) { }

    /**
     * Displays an error for a given message.
     * @param message The message to display.
     */
    public displayError: (message: string) => void = (message) => {
        this.notification.showHtml(`<div>${Configuration.TRANSLATION_OCR}: ${message}</div>`, { timeout: 10, type: 'error' });
    }

    /**
     * Renders the Ocr language choices.
     */
    public init: (favoriteLanguages: string[]) => void = (favLangs) => {
        const html = this.renderOcrLanguageSelect();
        const container = this.document.createElement('div');
        container.innerHTML = html;
        this.document.getElementById('language-settings').appendChild(container);
        this.renderSelect(favLangs);
    }

    /**
     * Renders the select field.
     */
    public renderSelect: (favoriteLanguages: string[]) => void = (favLangs) => {
        this.choices = new Choices('#ocrLanguages', {
            duplicateItemsAllowed: false,
            itemSelectText: Configuration.TRANSLATION_PRESS_TO_SELECT,
            noResultsText: Configuration.TRANSLATION_NO_MATCHES_FOUND,
            placeholderValue: Configuration.TRANSLATION_SELECT_LANGUAGE,
            position: 'bottom',
            removeItemButton: true,
            removeItems: true,
        });
        this.setSelectValues(favLangs);
    }

    /**
     * Constructs the handlebars template.
     * @returns The HTML template by Handlebars.
     */
    public renderOcrLanguageSelect: () => string = () => {
        return this.ocrTemplate({
            buttonText: Configuration.TRANSLATION_SAVE,
            hint: Configuration.TRANSLATION_PRESELECTION_HINT,
            languages: false || Common.AVAILABLE_LANGUAGES,
        });
    }

    /**
     * Get the values from select box
     */
    public getSelectValues: () => Array<string> = () => {
        return this.choices.getValue(true);
    }

    /**
     * Sets the seleted values.
     */
    public setSelectValues: (favoriteLanguages: string[]) => void = (favLangs) => {
        this.choices.setChoiceByValue(favLangs);
    }

    /**
     * Disables the choices select.
     */
    public disableSelect: () => void = () => {
        this.choices.disable();
    }

    /**
     * Enables the choices select.
     */
    public enableSelect: () => void = () => {
        this.choices.enable();
    }

    /**
     * Hide load and show choices.
     */
    public hideLoad: () => void = () => {
        this.document.getElementById('ocrProgressWrapper').classList.add('ocr-hidden');
    }
}
