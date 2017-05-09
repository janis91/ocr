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
    private _languagesSettingsEndpoint: string = OC.generateUrl('/apps/ocr/admin/languages');
    private _redisSettingsEndpoint: string = OC.generateUrl('/apps/ocr/admin/redis');

    public get languagesSettingsEndpoint(): string {
        return this._languagesSettingsEndpoint;
    }

    public get redisSettingsEndpoint(): string {
        return this._redisSettingsEndpoint;
    }
}
