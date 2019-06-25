import { TesseractService } from '../../../src/app/service/tesseract.service';
import { OcaService } from 'app/service/oca.service';
import { windowAny, FilesFixtures } from '../../fixtures/fixtures';

describe("The tesseractService's", () => {

    let cut: TesseractService;
    let ocaServiceMock: jasmine.SpyObj<OcaService>;
    let count: number;

    beforeEach(async () => {
        windowAny.Tesseract = {
            TesseractWorker: WorkerMock,
        };
        ocaServiceMock = jasmine.createSpyObj('ocaService', ['getDownloadUrl']);
        count = 0;
        cut = new (await import('../../../src/app/service/tesseract.service')).TesseractService(ocaServiceMock);
    });

    describe('process function', () => {
        it('should resolve the worker result (pdf) for a given file and single language.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: {},
                },
            };
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);
            ocaServiceMock.getDownloadUrl.and.returnValue('url');

            const result = cut.process(FilesFixtures.PNG, ['deu']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PNG);
            expect(worker.recognize).toHaveBeenCalledWith('url', 'deu', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });

        it('should resolve the worker result (pdf) for a given file and multiple languages.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: {},
                },
            };
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);
            ocaServiceMock.getDownloadUrl.and.returnValue('url');

            const result = cut.process(FilesFixtures.PNG, ['deu', 'eng']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PNG);
            expect(worker.recognize).toHaveBeenCalledWith('url', 'deu+eng', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });

        it('should reject for a given file and single language, when workerPromise rejects.', async () => {
            const worker = new WorkerMock();
            const error = new Error('test');
            worker.recognize.and.returnValue(Promise.reject(error));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);
            ocaServiceMock.getDownloadUrl.and.returnValue('url');

            const result = cut.process(FilesFixtures.PNG, ['deu']);

            await expectAsync(result).toBeRejectedWith(error);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PNG);
            expect(worker.recognize).toHaveBeenCalledWith('url', 'deu', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });
    });

    describe('getNextTesseractWorker function', () => {
        it('should get the next worker in the list with round robin logic.', () => {
            const workerNumber = navigator.hardwareConcurrency || 4;

            for (let index = 1; index <= workerNumber; index++) {
                const result = cut.getNextTesseractWorker();

                expect((result as any).iAm).toEqual(index);
            }

            expect(cut.tesseractWorkers.length).toEqual(workerNumber);
        });
    });

    class WorkerMock {
        public iAm: number;
        public recognize = jasmine.createSpy('recognize');

        constructor() {
            count++;
            this.iAm = count;
        }
    }
});
