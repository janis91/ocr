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
     * Retrieve the jobs of the OCR process.
     * @returns The JQueryXHR object.
     */
    public getAllJobs(): JQueryXHR {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Delete a jobs object.
     * @returns The JQueryXHR object.
     */
    public deleteJob(id: number): JQueryXHR {
        const options: JQueryAjaxSettings = {
            data: {
                id: id,
            },
            method: 'DELETE',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }
}
