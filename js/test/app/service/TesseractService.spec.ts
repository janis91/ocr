import { TesseractService } from '../../../src/app/service/TesseractService';
import { windowAny } from '../../fixtures/fixtures';
import { TesseractError } from '../../../src/app/service/error/TesseractError';
import { OC } from '../../../src/global-oc-types';

describe("The TesseractService's", () => {

    let documentMock: jasmine.SpyObj<Document>;
    let cut: TesseractService;
    let count: number;

    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.Tesseract = {
            TesseractWorker: WorkerMock,
        };
        documentMock = jasmine.createSpyObj('document', ['querySelectorAll']);
        const element = {
            src: '/apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
        };
        documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);
        count = 0;
        cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock);
    });

    describe('constructor', () => {
        it('should construct the tesseract workers with the nextcloud url, given in the src of script.', async () => {
            const element = {
                src: '/apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
            };
            documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);

            cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock);

            expect(cut.tesseractWorkers[0].options.workerPath).toEqual('/apps/ocr/vendor/tesseract.js/worker.min.js');
            expect(cut.tesseractWorkers[0].options.langPath).toEqual('https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast');
            expect(cut.tesseractWorkers[0].options.corePath).toEqual('/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js');
        });

        it('should construct the tesseract workers as is with the nextcloud url, given subtree url in the src of script.', async () => {
            const element = {
                src: '/nextcloud/apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
            };
            documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);

            cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock);

            expect(cut.tesseractWorkers[0].options.workerPath).toEqual('/nextcloud/apps/ocr/vendor/tesseract.js/worker.min.js');
            expect(cut.tesseractWorkers[0].options.langPath).toEqual('https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast');
            expect(cut.tesseractWorkers[0].options.corePath).toEqual('/nextcloud/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js');
        });

        it('should construct the tesseract workers as is with the nextcloud url, given custom apps url in the src of script.', async () => {
            const element = {
                src: '/nextcloud/custom_apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
            };
            documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);

            cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock);

            expect(cut.tesseractWorkers[0].options.workerPath).toEqual('/nextcloud/custom_apps/ocr/vendor/tesseract.js/worker.min.js');
            expect(cut.tesseractWorkers[0].options.langPath).toEqual('https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast');
            expect(cut.tesseractWorkers[0].options.corePath).toEqual('/nextcloud/custom_apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js');
        });

        it('should construct the tesseract workers as is with the nextcloud url, given root based custom apps url in the src of script.', async () => {
            const element = {
                src: '/custom_apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
            };
            documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);

            cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock);

            expect(cut.tesseractWorkers[0].options.workerPath).toEqual('/custom_apps/ocr/vendor/tesseract.js/worker.min.js');
            expect(cut.tesseractWorkers[0].options.langPath).toEqual('https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast');
            expect(cut.tesseractWorkers[0].options.corePath).toEqual('/custom_apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js');
        });
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
            windowAny.t.withArgs('ocr', 'An unexpected error occured during Tesseract processing.')
                .and.returnValue('An unexpected error occured during Tesseract processing.');

            const result = cut.process('url', ['deu']);

            await expectAsync(result).toBeRejectedWith(new TesseractError('An unexpected error occured during Tesseract processing.', 'url', error));
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

    describe('resetRoundRobinIndex function', () => {
        it('should reset round robin index to 0.', () => {
            const result1 = cut.getNextTesseractWorker();
            expect((result1 as any).iAm).toEqual(1);

            cut.resetRoundRobinIndex();

            const result2 = cut.getNextTesseractWorker();
            expect((result2 as any).iAm).toEqual(1);
        });
    });

    class WorkerMock {
        public iAm: number;
        public recognize = jasmine.createSpy('recognize');

        constructor(public options?: any) {
            count++;
            this.iAm = count;
        }
    }
});
