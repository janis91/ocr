import { OCNotification, OCAFile } from '../../global-oc-types';
import { Configuration } from '../configuration/Configuration';
import { Common } from '../../common/Common';

declare var Choices: any;

export type OcrHandleBarsTemplate = (options: OcrHandleBarsTemplateOptions) => string;

interface OcrHandleBarsTemplateOptions {
    buttonText: string;
    filesQueued: string;
    hint: string;
    languages: {[value: string]: string};
    replaceText: string;
    title: string;
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
    public finishedFiles: number = undefined;
    public fileCount: number = undefined;
    public favoriteLanguages: string[] = [];

    constructor(private notification: OCNotification, private ocrTemplate: OcrHandleBarsTemplate, private document: Document) { }

    /**
     * Destroys the view.
     */
    public destroy: () => void = () => {
        this.destroyOcrDialog();
    }

    /**
     * Displays an error for a given message.
     * @param message The message to display.
     */
    public displayError: (message: string) => void = (message) => {
        this.notification.showHtml(`<div>${Configuration.TRANSLATION_OCR}: ${message}</div>`, { timeout: 10, type: 'error' });
    }

    /**
     * Activates the progress loading circle
     */
    public activateBusyState: (forFileCount: number) => void = (forFileCount) => {
        this.fileCount = forFileCount;
        this.finishedFiles = 0;
        this.drawFileState();
        this.getElementById<HTMLDivElement>('ocrProgressWrapper').classList.remove('ocr-hidden');
        this.getElementById<HTMLButtonElement>('ocrDialogClose').classList.add('ocr-hidden');
        this.getElementById<HTMLDivElement>('ocrFill').classList.add('ocr-hidden');
        this.getElementById<HTMLButtonElement>('processOCR').classList.add('ocr-hidden');
    }

    /**
     * Updates the state for all finished files
     */
    public addFinishedFileToState: () => void = () => {
        this.finishedFiles++;
        this.drawFileState();
    }

    /**
     * Destroys the dropdown if existing.
     */
    public destroyOcrDialog: () => void = () => {
        const dialog = this.getElementById<HTMLDivElement | null>('ocrDialog');
        if (dialog) {
            this.removeElement(dialog);
        }
        this.choices = undefined;
        this.fileCount = undefined;
        this.finishedFiles = undefined;
    }

    /**
     * Renders the Ocr dialog.
     */
    public renderFileAction: (files: Array<OCAFile>) => void = (files) => {
        const html = this.renderOcrDialog(files);
        const container = this.document.createElement('div');
        container.innerHTML = html;
        this.document.querySelector('body').appendChild(container);
        this.renderSelect();
    }

    /**
     * Determines if the ocrDialog was clicked or not.
     * @param event The click event.
     * @returns If clicked beside the dialog or not.
     */
    public checkClickToExit: (event: Event) => boolean = (event) => {
        if ((this.fileCount === undefined && this.finishedFiles === undefined) &&
            ((event.target as HTMLElement).closest('.ocr-close') || !(event.target as HTMLElement).closest('.ocr-modal-content'))) {
            this.destroyOcrDialog();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the values from select box
     */
    public getSelectValues: () => Array<string> = () => {
        return this.choices.getValue(true);
    }

    /**
     * Get value of checkbox
     */
    public getReplaceValue: () => boolean = () => {
        return this.getElementById<HTMLInputElement>('ocrReplace').checked;
    }

    /**
     * Renders the select field.
     */
    public renderSelect: () => void = () => {
        this.choices = new Choices('#ocrLanguage', {
            duplicateItemsAllowed: false,
            itemSelectText: Configuration.TRANSLATION_PRESS_TO_SELECT,
            noResultsText: Configuration.TRANSLATION_NO_MATCHES_FOUND,
            placeholderValue: Configuration.TRANSLATION_SELECT_LANGUAGE,
            position: 'bottom',
            removeItemButton: true,
            removeItems: true,
        });
        this.choices.setChoiceByValue(this.favoriteLanguages);
    }

    /**
     * Writes the actual state of the progress.
     */
    public drawFileState: () => void = () => {
        this.getElementById<HTMLSpanElement>('ocrProgressFilesDescription').textContent =
            Configuration.TRANSLATION_FILES_SUCCESSFULLY_PROCESSED(String(this.finishedFiles), String(this.fileCount));
    }

    /**
     * Renders the dropdown with the given files.
     * @returns The HTML template by Handlebars.
     */
    public renderOcrDialog: (files: Array<OCAFile>) => string = (files) => {
        this.destroyOcrDialog();
        return this.ocrTemplate({
            buttonText: Configuration.TRANSLATION_PROCESS,
            filesQueued: Configuration.TRANSLATION_FILES_QUEUED(files.length),
            hint: Configuration.TRANSLATION_LARGE_NUMBER_TAKES_VERY_LONG_TIME,
            languages: false || Common.AVAILABLE_LANGUAGES,
            replaceText: Configuration.TRANSLATION_REPLACE_OR_DELETE_ORIGINAL_FILE(files.length),
            title: files.length === 1 ? `${Configuration.TRANSLATION_OCR}: ${files[0].name}` : `${Configuration.TRANSLATION_OCR}: ${Configuration.TRANSLATION_FILE_FILES(files.length)}`,
        });
    }

    /**
     * Sets the favorite languages, that should be selected by default.
     */
    public setFavoriteLanguages: (favoriteLanguages: string[]) => void = (favoriteLanguages) => {
        this.favoriteLanguages = favoriteLanguages;
    }

    /**
     * Get an element by its id.
     */
    private getElementById: <T extends HTMLElement>(id: string) => T | null = <T extends HTMLElement>(id: string) => {
        return this.document.getElementById(id) as T;
    }

    /**
     * Removes an element from the DOM.
     * @param el The element to remove.
     */
    private removeElement: (el: HTMLElement) => void = (el) => {
        el.parentNode.removeChild(el);
    }
}
