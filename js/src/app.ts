import { Util } from './app/util/util';
import { OcaService } from './app/service/oca.service';
import { Controller } from './app/controller/controller';
import { View } from './app/view/view';
import * as handlebarsDropdownTemplate from './app/view/templates/ocr.dropdown.hbs';
import { TesseractService } from './app/service/tesseract.service';


declare var OC: any;
declare var OCA: any;

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
