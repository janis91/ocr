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
    private _choices: any = undefined;

    constructor(private notification: any, private ocrTemplateFunction: any, private jquery: JQueryStatic, private document: Document) { }

    /**
     * Destroys the view.
     */
    public destroy(): void {
        this.destroyOcrDialog();
    }

    /**
     * Displays an error for a given message.
     * @param message The message to display.
     */
    public displayError(message: string): void {
        this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
    }

    /**
     * Destroys the dropdown if existing.
     */
    public destroyOcrDialog(): void {
        const dialog = this.document.getElementById('ocrDialog');
        if (dialog) {
            this.removeElement(dialog);
            this.choices = undefined;
        }
    }

    /**
     * Renders the OCR dropdown for the FileActionMenu option OR
     * TopBarSelectedFilesAction button depending on an input file.
     * @param fileName The file name given by the OCA.files menu action.
     * @param languages The languages available.
     */
    public renderFileAction(files: Array<IFile>): void {
        const html = this.renderOcrDialog(files);
        this.appendHtmlToElement(html, this.document.querySelector('body'));
        this.renderSelect();
    }

    /**
     * Determines if the ocrDialog was clicked or not.
     * @param event The click event.
     * @returns If clicked beside the dialog or not.
     */
    public checkClickToExit(event: any): boolean {
        if (event.target.closest('.ocr-close') || !event.target.closest('.ocr-modal-content')) {
            this.destroyOcrDialog();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the values from select box
     */
    public getSelectValues(): Array<string> {
        return this.choices.getValue(true);
    }

    /**
     * Get value of checkbox
     */
    public getReplaceValue(): boolean {
        return (<HTMLInputElement>this.document.getElementById('ocrReplace')).checked;
    }

    /**
     * Renders the select field.
     */
    public renderSelect(): void {
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
     * Wraps the appendTo function of jQuery.
     * @param html The html to append to the element.
     * @param el The element.
     */
    public appendHtmlToElement(html: string, el: any) {
        this.jquery(html).appendTo(el);
    }

    /**
     * Renders the dropdown with the given languages.
     * @param languages The languages to give as an option for the user.
     * @returns The HTML template by Handlebars.
     */
    private renderOcrDialog(files: Array<IFile>): string {
        this.destroyOcrDialog();
        const template = this.ocrTemplateFunction;
        return template({
            buttonText: t('ocr', 'Process'),
            languages: Configuration.availableLanguages,
            replaceText: t('ocr', 'Replace'),
            title: files.length === 1 ? `${t('ocr', 'OCR')}: ${files[0].name}` : `${t('ocr', 'OCR')}: ${n('ocr', '%n file', '%n files', files.length)}`,
        });
    }

    /**
     * Removes an element from the DOM.
     * @param el The element to remove.
     */
    private removeElement(el: Element) {
        el.parentNode.removeChild(el);
    }

    public get choices(): any {
        return this._choices;
    }

    public set choices(choices: any) {
        this._choices = choices;
    }
}
