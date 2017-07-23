import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { IFile } from '../controller/poto/file.poto';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
export class View {

    /** Template for the OCR selected file action in the top bar. */
    private readonly _templateOCRSelectedFileAction: string = `
    <span id="selectedActionsOCRId" class="selectedActionsOCR hidden">
        <a id="selectedFilesOCR" href="" class="ocr">
            <span class="icon icon-ocr"></span>
            <span class="pad-for-icon">${this.t('ocr', 'OCR')}</span>
        </a>
    </span>`;

    /** The row of the notification for the pending state. */
    private _notificationRow: number = undefined;

    constructor(private notification: any, private ocrDropdownTemplateFunction: any, private t: ISingleTranslation,
        private n: IMultiTranslation, private jquery: JQueryStatic, private document: Document) { }

    /**
     * Displays an error for a given message.
     * @param message The message to display.
     */
    public displayError(message: string): void {
        this.notification.showHtml(`<div>${this.t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
    }

    /**
     * Renders the dropdown with the given languages.
     * @param languages The languages to give as an option for the user.
     * @returns The HTML template by Handlebars.
     */
    public renderDropdown(languages: Array<string>): string {
        this.destroyDropdown();
        const template = this.ocrDropdownTemplateFunction;
        return template({ languages: languages, buttonText: this.t('ocr', 'Process'), replaceText: this.t('ocr', 'Replace') });
    }

    /**
     * Destroys the dropdown if existing.
     */
    public destroyDropdown(): void {
        const dropdown = this.document.getElementById('ocrDropdown');
        if (dropdown) {
            this.removeElement(dropdown);
        }
    }

    /**
     * Toggles the pending notification on the top of the window.
     * @param force If new files in queue or already in the regular loop.
     * @param count How much files.
     */
    public togglePendingNotification(force: boolean, count: number): void {
        let html: string;
        if (force) {
            // tslint:disable-next-line:max-line-length
            html = `<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span> ${this.n('ocr', 'OCR started: %n new file in queue.', 'OCR started: %n new files in queue.', count)}</span>`;
        } else {
            // tslint:disable-next-line:max-line-length
            html = `<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span> ${this.n('ocr', 'OCR: %n currently pending file in queue.', 'OCR: %n currently pending files in queue.', count)}</span>`;
        }
        if (count > 0 || force) {
            if (this.notificationRow !== undefined) { this.notification.hide(this.notificationRow); }
            this.notificationRow = this.notification.showHtml(html);
        } else {
            if (this.notificationRow !== undefined) {
                this.notification.hide(this.notificationRow);
                this.notificationRow = undefined;
            }
        }
    }

    /**
     * Hides or shows the selected files action button in the top bar.
     * @param show If show or hide.
     */
    public toggleSelectedFilesActionButton(show: boolean): void {
        const selectedActionsOCR = this.document.getElementById('selectedActionsOCRId');
        if (show) {
            this.removeClass(selectedActionsOCR, 'hidden');
        } else {
            this.addClass(selectedActionsOCR, 'hidden');
        }
    }

    /**
     * Renders the OCR dropdown for the FileActionMenu option OR
     * TopBarSelectedFilesAction button depending on an input file.
     * @param fileName The file name given by the OCA.files menu action.
     * @param languages The languages available.
     */
    public renderFileAction(fileName: string, languages: Array<string>): void {
        const html = this.renderDropdown(languages);
        if (fileName !== undefined) {
            const trs: Array<HTMLTableRowElement> = [].slice.call(this.document.querySelectorAll('tr'));
            const tr = trs.filter((element: Element): boolean => {
                return element.getAttribute('data-file') === fileName;
            });
            const tds = tr[0].querySelectorAll('td.filename');
            this.appendHtmlToElement(html, tds);
        } else {
            this.appendHtmlToElement(html, this.document.querySelectorAll('#app-content-files tr th.column-name'));
        }
        this.renderSelectTwo();
    }

    /**
     * Determines if the ocrDropdown was clicked or not.
     * @param event The click event.
     * @returns If clicked beside the dropdown or not.
     */
    public checkClickOther(event: any): boolean {
        if (!event.target.closest('#ocrDropdown')) {
            this.destroyDropdown();
            return true;
        } else {
            return false;
        }
    }

    /**
     * Renders the selected files action button.
     */
    public renderSelectedFilesActionButton(): void {
        this.appendHtmlToElement(this.templateOCRSelectedFileAction, this.document.getElementById('headerName-container'));
    }

    /**
     * Destroys the view.
     */
    public destroy(): void {
        this.destroySelectedFilesActionButton();
        this.destroyDropdown();
    }

    /**
     * Destroys the selected files action button.
     */
    public destroySelectedFilesActionButton(): void {
        this.removeElement(this.document.getElementById('selectedActionsOCRId'));
    }

    /**
     * Get the values from select box
     */
    public getSelectTwoValues(): Array<string> {
        return this.jquery('#ocrLanguage').select2('val');
    }

    /**
     * Get value of checkbox
     */
    public getReplaceValue(): boolean {
        return (<HTMLInputElement>this.document.getElementById('ocrReplace')).checked;
    }

    /**
     * Renders the select2 field.
     */
    public renderSelectTwo(): void {
        this.jquery('#ocrLanguage').select2({
            formatNoMatches: () => {
                return this.t('ocr', 'No matches found.');
            },
            placeholder: this.t('ocr', 'Select language'),
            width: 'element',
        });
    }

    /**
     * Wraps the appenTo function of jQuery.
     * @param html The html to append to the element.
     * @param el The element.
     */
    public appendHtmlToElement(html: string, el: any) {
        this.jquery(html).appendTo(el);
    }

    /**
     * Removes a class name from an elements class list.
     * @param el The element to remove the class from.
     * @param className The class name to remove.
     */
    private removeClass(el: Element, className: string) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * Adds a class name to an elements class list.
     * @param el The element to add the class to.
     * @param className The class name to add.
     */
    private addClass(el: Element, className: string) {
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    /**
     * Removes an element from the DOM.
     * @param el The element to remove.
     */
    private removeElement(el: Element) {
        el.parentNode.removeChild(el);
    }

    public get notificationRow(): number {
        return this._notificationRow;
    }

    public set notificationRow(value: number) {
        this._notificationRow = value;
    }

    public get templateOCRSelectedFileAction(): string {
        return this._templateOCRSelectedFileAction;
    }
}
