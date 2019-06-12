import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { Configuration } from '../configuration/configuration';
import { IFile } from 'app/controller/poto/file.poto';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;
declare var Choices: any;

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
    private choices: any = undefined;
    private finishedFiles: number = undefined;
    private fileCount: number = undefined;

    constructor(private notification: any, private ocrTemplateFunction: any, private document: Document) { }

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
        this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
    }

    /**
     * Activates the progress loading circle
     */
    public activateBusyState: (forFileCount: number) => void = (forFileCount) => {
        this.fileCount = forFileCount;
        this.finishedFiles = 0;
        this.drawFileState();
        this.document.querySelectorAll('.ocr-progress-wrapper').forEach(v => v.classList.remove('ocr-hidden'));
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
            this.choices = undefined;
            this.fileCount = undefined;
            this.finishedFiles = undefined;
        }
    }

    /**
     * Renders the Ocr dialog.
     */
    public renderFileAction: (files: Array<IFile>) => void = (files) => {
        const html: any = this.renderOcrDialog(files);
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
    public checkClickToExit: (event: any) => boolean = (event) => {
        if ((this.fileCount === undefined && this.finishedFiles === undefined) &&
            (event.target.closest('.ocr-close') || !event.target.closest('.ocr-modal-content'))) {
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
            itemSelectText: t('ocr', 'Press to select'),
            noResultsText: t('ocr', 'No matches found'),
            placeholderValue: t('ocr', 'Select language'),
            position: 'bottom',
            removeItemButton: true,
            removeItems: true,
        });
    }

    /**
     * Writes the actual state of the progress.
     */
    private drawFileState: () => void = () => {
        this.getElementById<HTMLSpanElement>('ocrProgressFilesDescription').textContent =
            t('ocr', `{file}/{files} Files`, { file: String(this.finishedFiles), files: String(this.fileCount) });
    }

    /**
     * Renders the dropdown with the given languages.
     * @param languages The languages to give as an option for the user.
     * @returns The HTML template by Handlebars.
     */
    private renderOcrDialog: (files: Array<IFile>) => string = (files) => {
        this.destroyOcrDialog();
        const template = this.ocrTemplateFunction;

        return template({
            buttonText: t('ocr', 'Process'),
            filesQueued: n('ocr', '%n file is being processed:', '%n files are being processed:', files.length),
            languages: Configuration.availableLanguages,
            replaceText: t('ocr', 'Replace target file if existing and delete original file'),
            title: files.length === 1 ? `${t('ocr', 'OCR')}: ${files[0].name}` : `${t('ocr', 'OCR')}: ${n('ocr', '%n file', '%n files', files.length)}`,
        });
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
