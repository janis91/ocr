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
     * Send the languages to the settings endpoint.
     * @param languages The languages that are available in the worker.
     * @returns The JQueryXHR object.
     */
    public sendLanguages(languages: string): JQueryXHR {
        const options: JQueryAjaxSettings = {
            data: {
                languages: languages,
            },
            method: 'POST',
            url: this.config.languagesSettingsEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Send the redis settings to the settings endpoint.
     * @param redisHost The Redis host address.
     * @param redisPort The Redis port number.
     * @param redisDb The Redis database.
     * @returns The JQueryXHR object.
     */
    public sendRedis(redisHost: string, redisPort: string, redisDb: string, redisPassword: string): JQueryXHR {
        const options: JQueryAjaxSettings = {
            data: {
                redisDb: redisDb,
                redisHost: redisHost,
                redisPassword: redisPassword,
                redisPort: redisPort,
            },
            method: 'POST',
            url: this.config.redisSettingsEndpoint,
        };
        return this.makeRequest(options);
    }
}
