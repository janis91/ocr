import { OCAFileActionHandler, OCAFile } from '../../global-oc-types';
import { Util } from '../util/Util';
import { OcaService } from '../service/OcaService';
import { View } from '../view/View';
import { TesseractService } from '../service/TesseractService';
import { PdfService } from '../service/PdfService';
import { Configuration } from '../configuration/Configuration';
import { HttpService } from '../service/HttpService';

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

    public selectedFiles: Array<OCAFile>;

    constructor(private util: Util, private view: View, private tesseractService: TesseractService,
        private ocaService: OcaService, private pdfService: PdfService, private httpService: HttpService, private document: Document) { }

    /**
     * Initializes the Controller / OCR functions in the frontend of Nextcloud.
     */
    public init: () => void = () => {
        this.setDefaultLanguages();
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
     * Checks if the click events target was the OCR dialog or not.
     * @param event The click event.
     */
    public clickToExitEventHandler: (event: Event) => void = (event) => {
        if (this.view.checkClickToExit(event)) {
            this.selectedFiles = [];
            this.toggleSelectedFilesActionButton();
        }
    }

    /**
     * Checks if click events target was the process button and triggers process if so.
     */
    public clickOnProcessEventHandler: (event: Event) => void = (event) => {
        if ((event.target as HTMLElement).id === 'processOCR') {
            this.clickOnProcessButtonEvent();
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    /**
     * Triggers the OCR process for the selectedFiles array
     * and toggles the "pending" state for the ocr process.
     */
    public clickOnProcessButtonEvent: () => Promise<void> = async () => {
        if (this.selectedFiles.length === 0) {
            this.view.displayError(`${Configuration.TRANSLATION_OCR_PROCESSING_FAILED} ${Configuration.TRANSLATION_NO_FILE_SELECTED}`);
            this.view.destroyOcrDialog();
            return;
        }
        const filteredFiles: Array<OCAFile> = this.util.filterFilesWithMimeTypes(this.selectedFiles);
        if (filteredFiles.length === 0) {
            this.view.displayError(`${Configuration.TRANSLATION_OCR_PROCESSING_FAILED} ${Configuration.TRANSLATION_MIMETYPE_NOT_SUPPORTED}`);
            this.view.destroyOcrDialog();
            return;
        }
        this.view.activateBusyState(filteredFiles.length);
        let selectedLanguages: Array<string> = this.view.getSelectValues();
        selectedLanguages = selectedLanguages.length > 0 ? selectedLanguages : ['eng'];
        const replace = this.view.getReplaceValue();
        try {
            for (let i = 0; i < filteredFiles.length; i++) {
                await this.process(selectedLanguages, replace)(filteredFiles[i]);
            }
        } catch (e) {
            this.view.displayError(`${Configuration.TRANSLATION_OCR_PROCESSING_FAILED} ${e.message}`);
            console.error('An error occured in OCR.', e, e.original);
        }
        this.view.destroyOcrDialog();
    }

    /**
     * Triggers the view to show the selected files action button in the top bar
     * and sets the selectedFiles array.
     */
    public toggleSelectedFilesActionButton: () => void = () => {
        const selFiles: Array<OCAFile> = this.util.filterFilesWithMimeTypes(this.ocaService.getSelectedFiles());
        if (selFiles.length > 0) {
            this.ocaService.registerMultiSelectMenuItem(this.clickOnMultiSelectMenuItemHandler);
            this.selectedFiles = selFiles;
        } else {
            this.hideSelectedFilesActionButton();
        }
    }

    /**
     * Registers the click events for the OCR view, on file menu OCR option and the checkbox events.
     */
    public registerEvents: () => void = () => {
        this.document.addEventListener('click', this.clickToExitEventHandler);
        this.document.addEventListener('click', this.clickOnProcessEventHandler);
        this.ocaService.registerFileActions(this.fileActionHandler);
        this.ocaService.registerCheckBoxEvents(this.toggleSelectedFilesActionButton);
    }

    /**
     * File action handler for single file actions.
     */
    public fileActionHandler: OCAFileActionHandler = (_something, context) => {
        this.selectedFiles = [context.fileInfoModel.attributes];
        this.view.renderFileAction(this.selectedFiles);
    }

    /**
     * Creates the Promise per file for tesseract.
     */
    public process: (selectedLanguages: Array<string>, replace: boolean) => (file: OCAFile) => Promise<void> = (selectedLanguages, replace) => async (file) => {
        let pdf: Uint8Array;
        if (file.mimetype === 'application/pdf') {
            const canvass = await this.pdfService.getDocumentPagesAsScaledImages(this.ocaService.getDownloadUrl(file));
            const pdfs = await this.processStepWise(canvass, selectedLanguages);
            pdf = this.pdfService.createPdfFromBuffers(pdfs);
        } else {
            pdf = await this.tesseractService.process(this.ocaService.getDownloadUrl(file), selectedLanguages);
        }
        const newPath = this.createPutFileContentsPath(file, replace);
        await this.ocaService.putFileContents(newPath, pdf, replace);
        if (replace && file.mimetype !== 'application/pdf') {
            await this.ocaService.deleteFile(file.name);
        }
        this.view.addFinishedFileToState();
    }

    /**
     * Triggers the view to hide the selected files action button in the top bar
     * and empties the selectedFiles array.
     */
    public hideSelectedFilesActionButton: () => void = () => {
        this.ocaService.unregisterMultiSelectMenuItem();
        this.selectedFiles = [];
    }

    /**
     * Create the full path name to put the new file.
     */
    public createPutFileContentsPath: (file: OCAFile, replace: boolean) => string = (file, replace) => {
        const newFileName = file.name.split('.');
        const ending = newFileName[newFileName.length - 1].toLowerCase() === 'pdf' ? newFileName[newFileName.length - 1] : 'pdf';
        newFileName.pop();
        const postFix = file.mimetype === 'application/pdf' && !replace ? '_ocr' : '';
        return this.ocaService.getCurrentDirectory() + newFileName.join('.') + postFix + '.' + ending;
    }

    /**
     * Triggers the rendering of the OCR dialog for the top bar
     * selected files action button and sets the selectedFiles.
     */
    public clickOnMultiSelectMenuItemHandler: () => void = () => {
        this.view.renderFileAction(this.selectedFiles);
    }

    /**
     * Tries to set the default languages, of the user
     */
    public setDefaultLanguages: () => Promise<void> = async () => {
        let languages: string[] = [];
        try {
            languages = await this.httpService.fetchFavoriteLanguages();
        } catch (e) {
            console.error(e);
            this.view.displayError(Configuration.TRANSLATION_UNEXPECTED_ERROR_LOAD_FAVORITE_LANGUAGES);
        }
        this.view.setFavoriteLanguages(languages);
    }

    private processStepWise: (canvass: HTMLCanvasElement[], selectedLanguages: Array<string>) => Promise<Uint8Array[]> = async (canvass, selectedLanguages) => {
        const pdfs = [];
        // Create chunks of 4
        for (let i = 0; i < canvass.length; i += 4) {
            pdfs.push(...(await Promise.all(canvass.slice(i, i + 4).map((canvas) => this.tesseractService.process(canvas, selectedLanguages)))));
        }
        return pdfs;
    }
}
