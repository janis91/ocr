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
    private _personalSettingsEndpoint: string = OC.generateUrl('/apps/ocr/settings/personal');

    public get personalSettingsEndpoint(): string {
        return this._personalSettingsEndpoint;
    }
}
