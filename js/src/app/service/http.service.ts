import { Util } from '../util/util';
import { Configuration } from '../configuration/configuration';
import { IFile, IReducedFile } from '../controller/poto/file.poto';

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

    constructor(private util: Util, private config: Configuration, private jquery: JQueryStatic) { }

    /**
     * Make an Ajax call with content and endpoint specified in the given options.
     * @param opts The settings for the request.
     * @returns The JQueryXHR object.
     */
    public makeRequest(opts: JQueryAjaxSettings): JQueryXHR {
        return this.jquery.ajax(opts);
    }

    /**
     * Send the file ids and languages to Nextcloud and initiate the OCR process.
     * @param files The files to process.
     * @param languages The languages to process the files with.
     * @returns The JQueryXHR object.
     */
    public startProcess(files: Array<IFile>, languages: Array<string>, replace: boolean): JQueryXHR {
        const reducedFiles: Array<IReducedFile> = this.util.shrinkFilesToReducedFiles(files);
        const options: JQueryAjaxSettings = {
            data: {
                files: reducedFiles,
                languages: languages,
                replace: replace,
            },
            method: 'POST',
            url: this.config.jobEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieve the status of the OCR process.
     * @returns The JQueryXHR object.
     */
    public checkStatus(): JQueryXHR {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.statusEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieve all available languages for processing files.
     * @returns A string of languages separated by semicolon.
     */
    public loadAvailableLanguages(): JQueryXHR {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.languagesEndpoint,
        };
        return this.makeRequest(options);
    }

    /**
     * Retrieves the status of the redis settings.
     * @returns A boolean value. True if all is set.
     */
    public checkRedisSettings(): JQueryXHR {
        const options: JQueryAjaxSettings = {
            method: 'GET',
            url: this.config.redisEvaluationEndpoint,
        };
        return this.makeRequest(options);
    }
}
