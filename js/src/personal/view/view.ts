import { IStatus } from '../controller/poto/status.poto';
import { ISingleTranslation } from '../../global-oc-functions';

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

    private _el: Element;

    constructor(private notification: any, private handlebarsTableTemplateFunction: any,
        private t: ISingleTranslation, private jquery: JQueryStatic, private document: Document) {
        this.el = this.document.getElementById('ocr-settings');
    }

    /**
     * Displays a message.
     * @param message The message to display.
     */
    public displayMessage(message: string, error: boolean): void {
        if (error) {
            this.notification.showHtml(`<div>${message}</div>`, { timeout: 10, type: 'error' });
        } else {
            this.notification.showHtml(`<div>${message}</div>`, { timeout: 10 });
        }
    }

    /**
     * Renders the status table.
     * @param status The retrieved status objects.
     */
    public render(status: Array<IStatus>): void {
        const html: string = this.renderTable(status);
        this.appendHtmlToElement(html, this.el);
    }

    /**
     * Destroys the view.
     */
    public destroy(): void {
        this.el.innerHTML = '';
    }

    /**
     * Renders the status table.
     * @returns The template as string.
     */
    public renderTable(status: Array<IStatus>): string {
        const template = this.handlebarsTableTemplateFunction;
        const enabled: boolean = status && status.length > 0 ? true : false;
        return template({
            deleteText: this.t('ocr', 'Delete'),
            enabled: enabled,
            noPendingOrFailedText: this.t('ocr', 'No pending or failed OCR items found.'),
            refreshButtonText: this.t('ocr', 'Refresh'),
            status: status,
            tableHeadDeleteFromQueueText: this.t('ocr', 'Delete from queue'),
            tableHeadNameText: this.t('ocr', 'Name'),
            tableHeadStatusText: this.t('ocr', 'Status'),
        });
    }

    /**
     * Wraps the appenTo function of jQuery.
     * @param html The html to append to the element.
     * @param el The element.
     */
    public appendHtmlToElement(html: string, el: any): void {
        this.jquery(html).appendTo(el);
    }

    public get el(): Element {
        return this._el;
    }

    public set el(value: Element) {
        this._el = value;
    }

}
