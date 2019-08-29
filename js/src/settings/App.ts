import { Controller } from './controller/Controller';
import { View } from './view/View';
import * as handlebarsSettingsTemplate from './view/templates/ocr.hbs';
import { HttpService } from './service/HttpService';
import { OC, OCA, OCSingleTranslation, OCMultiTranslation } from '../global-oc-types';
import { Util } from './util/Util';
import axios from 'axios';

declare var OC: OC;
declare var OCA: OCA;
declare var t: OCSingleTranslation;
declare var n: OCMultiTranslation;

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
    public view: View;
    public httpService: HttpService;
    public controller: Controller;
    public initCounter: number = 0;

    constructor() {
        const interval = setInterval(() => {
            if (Util.isDefinedIn('t', window) && typeof t === 'function' && Util.isDefinedIn('n', window) && typeof n === 'function'
                && Util.isDefinedIn('OC', window) && Util.isDefinedIn('Notification', (window as any).OC)) {
                this.view = new View(OC.Notification, handlebarsSettingsTemplate, document);
                this.httpService = new HttpService(OC, axios);
                this.controller = new Controller(this.view, this.httpService, document);
                this.controller.init()
                    .catch((e) => {
                        console.error(e);
                        this.view.displayError(e.message);
                    });
                clearInterval(interval);
            }
            if (this.initCounter === 50) {
                console.error('OCR could not be initiallized. Some of the required resources (OC, etc.) did not load in time.');
                clearInterval(interval);
            }
            this.initCounter++;
        }, 100);
    }
}

export const $app = new App();
