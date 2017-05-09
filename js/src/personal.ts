import { View } from './personal/view/view';
import { ISingleTranslation, IMultiTranslation } from './global-oc-functions';
import { Controller } from './personal/controller/controller';
import { Configuration } from './personal/configuration/configuration';
import { HttpService } from './personal/service/http.service';
import * as handlebarsTableTemplate from './personal/view/templates/ocr.status-table.hbs';
import _ from 'underscore';
import $ from 'jquery';

declare var OC: any;
declare var document: Document;
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
export class Personal {

    private config: Configuration;
    private view: View;
    private httpService: HttpService;
    private controller: Controller;

    constructor() {
        _.delay(() => {
            this.config = new Configuration();
            this.view = new View(OC.Notification, handlebarsTableTemplate, t, $, document);
            this.httpService = new HttpService(this.config, $);
            this.controller = new Controller(this.view, this.httpService, document, $, t);

            try {
                this.controller.init();
            } catch (e) {
                console.error(e);
                this.view.displayMessage(e.message, true);
            }
        }, 1000);
    }
}

export const $personal = new Personal();
