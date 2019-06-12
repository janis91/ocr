import { Configuration } from '../configuration/configuration';
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

    /**
     * Filters an array of files for the correct MIME type and
     * returns an array with only supported files.
     * @param files The array of files that should be filtered.
     * @returns The filtered resulting array.
     */
    public filterFilesWithMimeTypes(files: Array<OCAFile>): Array<OCAFile> {
        if (files === undefined) { return []; }
        return files.filter(file => Configuration.allowedMimeTypes.indexOf(file.mimetype) !== -1);
    }
}
