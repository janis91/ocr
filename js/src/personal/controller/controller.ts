import { IStatus } from './poto/status.poto';
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

    private _status: Array<IStatus> = [];

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
     * Retrieves the status objects of OCR.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public loadAndRender(): void {
        this.httpService.getAllStatus().always(() => {
            this.view.destroy();
        }).done((status: Array<IStatus>) => {
            this.status = status;
            this.view.render(this.status);
        }).fail((jqXHR: JQueryXHR) => {
            this.view.displayMessage(`${this.t('ocr', 'OCR status could not be retrieved:')} ${jqXHR.responseText}`, true);
            this.status = [];
            this.view.render(this.status);
        });
    }

    /**
     * Deletes a status object.
     * @param id The id of the status object to delete.
     */
    public delete(id: number): void {
        this.httpService.deleteStatus(id).done(() => {
            this.view.destroy();
            const status: any = this.status.filter((s: IStatus) => { return s.id === id; }); // TODO: change type and displayed file name
            this.status = this.status.filter((s: IStatus) => {
                return s.id !== id;
            });
            this.view.displayMessage(`${this.t('ocr', 'Following status object has been successfully deleted:')} ${status[0].target}`, false);
            this.view.render(this.status);
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

    public get status(): Array<IStatus> {
        return this._status;
    }

    public set status(value: Array<IStatus>) {
        this._status = value;
    }
}
