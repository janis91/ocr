import { IJob } from './poto/job.poto';
import { ISingleTranslation } from '../../global-oc-functions';
import { HttpService } from '../service/http.service';
import { View } from '../view/view';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
export class Controller {

    private _jobs: Array<IJob> = [];

    constructor(private view: View, private httpService: HttpService, private document: Document, private jquery: JQueryStatic, private t: ISingleTranslation) { }

    /**
     * Initializes the Controller / OCR settings in the frontend of Nextcloud.
     */
    public init() {
        this.loadAndRender();
        this.registerEvents();
    }

    /**
     * Destroys the OCR functions.
     */
    public destroy(): void {
        this.view.destroy();
    }

    /**
     * Retrieves the jobs objects of OCR.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public loadAndRender(): void {
        this.httpService.getAllJobs().always(() => {
            this.view.destroy();
        }).done((jobs: Array<IJob>) => {
            this.jobs = jobs;
            this.view.render(this.jobs);
        }).fail((jqXHR: JQueryXHR) => {
            this.view.displayMessage(`${this.t('ocr', 'OCR jobs could not be retrieved:')} ${jqXHR.responseText}`, true);
            this.jobs = [];
            this.view.render(this.jobs);
        });
    }

    /**
     * Deletes a job object.
     * @param id The id of the job object to delete.
     */
    public delete(id: number): void {
        this.httpService.deleteJob(id).done(() => {
            this.view.destroy();
            const jobs: Array<IJob> = this.jobs.filter((s: IJob) => { return s.id === id; });
            this.jobs = this.jobs.filter((s: IJob) => {
                return s.id !== id;
            });
            this.view.displayMessage(`${this.t('ocr', 'The job for the following file object has been successfully deleted:')} ${jobs[0].originalFilename}`, false);
            this.view.render(this.jobs);
        }).fail((jqXHR: JQueryXHR) => {
            this.view.displayMessage(`${this.t('ocr', 'Error during deletion:')} ${jqXHR.responseText}`, true);
            this.loadAndRender();
        });
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    public registerEvents(): void {
        // Register click events for the OCR view
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'ocr-search') {
                this.loadAndRender();
            }
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'ocr-delete' || event.target.parentNode.id === 'ocr-delete') {
                this.delete(event.target.closest('tr').dataset.id - 0);
            }
        });
    }

    public get jobs(): Array<IJob> {
        return this._jobs;
    }

    public set jobs(value: Array<IJob>) {
        this._jobs = value;
    }
}
