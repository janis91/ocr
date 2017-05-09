import { IJob } from '../controller/poto/job.poto';
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
     * Renders the jobs table.
     * @param jobs The retrieved jobs objects.
     */
    public render(jobs: Array<IJob>): void {
        const html: string = this.renderTable(jobs);
        this.appendHtmlToElement(html, this.el);
    }

    /**
     * Destroys the view.
     */
    public destroy(): void {
        this.el.innerHTML = '';
    }

    /**
     * Renders the jobs table.
     * @returns The template as string.
     */
    public renderTable(jobs: Array<IJob>): string {
        const template = this.handlebarsTableTemplateFunction;
        const enabled: boolean = jobs && jobs.length > 0 ? true : false;
        return template({
            deleteText: this.t('ocr', 'Delete'),
            enabled: enabled,
            jobs: jobs,
            noPendingOrFailedText: this.t('ocr', 'No pending or failed OCR items found.'),
            refreshButtonText: this.t('ocr', 'Refresh'),
            tableHeadDeleteFromQueueText: this.t('ocr', 'Delete from queue'),
            tableHeadFileText: this.t('ocr', 'File'),
            tableHeadJobText: this.t('ocr', 'Status'),
            tableHeadLogText: this.t('ocr', 'Log'),
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
