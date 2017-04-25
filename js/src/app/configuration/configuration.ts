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
    private _processingEndpoint: string = OC.generateUrl('/apps/ocr');
    private _allowedMimetypes: Array<string> = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];

    public get statusEndpoint(): string {
        return this._statusEndpoint;
    }

    public get processingEndpoint(): string {
        return this._processingEndpoint;
    }

    public get allowedMimetypes(): Array<string> {
        return this._allowedMimetypes;
    }
}
