import { Configuration } from '../configuration/configuration';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */

export class HttpService {

    constructor(private config: Configuration, private jquery: JQueryStatic) { }

    /**
     * Make an Ajax call with content and endpoint specified in the given options.
     * @param opts The settings for the request.
     * @returns The JQueryXHR object.
     */
    public makeRequest(opts: JQueryAjaxSettings): JQueryXHR {
        return this.jquery.ajax(opts);
    }

    /**
     * Retrieve the status of the OCR process.
     * @returns The JQueryXHR object.
     */
    public getAllStatus(): JQueryXHR {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.personalSettingsEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Delete a status object.
     * @returns The JQueryXHR object.
     */
    public deleteStatus(id: number): JQueryXHR {
        const options: JQueryAjaxSettings = {
            data: {
                id: id,
            },
            method: 'DELETE',
            url: this.config.personalSettingsEndpoint,
        };
        return this.makeRequest(options);
    }
}
