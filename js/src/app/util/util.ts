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
export class Util {

    constructor(private config: Configuration) { }

    /**
     * Filters an array of files for the correct mimetype and
     * returns an array with only supported files.
     * @param files The array of files that should be filtered.
     * @returns The filtered resulting array.
     */
    public filterFilesWithMimeTypes(files: Array<IFile>): Array<IFile> {
        if (files === undefined) { return []; }
        return files.filter((file: IFile) => {
            return this.config.allowedMimetypes.indexOf(file.mimetype) === -1 ? false : true;
        });
    }

    /**
     * Shrinks down the size of the object to the absolutely minimum (id).
     * @param files The array of files that should be shrinked.
     * @returns An array of reduced files.
     */
    public shrinkFilesToReducedFiles(files: Array<IFile>): Array<IReducedFile> {
        return files.map((file: IFile) => {
            return { id: file.id };
        });
    }
}
