import { Configuration } from '../configuration/Configuration';
import { OCAFile } from '../../global-oc-types';

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

    /**
     * Filters an array of files for the correct MIME type and
     * returns an array with only supported files.
     * @param files The array of files that should be filtered.
     * @returns The filtered resulting array.
     */
    public filterFilesWithMimeTypes(files: Array<OCAFile>): Array<OCAFile> {
        if (files === undefined) { return []; }
        return files.filter(file => Configuration.ALLOWED_MIMETYPES.indexOf(file.mimetype) !== -1);
    }
}
