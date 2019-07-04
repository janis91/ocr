import { Util } from './util/Util';
import { OcaService } from './service/OcaService';
import { Controller } from './controller/Controller';
import { View } from './view/View';
import * as handlebarsDropdownTemplate from './view/templates/ocr.hbs';
import { TesseractService } from './service/TesseractService';
import { OC, OCA } from 'global-oc-types';
import { PDFJSStatic } from 'pdfjs-dist';
import { PdfService } from './service/PdfService';
import { PDFDocumentFactory, PDFDocumentWriter } from 'pdf-lib';


declare var OC: OC;
declare var OCA: OCA;
declare var PDFJS: PDFJSStatic;
declare var PDFLib: { PDFDocumentFactory: PDFDocumentFactory, PDFDocumentWriter: PDFDocumentWriter };

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class App {
    public util: Util;
    public view: View;
    public ocaService: OcaService;
    public tesseractService: TesseractService;
    public pdfService: PdfService;
    public controller: Controller;
    public initCounter: number = 0;

    constructor() {
        const interval = setInterval(() => {
            if (Util.isDefinedIn('t', window) && Util.isDefinedIn('n', window) &&
                OcaService.checkOCAvailability() && TesseractService.checkTesseractAvailability() &&
                PdfService.checkPdfUtilAvailability()) {
                this.util = new Util();
                this.view = new View(OC.Notification, handlebarsDropdownTemplate, document);
                this.ocaService = new OcaService(OC, OCA);
                this.tesseractService = new TesseractService(document);
                this.pdfService = new PdfService(PDFJS, PDFLib, document);
                this.controller = new Controller(this.util, this.view, this.tesseractService, this.ocaService, this.pdfService, document);
                try {
                    this.controller.init();
                } catch (e) {
                    console.error(e);
                    this.view.displayError(e.message);
                }
                clearInterval(interval);
            }
            if (this.initCounter === 50) {
                console.error('OCR could not be initiallized. Some of the required resources (OC, OCA, Tesseract, etc.) did not load in time.');
                clearInterval(interval);
            }
            this.initCounter++;
        }, 100);
    }
}

export const $app = new App();
