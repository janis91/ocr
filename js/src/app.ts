import { IMultiTranslation, ISingleTranslation } from './global-oc-functions';
import { Util } from './app/util/util';
import { HttpService } from './app/service/http.service';
import { OcaService } from './app/service/oca.service';
import { Controller } from './app/controller/controller';
import { View } from './app/view/view';
import { Configuration } from './app/configuration/configuration';
import * as handlebarsDropdownTemplate from './app/view/templates/ocr.dropdown.hbs';
import _ from 'underscore';
import $ from 'jquery';


declare var OC: any;
declare var document: any;
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
export class App {

    private config: Configuration;
    private util: Util;
    private view: View;
    private httpService: HttpService;
    private ocaService: OcaService;
    private controller: Controller;

    constructor() {
        _.delay(() => {
            this.config = new Configuration();
            this.util = new Util(this.config);
            this.view = new View(OC.Notification, handlebarsDropdownTemplate, t, n, $, document);
            this.httpService = new HttpService(this.util, this.config, $);
            this.ocaService = new OcaService(t, n, OC);
            this.controller = new Controller(this.util, this.view, this.httpService, this.ocaService, t, n, document, $);
            try {
                this.controller.init();
            } catch (e) {
                console.error(e);
                this.view.displayError(e.message);
            }
        }, 1000);
    }
}

export const $app = new App();
