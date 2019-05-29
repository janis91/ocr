import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { Util } from '../util/util';
import { IFile } from './poto/file.poto';
import { OcaService } from '../service/oca.service';
import { View } from '../view/view';
import { TesseractService } from '../service/tesseract.service';

declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class Controller {

    private _selectedFiles: Array<IFile>;

    constructor(private util: Util, private view: View, private tesseractService: TesseractService,
        private ocaService: OcaService, private document: Document, private jquery: JQueryStatic) { }

    /**
     * Initializes the Controller / OCR functions in the frontend of Nextcloud.
     */
    public init(): void {
        this.registerEvents();
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
            this.clickToExitEvent(event);
        });
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'processOCR') {
                this.clickOnProcessButtonEvent();
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
     * Checks if the click events target was the OCR dialog or not.
     * @param event The click event.
     */
    public clickToExitEvent(event: any): void {
        if (this.view.checkClickToExit(event)) {
            this.selectedFiles = [];
            this.toggleSelectedFilesActionButton();
        }
    }

    /**
     * Triggers the OCR process for the selectedFiles array
     * and toggles the "pending" state for the ocr process.
     */
    public clickOnProcessButtonEvent(): void {
        if (this.selectedFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'No file selected.')}`);
            this.view.destroyOcrDialog();
            return;
        }
        const filteredFiles: Array<IFile> = this.util.filterFilesWithMimeTypes(this.selectedFiles);
        if (filteredFiles.length === 0) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'MIME type not supported.')}`);
            this.view.destroyOcrDialog();
            return;
        }
        const selectedLanguages: Array<string> = this.view.getSelectValues().length > 0 ? this.view.getSelectValues() : ['eng'];
        const replace = this.view.getReplaceValue();
        // TODO: process
        console.log("Process:", selectedLanguages, filteredFiles);
        this.view.destroyOcrDialog();
        // this.httpService.startProcess(filteredFiles, selectedLanguages, replace).done(() => {
        //     this.togglePendingState(true, filteredFiles.length);
        //     this.selectedFiles = [];
        //     setTimeout(this.jquery.proxy(this.loopForStatus, this), 4500);
        // }).fail((jqXHR: JQueryXHR) => {
        //     this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${jqXHR.responseText}`);
        // }).always(() => {
        //     this.view.destroyDropdown();
        // });
    }

    /**
     * Triggers the view to show the selected files action button in the top bar
     * and sets the selectedFiles array.
     */
    public toggleSelectedFilesActionButton(): void {
        const selFiles: Array<IFile> = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
        if (selFiles.length > 0) {
            this.ocaService.registerMultiSelectMenuItem(this.clickOnTopBarSelectedFilesActionButton.bind(this));
            this.selectedFiles = selFiles;
        } else {
            this.hideSelectedFilesActionButton();
        }
    }

    /**
     * Triggers the view to hide the selected files action button in the top bar
     * and empties the selectedFiles array.
     */
    private hideSelectedFilesActionButton(): void {
        this.ocaService.unregisterMultiSelectMenuItem();
        this.selectedFiles = [];
    }

    /**
     * Triggers the rendering of the OCR dialog for the top bar
     * selected files action button and sets the selectedFiles.
     */
    private clickOnTopBarSelectedFilesActionButton(): void {
        this.view.renderFileAction(this.selectedFiles);
    }

    public get selectedFiles(): Array<IFile> {
        return this._selectedFiles;
    }

    public set selectedFiles(value: Array<IFile>) {
        this._selectedFiles = value;
    }
}
