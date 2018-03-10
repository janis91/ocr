import { IJob } from '../controller/poto/job.poto';
import { ISingleTranslation } from '../../global-oc-functions';

declare var t: ISingleTranslation;

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

    private _el: Element | null;

    constructor(private notification: any, private handlebarsTableTemplateFunction: any, private jquery: JQueryStatic, private document: Document) {
        this.el = this.document.getElementById('ocr-settings');
    }

    /**
     * Displays a message.
     * @param message The message to display.
     */
    public displayMessage(message: string, error: boolean): void {
        if (error) {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10, type: 'error' });
        } else {
            this.notification.showHtml(`<div>${t('ocr', 'OCR')}: ${message}</div>`, { timeout: 10 });
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
        if (this.el !== null) {
            this.el.innerHTML = '';
        }
    }

    /**
     * Renders the jobs table.
     * @returns The template as string.
     */
    public renderTable(jobs: Array<IJob>): string {
        const template = this.handlebarsTableTemplateFunction;
        const enabled: boolean = jobs && jobs.length > 0 ? true : false;
        jobs.forEach((job: any) => {
            job.replace = job.replace === '1' ? true : false;
        });
        return template({
            deleteText: t('ocr', 'Delete'),
            enabled: enabled,
            jobs: jobs,
            noPendingOrFailedText: t('ocr', 'No pending or failed OCR items found.'),
            refreshButtonText: t('ocr', 'Refresh'),
            tableHeadDeleteFromQueueText: t('ocr', 'Delete from queue'),
            tableHeadFileText: t('ocr', 'File'),
            tableHeadJobText: t('ocr', 'Status'),
            tableHeadLogText: t('ocr', 'Log'),
            tableHeadReplaceText: t('ocr', 'Replace by result'),
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
