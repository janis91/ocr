declare var OC: any;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
export class Configuration {
    private _statusEndpoint: string = OC.generateUrl('/apps/ocr/status');
    private _jobEndpoint: string = OC.generateUrl('/apps/ocr');
    private _languagesEndpoint: string = OC.generateUrl('/apps/ocr/languages');
    private _allowedMimetypes: Array<string> = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];
    private _redisEvaluationEndpoint: string = OC.generateUrl('/apps/ocr/redis');

    public get redisEvaluationEndpoint(): string {
        return this._redisEvaluationEndpoint;
    }

    public get statusEndpoint(): string {
        return this._statusEndpoint;
    }

    public get jobEndpoint(): string {
        return this._jobEndpoint;
    }

    public get allowedMimetypes(): Array<string> {
        return this._allowedMimetypes;
    }

    public get languagesEndpoint(): string {
        return this._languagesEndpoint;
    }
}
