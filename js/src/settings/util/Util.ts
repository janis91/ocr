/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class Util {

    public static isDefinedIn: (variable: string, obj: {[prop: string]: any}) => boolean = (variable, obj) => {
        return typeof obj[variable] !== 'undefined' && obj[variable] !== null;
    }
}
