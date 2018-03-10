import { ISingleTranslation } from './global-oc-functions';
import { HttpService } from './admin/service/http.service';
import { Controller } from './admin/controller/controller';
import { Configuration } from './admin/configuration/configuration';
import _ from 'underscore';
import $ from 'jquery';

declare var OC: any;
declare var document: any;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
export class Admin {

    private config: Configuration;
    private httpService: HttpService;
    private controller: Controller;

    constructor() {
        _.delay(() => {
            this.config = new Configuration();
            this.httpService = new HttpService(this.config, $);
            this.controller = new Controller(this.httpService, OC.Notification, $, document);
            try {
                this.controller.init();
            } catch (e) {
                console.error(e);
                this.controller.displayMessage(e.message, true);
            }
        }, 1000);
    }
}

export const $admin = new Admin();
