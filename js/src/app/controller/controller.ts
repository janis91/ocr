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

    private selectedFiles: Array<IFile>;

    constructor(private util: Util, private view: View, private tesseractService: TesseractService,
        private ocaService: OcaService, private document: Document) { }

    /**
     * Initializes the Controller / OCR functions in the frontend of Nextcloud.
     */
    public init: () => void = () => {
        this.registerEvents();
    }

    /**
     * Destroys the OCR functions.
     */
    public destroy: () => void = () => {
        this.view.destroy();
        this.ocaService.destroy();
    }

    /**
     * Registers the click events for the OCR view, on file menu OCR option and the checkbox events.
     */
    public registerEvents: () => void = () => {
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
        this.ocaService.registerFileActions(this.fileActionHandler);
        this.ocaService.registerCheckBoxEvents(this.toggleSelectedFilesActionButton);
    }

    /**
     * Checks if the click events target was the OCR dialog or not.
     * @param event The click event.
     */
    public clickToExitEvent: (event: any) => void = (event) => {
        if (this.view.checkClickToExit(event)) {
            this.selectedFiles = [];
            this.toggleSelectedFilesActionButton();
        }
    }

    /**
     * Triggers the OCR process for the selectedFiles array
     * and toggles the "pending" state for the ocr process.
     */
    public clickOnProcessButtonEvent: () => Promise<void> = async () => {
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
        this.view.activateBusyState(filteredFiles.length);
        // TODO:
        // error handling
        // pdf service
        const selectedLanguages: Array<string> = this.view.getSelectValues().length > 0 ? this.view.getSelectValues() : ['eng'];
        const replace = this.view.getReplaceValue();
        const tesseractPromises = filteredFiles.map(this.process(selectedLanguages, replace));
        try {
            await Promise.all(tesseractPromises);
        } catch (e) {
            this.view.displayError(`${t('ocr', 'OCR processing failed:')} ${e.message}`);
        }
        this.view.destroyOcrDialog();
    }

    /**
     * Triggers the view to show the selected files action button in the top bar
     * and sets the selectedFiles array.
     */
    public toggleSelectedFilesActionButton: () => void = () => {
        const selFiles: Array<IFile> = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
        if (selFiles.length > 0) {
            this.ocaService.registerMultiSelectMenuItem(this.clickOnTopBarSelectedFilesActionButton);
            this.selectedFiles = selFiles;
        } else {
            this.hideSelectedFilesActionButton();
        }
    }

    /**
     * File action handler for single file actions.
     */
    private fileActionHandler: (ocaFilesFileName: string, context: any) => void = (something, context) => {
        this.selectedFiles = [context.fileInfoModel.attributes];
        this.view.renderFileAction(this.selectedFiles);
    }

    /**
     * Creates the Promise per file for tesseract.
     */
    private process: (selectedLanguages: Array<string>, replace: boolean) => (file: IFile) => Promise<void> = (selectedLanguages, replace) => async (file) => {
        if (file.mimetype === 'application/pdf') {
            console.log('pdf');
            throw new Error();
        }
        const pdf = await this.tesseractService.process(file, selectedLanguages);
        const newPath = this.createPutFileContentsPath(file, replace);
        await this.ocaService.putFileContents(newPath, pdf, replace);
        if (replace && file.mimetype !== 'application/pdf') {
            await this.ocaService.deleteFile(file);
        }
        this.view.addFinishedFileToState();
    }

    /**
     * Triggers the view to hide the selected files action button in the top bar
     * and empties the selectedFiles array.
     */
    private hideSelectedFilesActionButton: () => void = () => {
        this.ocaService.unregisterMultiSelectMenuItem();
        this.selectedFiles = [];
    }

    /**
     * Create the full path name to put the new file.
     */
    private createPutFileContentsPath: (file: IFile, replace: boolean) => string = (file, replace) => {
        const newFileName = file.name.split('.');
        newFileName.pop();
        const postFix = file.mimetype === 'application/pdf' && !replace ? '_ocr' : '';
        return this.ocaService.getCurrentDirectory() + newFileName.join('.') + postFix + '.pdf';
    }

    /**
     * Triggers the rendering of the OCR dialog for the top bar
     * selected files action button and sets the selectedFiles.
     */
    private clickOnTopBarSelectedFilesActionButton: () => void = () => {
        this.view.renderFileAction(this.selectedFiles);
    }
}
