import { TesseractService } from '../../../src/app/service/tesseract.service';
import { windowAny } from '../../fixtures/fixtures';

describe("The tesseractService's", () => {

    let cut: TesseractService;
    let count: number;

    beforeEach(async () => {
        windowAny.Tesseract = {
            TesseractWorker: WorkerMock,
        };
        count = 0;
        cut = new (await import('../../../src/app/service/tesseract.service')).TesseractService();
    });

    describe('process function', () => {
        it('should resolve the worker result (pdf) for a given url and single language.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: new Uint8Array(1),
                },
            };
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);

            const result = cut.process('url', ['deu']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(worker.recognize).toHaveBeenCalledWith('url', 'deu', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });

        it('should resolve the worker result (pdf) for a given canvas and single language.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: new Uint8Array(1),
                },
            };
            const canvas = document.createElement('canvas');
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);

            const result = cut.process(canvas, ['deu']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(worker.recognize).toHaveBeenCalledWith(canvas, 'deu', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });

        it('should resolve the worker result (pdf) for a given url and multiple languages.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: new Uint8Array(1),
                },
            };
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);

            const result = cut.process('url', ['deu', 'eng']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(worker.recognize).toHaveBeenCalledWith('url', 'deu+eng', {
                'pdf_auto_download': false,
                'pdf_bin': true,
                'tessedit_create_pdf': '1',
            });
        });

        it('should resolve the worker result (pdf) for a given canvas and multiple languages.', async () => {
            const worker = new WorkerMock();
            const resultPdf = {
                files: {
                    pdf: new Uint8Array(1),
                },
            };
            const canvas = document.createElement('canvas');
            worker.recognize.and.returnValue(Promise.resolve(resultPdf));
            spyOn(cut, 'getNextTesseractWorker').and.returnValue(worker as any);

            const result = cut.process(canvas, ['deu', 'eng']);

            await expectAsync(result).toBeResolvedTo(resultPdf.files.pdf);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
            expect(worker.recognize).toHaveBeenCalledWith(canvas, 'deu+eng', {
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

            const result = cut.process('url', ['deu']);

            await expectAsync(result).toBeRejectedWith(error);
            expect(cut.getNextTesseractWorker).toHaveBeenCalledTimes(1);
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
