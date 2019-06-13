import { FilesFixtures } from '../../fixtures/fixtures';
import { OCAFile } from '../../../src/global-oc-types';
import { Util } from '../../../src/app/util/util';

describe("The util's", () => {

    let cut: Util;

    beforeEach(async () => {
        cut = new (await import('../../../src/app/util/util')).Util();
    });

    describe('filterFilesWithMimeTypes function', () => {
        it('should return only files with right mimetypes.', () => {
            const file1 = FilesFixtures.PDF;
            const file2 = FilesFixtures.WRONG_MIME;
            const file3 = FilesFixtures.PNG;
            const files = [file1, file2, file3];

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(2);
            expect(result).toContain(file1);
            expect(result).toContain(file3);
            expect(result).not.toContain(file2);
        });

        it('should return empty array if no match.', () => {
            const file1 = FilesFixtures.WRONG_MIME;
            const file2 = FilesFixtures.WRONG_MIME;
            const files = [file1, file2];

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(0);
            expect(result).not.toContain(file1);
            expect(result).not.toContain(file2);
        });

        it('should return empty array if input undefined.', () => {
            const files: Array<OCAFile> = undefined;

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(0);
        });
    });
});
