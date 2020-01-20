import { TesseractService } from '../../../src/app/service/TesseractService';
import { windowAny } from '../../fixtures/fixtures';
import { TesseractError } from '../../../src/app/service/error/TesseractError';

describe("The TesseractService's", () => {

    let documentMock: jasmine.SpyObj<Document>;
    let tesseractMock: jasmine.SpyObj<any>;
    let worker: jasmine.SpyObj<any>;
    let cut: TesseractService;

    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.Tesseract = {};
        worker = jasmine.createSpyObj('TesseractWorker', ['load', 'loadLanguage', 'initialize', 'setParameters', 'recognize', 'getPDF', 'terminate']);
        tesseractMock = jasmine.createSpyObj('Tesseract', ['createWorker']);
        tesseractMock.OEM = { LSTM_ONLY: 1 };
        documentMock = jasmine.createSpyObj('document', ['querySelectorAll']);
        const element = {
            src: '/apps/ocr/vendor/tesseract.js/worker.min.js?v=8ae2d5f0-2',
        };
        documentMock.querySelectorAll.and.returnValue([element] as any as NodeListOf<HTMLScriptElement>);
        worker.load.and.returnValue(null);
        worker.loadLanguage.and.returnValue(null);
        worker.initialize.and.returnValue(null);
        worker.setParameters.and.returnValue(null);
        worker.recognize.and.returnValue(null);
        worker.terminate.and.returnValue(null);
        cut = new (await import('../../../src/app/service/TesseractService')).TesseractService(documentMock, tesseractMock);
    });

    describe('process function', () => {
        it('should resolve the worker result (pdf) for a given url and single language.', async () => {
            tesseractMock.createWorker.and.returnValue(worker);
            const resultPdf = {
                data: 1,
            };
            worker.getPDF.and.returnValue(resultPdf);

            const result = cut.process('url', ['deu']);

            await expectAsync(result).toBeResolvedTo(new Uint8Array(1));
            expect(worker.load).toHaveBeenCalled();
            expect(worker.loadLanguage).toHaveBeenCalledWith('deu');
            expect(worker.initialize).toHaveBeenCalledWith('deu');
            expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 });
            expect(worker.recognize).toHaveBeenCalledWith('url');
            expect(worker.getPDF).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
            expect(tesseractMock.createWorker).toHaveBeenCalledWith({
                corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
                langPath: 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast',
                workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
            });
        });

        it('should resolve the worker result (pdf) for a given canvas and single language.', async () => {
            const canvas = document.createElement('canvas');
            tesseractMock.createWorker.and.returnValue(worker);
            const resultPdf = {
                data: 1,
            };
            worker.getPDF.and.returnValue(resultPdf);

            const result = cut.process(canvas, ['deu']);

            await expectAsync(result).toBeResolvedTo(new Uint8Array(1));
            expect(worker.load).toHaveBeenCalled();
            expect(worker.loadLanguage).toHaveBeenCalledWith('deu');
            expect(worker.initialize).toHaveBeenCalledWith('deu');
            expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 });
            expect(worker.recognize).toHaveBeenCalledWith(canvas);
            expect(worker.getPDF).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
            expect(tesseractMock.createWorker).toHaveBeenCalledWith({
                corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
                langPath: 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast',
                workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
            });
        });

        it('should resolve the worker result (pdf) for a given url and multiple languages.', async () => {
            tesseractMock.createWorker.and.returnValue(worker);
            const resultPdf = {
                data: 1,
            };
            worker.getPDF.and.returnValue(resultPdf);

            const result = cut.process('url', ['deu', 'eng']);

            await expectAsync(result).toBeResolvedTo(new Uint8Array(1));
            expect(worker.load).toHaveBeenCalled();
            expect(worker.loadLanguage).toHaveBeenCalledWith('deu+eng');
            expect(worker.initialize).toHaveBeenCalledWith('deu+eng');
            expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 });
            expect(worker.recognize).toHaveBeenCalledWith('url');
            expect(worker.getPDF).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
            expect(tesseractMock.createWorker).toHaveBeenCalledWith({
                corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
                langPath: 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast',
                workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
            });
        });

        it('should resolve the worker result (pdf) for a given canvas and multiple languages.', async () => {
            const canvas = document.createElement('canvas');
            tesseractMock.createWorker.and.returnValue(worker);
            const resultPdf = {
                data: 1,
            };
            worker.getPDF.and.returnValue(resultPdf);

            const result = cut.process(canvas, ['deu', 'eng']);

            await expectAsync(result).toBeResolvedTo(new Uint8Array(1));
            expect(worker.load).toHaveBeenCalled();
            expect(worker.loadLanguage).toHaveBeenCalledWith('deu+eng');
            expect(worker.initialize).toHaveBeenCalledWith('deu+eng');
            expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 });
            expect(worker.recognize).toHaveBeenCalledWith(canvas);
            expect(worker.getPDF).toHaveBeenCalled();
            expect(worker.terminate).toHaveBeenCalled();
            expect(tesseractMock.createWorker).toHaveBeenCalledWith({
                corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
                langPath: 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast',
                workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
            });
        });

        it('should reject for a given file and single language, when workerPromise rejects.', async () => {
            const error = new Error('test');
            windowAny.t.withArgs('ocr', 'An unexpected error occured during Tesseract processing.')
                .and.returnValue('An unexpected error occured during Tesseract processing.');
            tesseractMock.createWorker.and.returnValue(worker);
            const resultPdf = {
                data: 1,
            };
            worker.recognize.and.returnValue(Promise.reject(error));
            worker.getPDF.and.returnValue(resultPdf);

            const result = cut.process('url', ['deu']);

            await expectAsync(result).toBeRejectedWith(new TesseractError('An unexpected error occured during Tesseract processing.', 'url', error));
            expect(worker.load).toHaveBeenCalled();
            expect(worker.loadLanguage).toHaveBeenCalledWith('deu');
            expect(worker.initialize).toHaveBeenCalledWith('deu');
            expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 });
            expect(worker.recognize).toHaveBeenCalledWith('url');
            expect(tesseractMock.createWorker).toHaveBeenCalledWith({
                corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
                langPath: 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast',
                workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
            });
        });
    });
});
