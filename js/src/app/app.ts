import { Util } from './util/util';
import { OcaService } from './service/oca.service';
import { Controller } from './controller/controller';
import { View } from './view/view';
import * as handlebarsDropdownTemplate from './view/templates/ocr.hbs';
import { TesseractService } from './service/tesseract.service';
import { OC, OCA } from 'global-oc-types';


declare const OC: OC;
declare const OCA: OCA;

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
    private util: Util;
    private view: View;
    private ocaService: OcaService;
    private tesseractService: TesseractService;
    private controller: Controller;

    constructor() {
        const interval = setInterval(() => {
            if (OcaService.checkOCAvailability()) {
                this.util = new Util();
                this.view = new View(OC.Notification, handlebarsDropdownTemplate, document);
                this.ocaService = new OcaService(OC, OCA);
                this.tesseractService = new TesseractService(this.ocaService);
                this.controller = new Controller(this.util, this.view, this.tesseractService, this.ocaService, document);
                try {
                    this.controller.init();
                } catch (e) {
                    console.error(e);
                    this.view.displayError(e.message);
                }
                clearInterval(interval);
            }
        }, 100);
    }
}

export const $app = new App();
