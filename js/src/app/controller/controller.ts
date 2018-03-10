import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { Util } from '../util/util';
import { IStatus } from './poto/status.poto';
import { IFile, File } from './poto/file.poto';
import { HttpService } from '../service/http.service';
import { OcaService } from '../service/oca.service';
import { View } from '../view/view';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

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

    private _selectedFiles: Array<IFile>;
    private _availableLanguages: Array<string>;
    private _status: IStatus;

    constructor(private util: Util, private view: View, private httpService: HttpService,
        private ocaService: OcaService, private document: Document, private jquery: JQueryStatic) { }

    /**
     * Initializes the Controller / OCR functions in the frontend of Nextcloud.
     */
    public init(): void {
        this.checkRedis().done(() => {
            this.startEverything();
        }).fail((message: string) => {
            this.view.displayError(`${message}`);
        });
    }

    /**
     * Setup all the Events and load the languages and start the app.
     */
    public startEverything() {
        this.loadLanguages();
        this.registerEvents();
        this.view.renderSelectedFilesActionButton();
        this.loopForStatus();
    }

    /**
     * Destroys the OCR functions.
     */
    public destroy(): void {
        this.view.destroy();
        this.ocaService.destroy();
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    public registerEvents(): void {
        // Register click events for the OCR view
        this.document.addEventListener('click', (event: any): any => {
            this.clickOnOtherEvent(event);
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'processOCR') {
                this.clickOnProcessButtonEvent();
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });

        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'selectedFilesOCR' || event.target.parentNode.id === 'selectedFilesOCR') {
                this.clickOnTopBarSelectedFilesActionButton();
                event.preventDefault();
                event.stopImmediatePropagation();
            }
        });

        // Register click events on file menu OCR option
        this.ocaService.registerFileActions();

        // Register checkbox events
        this.ocaService.registerCheckBoxEvents(this);
    }

    /**
     * Checks if the click events target was the OCR dropdown or not.
     * @param event The click event.
     */
    public clickOnOtherEvent(event: any): void {
        if (this.view.checkClickOther(event)) {
            this.selectedFiles = [];
            if (this.ocaService.getSelectedFiles().length === 0) {
                this.view.toggleSelectedFilesActionButton(false);
            }
        }
    }

    /**
     * Triggers the OCR process for the selectedFiles array
     * and toggles the "pending" state for the ocr process.
     */
    public clickOnProcessButtonEvent(): void {
        if (this.selectedFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'No file selected.')}`);
            this.view.destroyDropdown();
            return;
        }
        const filteredFiles: Array<IFile> = this.util.filterFilesWithMimeTypes(this.selectedFiles);
        if (filteredFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'MIME type not supported.')}`);
            this.view.destroyDropdown();
            return;
        }
        const selectedLanguages: Array<string> = this.view.getSelectTwoValues().length > 0 ? this.view.getSelectTwoValues() : ['any'];
        const replace = this.view.getReplaceValue();
        this.httpService.startProcess(filteredFiles, selectedLanguages, replace).done(() => {
            this.togglePendingState(true, filteredFiles.length);
            this.selectedFiles = [];
            setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500);
        }).fail((jqXHR: JQueryXHR) => {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${jqXHR.responseText}`);
        }).always(() => {
            this.view.destroyDropdown();
        });
    }

    /**
     * Triggers the rendering of the OCR dropdown for the top bar
     * selected files action button and sets the selectedFiles.
     */
    public clickOnTopBarSelectedFilesActionButton(): void {
        this.view.renderFileAction(undefined, this.availableLanguages);
        this.selectedFiles = this.ocaService.getSelectedFiles();
    }

    /**
     * Triggers the view to show the selected files action button in the top bar
     * and sets the selectedFiles array.
     */
    public toggleSelectedFilesActionButton(): void {
        const selFiles: Array<IFile> = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
        if (selFiles.length > 0) {
            this.view.toggleSelectedFilesActionButton(true);
            this.selectedFiles = selFiles;
        } else {
            this.view.toggleSelectedFilesActionButton(false);
            this.selectedFiles = [];
        }
    }

    /**
     * Loops as long as there are pending files in the OCR queue.
     */
    public loopForStatus(): void {
        this.jquery.when(this.checkStatus()).done(() => {
            if (this.status.failed > 0) {
                // tslint:disable-next-line:max-line-length
                this.view.displayError(n('ocr', 'OCR processing for %n file failed. For details please go to your personal settings.', 'OCR processing for %n files failed. For details please go to your personal settings.', this.status.failed));
            }
            if (this.status.pending > 0) {
                if (this.status.processed > 0) { this.updateFileList(); }
                this.togglePendingState(false);
                setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500);
            } else {
                if (this.status.processed > 0) { this.updateFileList(); }
                this.togglePendingState(false);
            }
        }).fail((message: string) => {
            this.view.displayError(`${t('ocr', 'OCR status could not be retrieved:')} ${message}`);
            setTimeout(this.jquery.proxy(this.loopForStatus, self), 4500);
        });
    }

    /**
     * Reloads the OCA.Files.App.fileList.
     */
    public updateFileList(): void {
        this.ocaService.reloadFilelist();
        this.toggleSelectedFilesActionButton();
    }

    /**
     * Trigger the pending notification for the first time (with initialcount)
     * or after that without initialcount.
     * @param force If new files in queue or already in the regular loop.
     * @param initialcount How much files initially to process (number or undefined as the param is optional).
     */
    public togglePendingState(force: boolean, initialcount?: number) {
        this.view.togglePendingNotification(force, initialcount !== undefined ? initialcount : this.status.pending);
    }

    /**
     * Triggers the view to hide the selected files action button in the top bar
     * and empties the selectedFiles array.
     */
    public hideSelectedFilesActionButton(): void {
        this.view.toggleSelectedFilesActionButton(false);
        this.selectedFiles = [];
    }

    /**
     * Retrieves the status of the OCR process.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public checkStatus(): JQueryPromise<{}> {
        const deferred = this.jquery.Deferred();
        this.httpService.checkStatus().done((status: IStatus) => {
            this.status = status;
            deferred.resolve(status);
        }).fail((jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR.responseText);
        });
        return deferred.promise();
    }

    /**
     * Retrieves the redis settings evaluation bool.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public checkRedis(): JQueryPromise<{}> {
        const deferred = this.jquery.Deferred();
        this.httpService.checkRedisSettings().done((response: IRedisResponse) => {
            deferred.resolve(response);
        }).fail((jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR.responseText);
        });
        return deferred.promise();
    }

    /**
     * Retrieves the available languages for the OCR process.
     */
    public loadLanguages(): void {
        this.httpService.loadAvailableLanguages().done((response: ILanguageResponse) => {
            const languages: string[] = response.languages.split(';');
            if (languages.length === 0) {
                throw new Error(t('ocr', 'No languages available for OCR processing. Please make sure to configure the languages in the administration section.'));
            }
            this.availableLanguages = languages;
        }).fail((jqXHR: JQueryXHR) => {
            this.view.displayError(`${t('ocr', 'Available languages could not be retrieved:')} ${jqXHR.responseText}`);
        });
    }

    public get status(): IStatus {
        return this._status;
    }

    public set status(value: IStatus) {
        this._status = value;
    }

    public get availableLanguages(): Array<string> {
        return this._availableLanguages;
    }

    public set availableLanguages(value: Array<string>) {
        this._availableLanguages = value;
    }

    public get selectedFiles(): Array<IFile> {
        return this._selectedFiles;
    }

    public set selectedFiles(value: Array<IFile>) {
        this._selectedFiles = value;
    }
}

interface ILanguageResponse {
    languages: string;
}

interface IRedisResponse {
    set: boolean;
}
