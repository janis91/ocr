import { Configuration } from '../configuration/configuration';
import { File, IFile } from '../controller/poto/file.poto';
import { Util } from './util';

describe('For the util', () => {

    let configMock: any;
    let cut: Util;
    let ALLOWED_MIMETYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/jp2', 'image/jpm', 'image/jpx', 'image/webp', 'image/gif'];

    beforeEach(() => {
        configMock = jasmine.createSpyObj('config', ['allowedMimetypes']);
        cut = new Util(configMock);
    });

    describe('the filterFilesWithMimeTypes function', () => {
        it('should return only files with right mimetypes.', () => {
            const file1 = new File();
            file1.id = 1;
            file1.mimetype = 'application/pdf';
            const file2 = new File();
            file2.id = 2;
            file2.mimetype = 'wrong-mime';
            const file3 = new File();
            file3.id = 3;
            file3.mimetype = 'image/png';
            const files = [file1, file2, file3];
            configMock.allowedMimetypes = ALLOWED_MIMETYPES;

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(2);
            expect(result).toContain(file1);
            expect(result).toContain(file3);
            expect(result).not.toContain(file2);
        });

        it('should return empty array if no match.', () => {
            const file1 = new File();
            file1.id = 1;
            file1.mimetype = 'wrong-mime';
            const file2 = new File();
            file2.id = 2;
            file2.mimetype = 'wrong-mime';
            const files = [file1, file2];
            configMock.allowedMimetypes = ALLOWED_MIMETYPES;

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(0);
            expect(result).not.toContain(file1);
            expect(result).not.toContain(file2);
        });

        it('should return empty array if input undefined.', () => {
            const files: Array<IFile> = undefined;
            configMock.allowedMimetypes = ALLOWED_MIMETYPES;

            const result = cut.filterFilesWithMimeTypes(files);

            expect(result.length).toBe(0);
        });
    });

    describe('the shrinkFilesToReducedFiles function', () => {
        it('should shrink the input file array to only contain ids for each file.', () => {
            const file1 = new File();
            file1.id = 1;
            file1.mimetype = 'any';
            const file2 = new File();
            file2.id = 2;
            file2.mimetype = 'any';
            const files = [file1, file2];

            const result = cut.shrinkFilesToReducedFiles(files);

            expect(result.length).toBe(2);
            expect(result).toContain({ id: file1.id });
            expect(result).toContain({ id: file2.id });
            expect(result).not.toContain(file1);
            expect(result).not.toContain(file2);
        });
    });
});
