import { Controller } from '../../../src/app/controller/Controller';
import { Util } from '../../../src/app/util/Util';
import { View } from '../../../src/app/view/View';
import { TesseractService } from '../../../src/app/service/TesseractService';
import { OcaService } from '../../../src/app/service/OcaService';
import { FilesFixtures, windowAny, OCAFileActionsContextFixture } from '../../fixtures/fixtures';
import { PdfService } from '../../../src/app/service/PdfService';
import { HttpService } from '../../../src/app/service/HttpService';

describe("The Controller's", () => {

    let cut: Controller;
    let utilMock: jasmine.SpyObj<Util>;
    let viewMock: jasmine.SpyObj<View>;
    let tesseractServiceMock: jasmine.SpyObj<TesseractService>;
    let ocaServiceMock: jasmine.SpyObj<OcaService>;
    let pdfServiceMock: jasmine.SpyObj<PdfService>;
    let httpServiceMock: jasmine.SpyObj<HttpService>;
    let documentMock: jasmine.SpyObj<Document>;


    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.n = jasmine.createSpy('n');
        utilMock = jasmine.createSpyObj('util', ['filterFilesWithMimeTypes']);
        viewMock = jasmine.createSpyObj('view', ['destroy', 'checkClickToExit', 'displayError', 'destroyOcrDialog',
            'activateBusyState', 'getSelectValues', 'getReplaceValue', 'renderFileAction', 'addFinishedFileToState', 'setFavoriteLanguages']);
        tesseractServiceMock = jasmine.createSpyObj('tesseractService', ['process']);
        ocaServiceMock = jasmine.createSpyObj('ocaService', ['destroy', 'registerFileActions', 'registerCheckBoxEvents',
            'getSelectedFiles', 'registerMultiSelectMenuItem', 'putFileContents', 'deleteFile', 'unregisterMultiSelectMenuItem', 'getCurrentDirectory', 'getDownloadUrl']);
        pdfServiceMock = jasmine.createSpyObj('pdfService', ['getDocumentPagesAsScaledImages', 'createPdfFromBuffers']);
        httpServiceMock = jasmine.createSpyObj('httpService', ['fetchFavoriteLanguages']);
        documentMock = jasmine.createSpyObj('document', ['addEventListener']);
        cut = new (await import('../../../src/app/controller/Controller')).Controller(utilMock, viewMock, tesseractServiceMock, ocaServiceMock, pdfServiceMock, httpServiceMock, documentMock);
    });

    describe('init function', () => {
        it('should initialize the app correctly.', () => {
            spyOn(cut, 'registerEvents').and.returnValue();
            spyOn(cut, 'setDefaultLanguages').and.returnValue(Promise.resolve());

            cut.init();

            expect(cut.registerEvents).toHaveBeenCalledTimes(1);
            expect(cut.setDefaultLanguages).toHaveBeenCalledTimes(1);
        });
    });

    describe('destroy function', () => {
        it('should destroy the view and the ocaService capabilities.', () => {
            cut.destroy();

            expect(viewMock.destroy).toHaveBeenCalled();
            expect(ocaServiceMock.destroy).toHaveBeenCalled();
        });
    });

    describe('clickToExitEvent function', () => {
        it('should set selectedFiles to empty array and toggle selected files action button, if clicked to exit.', () => {
            const event = new MouseEvent('click');
            viewMock.checkClickToExit.and.returnValue(true);
            spyOn(cut, 'toggleSelectedFilesActionButton').and.returnValue();

            cut.clickToExitEventHandler(event);

            expect(viewMock.checkClickToExit).toHaveBeenCalledWith(event);
            expect(cut.selectedFiles).toEqual([]);
        });

        it('should not set selectedFiles to empty array and not toggle selected files action button, if not clicked to exit.', () => {
            const event = new MouseEvent('click');
            viewMock.checkClickToExit.and.returnValue(false);

            cut.clickToExitEventHandler(event);

            expect(viewMock.checkClickToExit).toHaveBeenCalledWith(event);
            expect(cut.selectedFiles).toBeUndefined();
        });
    });

    describe('clickOnProcessEventHandler function', () => {
        it(`should check if the event's target has the right id = "processOCR" and triggers the process if so.`, () => {
            const event = {
                preventDefault: jasmine.createSpy('preventDefault').and.returnValue(''),
                stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation').and.returnValue(''),
                target: { id: 'processOCR' },
            } as unknown as Event;
            spyOn(cut, 'clickOnProcessButtonEvent').and.returnValue(Promise.resolve());

            cut.clickOnProcessEventHandler(event);

            expect(cut.clickOnProcessButtonEvent).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
            expect(event.stopImmediatePropagation).toHaveBeenCalled();
        });

        it(`should check if the event's target has the right id = "processOCR" and does not trigger the process if not.`, () => {
            const event = {
                preventDefault: jasmine.createSpy('preventDefault').and.returnValue(''),
                stopImmediatePropagation: jasmine.createSpy('stopImmediatePropagation').and.returnValue(''),
                target: { id: 'somethingElse' },
            } as unknown as Event;
            spyOn(cut, 'clickOnProcessButtonEvent').and.returnValue(Promise.resolve());

            cut.clickOnProcessEventHandler(event);

            expect(cut.clickOnProcessButtonEvent).not.toHaveBeenCalled();
            expect(event.preventDefault).not.toHaveBeenCalled();
            expect(event.stopImmediatePropagation).not.toHaveBeenCalled();
        });
    });

    describe('clickOnProcessButtonEvent function', () => {
        it('should display an error when selectedFiles are empty and destroy the dialog.', async () => {
            cut.selectedFiles = [];
            windowAny.t.withArgs('ocr', 'OCR processing failed:').and.returnValue('OCR processing failed:');
            windowAny.t.withArgs('ocr', 'No file selected.').and.returnValue('No file selected.');

            await cut.clickOnProcessButtonEvent();

            expect(viewMock.displayError).toHaveBeenCalledWith('OCR processing failed: No file selected.');
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should display an error when filteredFiles are empty and destroy the dropdown.', async () => {
            cut.selectedFiles = [FilesFixtures.WRONG_MIME];
            utilMock.filterFilesWithMimeTypes.and.returnValue([]);
            windowAny.t.withArgs('ocr', 'OCR processing failed:').and.returnValue('OCR processing failed:');
            windowAny.t.withArgs('ocr', 'MIME type not supported.').and.returnValue('MIME type not supported.');

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.displayError).toHaveBeenCalledWith('OCR processing failed: MIME type not supported.');
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should process when one filteredFile exists and language "deu" is set and replace is false.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue(['deu']);
            viewMock.getReplaceValue.and.returnValue(false);
            const process = jasmine.createSpy('process').and.returnValue(Promise.resolve());
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(1);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['deu'], false);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should process when one filteredFile exists and language is not set and replace is false.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue([]);
            viewMock.getReplaceValue.and.returnValue(false);
            const process = jasmine.createSpy('process').and.returnValue(Promise.resolve());
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(1);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['eng'], false);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should process when one filteredFile exists and language "deu" is set and replace is true.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue(['deu']);
            viewMock.getReplaceValue.and.returnValue(true);
            const process = jasmine.createSpy('process').and.returnValue(Promise.resolve());
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(1);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['deu'], true);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should process when multiple filteredFiles exist and language "deu" is set and replace is true.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG, FilesFixtures.PDF];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG, FilesFixtures.PDF]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue(['deu']);
            viewMock.getReplaceValue.and.returnValue(true);
            const process = jasmine.createSpy('process').and.returnValue(Promise.resolve());
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(2);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['deu'], true);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
        });

        it('should display an error with the message of the error when one filteredFile exists and language "deu" is set and replace is true and process rejects.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue(['deu']);
            viewMock.getReplaceValue.and.returnValue(true);
            const process = jasmine.createSpy('process').and.returnValue(Promise.reject(new Error('Some message.')));
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();
            windowAny.t.withArgs('ocr', 'OCR processing failed:').and.returnValue('OCR processing failed:');

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(1);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['deu'], true);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
            expect(viewMock.displayError).toHaveBeenCalledWith('OCR processing failed: Some message.');
        });

        it('should display an error with the message of the error when multiple filteredFiles exist and language "deu" is set and replace is true and process rejects.', async () => {
            cut.selectedFiles = [FilesFixtures.PNG, FilesFixtures.PDF];
            utilMock.filterFilesWithMimeTypes.and.returnValue([FilesFixtures.PNG, FilesFixtures.PDF]);
            viewMock.activateBusyState.and.returnValue();
            viewMock.getSelectValues.and.returnValue(['deu']);
            viewMock.getReplaceValue.and.returnValue(true);
            const process = jasmine.createSpy('process').and.returnValue(Promise.reject(new Error('Some message.')));
            spyOn(cut, 'process').and.returnValue(process);
            viewMock.destroyOcrDialog.and.returnValue();
            windowAny.t.withArgs('ocr', 'OCR processing failed:').and.returnValue('OCR processing failed:');

            await cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(cut.selectedFiles);
            expect(viewMock.activateBusyState).toHaveBeenCalledWith(2);
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(viewMock.getReplaceValue).toHaveBeenCalled();
            expect(cut.process).toHaveBeenCalledWith(['deu'], true);
            expect(viewMock.destroyOcrDialog).toHaveBeenCalled();
            expect(viewMock.displayError).toHaveBeenCalledWith('OCR processing failed: Some message.');
        });
    });

    describe('toggleSelectedFilesActionButton function', () => {
        it('should filter the files that are selected and register the multiselect menu for selected files in oca service AND set the selectedFiles.', () => {
            const selectedFiles = [FilesFixtures.PNG];
            ocaServiceMock.getSelectedFiles.and.returnValue(selectedFiles);
            utilMock.filterFilesWithMimeTypes.and.returnValue(selectedFiles);
            ocaServiceMock.registerMultiSelectMenuItem.and.returnValue();

            cut.toggleSelectedFilesActionButton();

            expect(ocaServiceMock.getSelectedFiles).toHaveBeenCalled();
            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(selectedFiles);
            expect(ocaServiceMock.registerMultiSelectMenuItem).toHaveBeenCalledWith(cut.clickOnMultiSelectMenuItemHandler);
            expect(cut.selectedFiles).toEqual(selectedFiles);
        });

        it('should filter the files that are selected and hide the multiselect menu item for selected files.', () => {
            const selectedFiles = [FilesFixtures.WRONG_MIME];
            ocaServiceMock.getSelectedFiles.and.returnValue(selectedFiles);
            utilMock.filterFilesWithMimeTypes.and.returnValue([]);
            spyOn(cut, 'hideSelectedFilesActionButton').and.returnValue();

            cut.toggleSelectedFilesActionButton();

            expect(ocaServiceMock.getSelectedFiles).toHaveBeenCalled();
            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(selectedFiles);
            expect(cut.hideSelectedFilesActionButton).toHaveBeenCalled();
        });
    });

    describe('registerEvents function', () => {
        it('should register all events.', () => {

            cut.registerEvents();

            expect(documentMock.addEventListener).toHaveBeenCalledTimes(2);
            expect(documentMock.addEventListener.calls.argsFor(0)).toEqual(['click', cut.clickToExitEventHandler]);
            expect(documentMock.addEventListener.calls.argsFor(1)).toEqual(['click', cut.clickOnProcessEventHandler]);
            expect(ocaServiceMock.registerFileActions).toHaveBeenCalled();
            expect(ocaServiceMock.registerCheckBoxEvents).toHaveBeenCalled();
        });
    });

    describe('fileActionHandler function', () => {
        it('should set selected files and render the FileAction for the given file.', () => {

            cut.fileActionHandler(undefined, OCAFileActionsContextFixture.CONTEXT_FOR_PNG);

            expect(cut.selectedFiles).toContain(FilesFixtures.PNG);
            expect(viewMock.renderFileAction).toHaveBeenCalledWith(cut.selectedFiles);
        });

        it('should set selected files and render the FileAction for the given file and ignore the first parameter.', () => {

            cut.fileActionHandler('test', OCAFileActionsContextFixture.CONTEXT_FOR_PNG);

            expect(cut.selectedFiles).toContain(FilesFixtures.PNG);
            expect(viewMock.renderFileAction).toHaveBeenCalledWith(cut.selectedFiles);
        });
    });

    describe('process function', () => {
        it('should return a function "process" for given languages and replace = true, that when executed with PNG, replaces the original file and processes it with tesseract.', async () => {
            const languages = ['deu'];
            const pdf = new Uint8Array(1);
            const newPath = '/file3.pdf';
            tesseractServiceMock.process.and.returnValue(Promise.resolve(pdf));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            ocaServiceMock.putFileContents.and.returnValue(Promise.resolve());
            ocaServiceMock.deleteFile.and.returnValue(Promise.resolve());
            viewMock.addFinishedFileToState.and.returnValue();

            const intermediateResult = cut.process(languages, true);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PNG);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PNG);
            expect(tesseractServiceMock.process).toHaveBeenCalledWith('url', languages);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PNG, true);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, pdf, true);
            expect(ocaServiceMock.deleteFile).toHaveBeenCalledWith(FilesFixtures.PNG.name);
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        it(`should return a function "process" for given languages and replace = false, that when executed with PNG, doesn't replace the original file and processes it with tesseract.`, async () => {
            const languages = ['deu'];
            const pdf = new Uint8Array(1);
            const newPath = '/file3_ocr.pdf';
            tesseractServiceMock.process.and.returnValue(Promise.resolve(pdf));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            ocaServiceMock.putFileContents.and.returnValue(Promise.resolve());
            viewMock.addFinishedFileToState.and.returnValue();

            const intermediateResult = cut.process(languages, false);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PNG);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PNG);
            expect(tesseractServiceMock.process).toHaveBeenCalledWith('url', languages);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PNG, false);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, pdf, false);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        // tslint:disable-next-line: max-line-length
        it(`should return a function "process" for given languages and replace = false, that when executed with single page PDF, doesn't replace the original file and processes the page with tesseract.`, async () => {
            const languages = ['deu'];
            const inputPdf = new Uint8Array(1);
            const outputPdf = new Uint8Array(2);
            const newPath = '/file1_ocr.pdf';
            const canvas = document.createElement('canvas');
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            pdfServiceMock.getDocumentPagesAsScaledImages.and.returnValue(Promise.resolve([canvas]));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            tesseractServiceMock.process.and.returnValue(Promise.resolve(inputPdf));
            pdfServiceMock.createPdfFromBuffers.and.returnValue(outputPdf);

            const intermediateResult = cut.process(languages, false);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PDF);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PDF);
            expect(pdfServiceMock.getDocumentPagesAsScaledImages).toHaveBeenCalledWith('url');
            expect(tesseractServiceMock.process).toHaveBeenCalledWith(canvas, languages);
            expect(pdfServiceMock.createPdfFromBuffers).toHaveBeenCalledWith([inputPdf]);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PDF, false);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, outputPdf, false);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        // tslint:disable-next-line: max-line-length
        it(`should return a function "process" for given languages and replace = false, that when executed with multi page PDF, doesn't replace the original file and processes the individual pages with tesseract and puts them together afterwards.`, async () => {
            const languages = ['deu'];
            const inputPdf1 = new Uint8Array(1);
            const inputPdf2 = new Uint8Array(1);
            const outputPdf = new Uint8Array(2);
            const newPath = '/file1_ocr.pdf';
            const canvas1 = document.createElement('canvas');
            const canvas2 = document.createElement('canvas');
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            pdfServiceMock.getDocumentPagesAsScaledImages.and.returnValue(Promise.resolve([canvas1, canvas2]));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            tesseractServiceMock.process.withArgs(canvas1, languages).and.returnValue(Promise.resolve(inputPdf1));
            tesseractServiceMock.process.withArgs(canvas2, languages).and.returnValue(Promise.resolve(inputPdf2));
            pdfServiceMock.createPdfFromBuffers.and.returnValue(outputPdf);

            const intermediateResult = cut.process(languages, false);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PDF);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PDF);
            expect(pdfServiceMock.getDocumentPagesAsScaledImages).toHaveBeenCalledWith('url');
            expect(tesseractServiceMock.process.calls.argsFor(0)).toEqual([canvas1, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(1)).toEqual([canvas2, languages]);
            expect(pdfServiceMock.createPdfFromBuffers).toHaveBeenCalledWith([inputPdf1, inputPdf2]);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PDF, false);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, outputPdf, false);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        // tslint:disable-next-line: max-line-length
        it(`should return a function "process" for given languages and replace = true, that when executed with single page PDF, replaces the original file and processes the page with tesseract.`, async () => {
            const languages = ['deu'];
            const inputPdf = new Uint8Array(1);
            const outputPdf = new Uint8Array(2);
            const newPath = '/file1.pdf';
            const canvas = document.createElement('canvas');
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            pdfServiceMock.getDocumentPagesAsScaledImages.and.returnValue(Promise.resolve([canvas]));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            tesseractServiceMock.process.and.returnValue(Promise.resolve(inputPdf));
            pdfServiceMock.createPdfFromBuffers.and.returnValue(outputPdf);

            const intermediateResult = cut.process(languages, true);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PDF);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PDF);
            expect(pdfServiceMock.getDocumentPagesAsScaledImages).toHaveBeenCalledWith('url');
            expect(tesseractServiceMock.process).toHaveBeenCalledWith(canvas, languages);
            expect(pdfServiceMock.createPdfFromBuffers).toHaveBeenCalledWith([inputPdf]);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PDF, true);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, outputPdf, true);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        // tslint:disable-next-line: max-line-length
        it(`should return a function "process" for given languages and replace = true, that when executed with multi page PDF, replaces the original file and processes the individual pages with tesseract and puts them together afterwards.`, async () => {
            const languages = ['deu'];
            const inputPdf1 = new Uint8Array(1);
            const inputPdf2 = new Uint8Array(1);
            const outputPdf = new Uint8Array(2);
            const newPath = '/file1.pdf';
            const canvas1 = document.createElement('canvas');
            const canvas2 = document.createElement('canvas');
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            pdfServiceMock.getDocumentPagesAsScaledImages.and.returnValue(Promise.resolve([canvas1, canvas2]));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            tesseractServiceMock.process.withArgs(canvas1, languages).and.returnValue(Promise.resolve(inputPdf1));
            tesseractServiceMock.process.withArgs(canvas2, languages).and.returnValue(Promise.resolve(inputPdf2));
            pdfServiceMock.createPdfFromBuffers.and.returnValue(outputPdf);

            const intermediateResult = cut.process(languages, true);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PDF);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PDF);
            expect(pdfServiceMock.getDocumentPagesAsScaledImages).toHaveBeenCalledWith('url');
            expect(tesseractServiceMock.process.calls.argsFor(0)).toEqual([canvas1, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(1)).toEqual([canvas2, languages]);
            expect(pdfServiceMock.createPdfFromBuffers).toHaveBeenCalledWith([inputPdf1, inputPdf2]);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PDF, true);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, outputPdf, true);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });

        // tslint:disable-next-line: max-line-length
        it(`should return a function "process" for given languages and replace = true, that when executed with multi page PDF (more than 4 pages), replaces the original file and processes the individual pages with tesseract and puts them together afterwards.`, async () => {
            const languages = ['deu'];
            const inputPdf1 = new Uint8Array(1);
            const inputPdf2 = new Uint8Array(1);
            const inputPdf3 = new Uint8Array(1);
            const inputPdf4 = new Uint8Array(1);
            const inputPdf5 = new Uint8Array(1);
            const outputPdf = new Uint8Array(2);
            const newPath = '/file1.pdf';
            const canvas1 = document.createElement('canvas');
            const canvas2 = document.createElement('canvas');
            const canvas3 = document.createElement('canvas');
            const canvas4 = document.createElement('canvas');
            const canvas5 = document.createElement('canvas');
            ocaServiceMock.getDownloadUrl.and.returnValue('url');
            pdfServiceMock.getDocumentPagesAsScaledImages.and.returnValue(Promise.resolve([canvas1, canvas2, canvas3, canvas4, canvas5]));
            spyOn(cut, 'createPutFileContentsPath').and.returnValue(newPath);
            tesseractServiceMock.process.withArgs(canvas1, languages).and.returnValue(Promise.resolve(inputPdf1));
            tesseractServiceMock.process.withArgs(canvas2, languages).and.returnValue(Promise.resolve(inputPdf2));
            tesseractServiceMock.process.withArgs(canvas3, languages).and.returnValue(Promise.resolve(inputPdf3));
            tesseractServiceMock.process.withArgs(canvas4, languages).and.returnValue(Promise.resolve(inputPdf4));
            tesseractServiceMock.process.withArgs(canvas5, languages).and.returnValue(Promise.resolve(inputPdf5));
            pdfServiceMock.createPdfFromBuffers.and.returnValue(outputPdf);

            const intermediateResult = cut.process(languages, true);

            expect(typeof intermediateResult).toBe('function');

            const result = intermediateResult(FilesFixtures.PDF);

            await expectAsync(result).toBeResolved();
            expect(ocaServiceMock.getDownloadUrl).toHaveBeenCalledWith(FilesFixtures.PDF);
            expect(pdfServiceMock.getDocumentPagesAsScaledImages).toHaveBeenCalledWith('url');
            expect(tesseractServiceMock.process.calls.argsFor(0)).toEqual([canvas1, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(1)).toEqual([canvas2, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(2)).toEqual([canvas3, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(3)).toEqual([canvas4, languages]);
            expect(tesseractServiceMock.process.calls.argsFor(4)).toEqual([canvas5, languages]);
            expect(pdfServiceMock.createPdfFromBuffers).toHaveBeenCalledWith([inputPdf1, inputPdf2, inputPdf3, inputPdf4, inputPdf5]);
            expect(cut.createPutFileContentsPath).toHaveBeenCalledWith(FilesFixtures.PDF, true);
            expect(ocaServiceMock.putFileContents).toHaveBeenCalledWith(newPath, outputPdf, true);
            expect(ocaServiceMock.deleteFile).not.toHaveBeenCalled();
            expect(viewMock.addFinishedFileToState).toHaveBeenCalled();
        });
    });

    describe('hideSelectedFilesActionButton function', () => {
        it('should unregister the MultiselectMenuItem and set selectedFiles to an empty array.', () => {
            ocaServiceMock.unregisterMultiSelectMenuItem.and.returnValue();

            cut.hideSelectedFilesActionButton();

            expect(ocaServiceMock.unregisterMultiSelectMenuItem).toHaveBeenCalled();
            expect(cut.selectedFiles.length).toEqual(0);
        });
    });

    describe('createPutFileContentsPath function', () => {
        it('should create the right path (without postfix) for PNG and replace = true.', () => {
            ocaServiceMock.getCurrentDirectory.and.returnValue(FilesFixtures.PNG.path);

            const result = cut.createPutFileContentsPath(FilesFixtures.PNG, true);

            expect(result).toBe('/file3.pdf');
            expect(ocaServiceMock.getCurrentDirectory).toHaveBeenCalled();
        });

        it('should create the right path (without postfix) for PNG and replace = false.', () => {
            ocaServiceMock.getCurrentDirectory.and.returnValue(FilesFixtures.PNG.path);

            const result = cut.createPutFileContentsPath(FilesFixtures.PNG, false);

            expect(result).toBe('/file3.pdf');
            expect(ocaServiceMock.getCurrentDirectory).toHaveBeenCalled();
        });

        it('should create the right path (without postfix) for PDF and replace = true.', () => {
            ocaServiceMock.getCurrentDirectory.and.returnValue(FilesFixtures.PDF.path);

            const result = cut.createPutFileContentsPath(FilesFixtures.PDF, true);

            expect(result).toBe('/file1.pdf');
            expect(ocaServiceMock.getCurrentDirectory).toHaveBeenCalled();
        });

        it('should create the right path (with postfix) for PDF and replace = false.', () => {
            ocaServiceMock.getCurrentDirectory.and.returnValue(FilesFixtures.PDF.path);

            const result = cut.createPutFileContentsPath(FilesFixtures.PDF, false);

            expect(result).toBe('/file1_ocr.pdf');
            expect(ocaServiceMock.getCurrentDirectory).toHaveBeenCalled();
        });

        it('should create the right path (without postfix) for PDF and replace = true, when file name contains multiple "." and uppercase ending.', () => {
            ocaServiceMock.getCurrentDirectory.and.returnValue(FilesFixtures.PDF_UNUSUAL.path);

            const result = cut.createPutFileContentsPath(FilesFixtures.PDF_UNUSUAL, true);

            expect(result).toBe('/file4.cool.PDF');
            expect(ocaServiceMock.getCurrentDirectory).toHaveBeenCalled();
        });
    });

    describe('clickOnTopBarSelectedFilesActionButton function', () => {
        it('should render file action dialog for selected files.', () => {
            viewMock.renderFileAction.and.returnValue();
            cut.selectedFiles = [FilesFixtures.PDF];

            cut.clickOnMultiSelectMenuItemHandler();

            expect(viewMock.renderFileAction).toHaveBeenCalledWith(cut.selectedFiles);
        });
    });

    describe('setDefaultLanguages function', () => {
        it('should fetch favorite languages and set it for the view.', async () => {
            const langs = ['deu'];
            httpServiceMock.fetchFavoriteLanguages.and.returnValue(Promise.resolve(langs));
            viewMock.setFavoriteLanguages.withArgs(langs).and.returnValue();

            await cut.setDefaultLanguages();

            expect(viewMock.setFavoriteLanguages).toHaveBeenCalledWith(langs);
        });

        it('should show an error and set empty array as favorite languages when fetching fails.', async () => {
            httpServiceMock.fetchFavoriteLanguages.and.returnValue(Promise.reject(new Error('test')));
            viewMock.setFavoriteLanguages.withArgs([]).and.returnValue();
            windowAny.t.withArgs('ocr', 'An unexpected error occured during the load of your favorite languages. No language will be set instead.')
                .and.returnValue('An unexpected error occured during the load of your favorite languages. No language will be set instead.');
            viewMock.displayError.withArgs('An unexpected error occured during the load of your favorite languages. No language will be set instead.').and.returnValue();

            await cut.setDefaultLanguages();

            expect(viewMock.setFavoriteLanguages).toHaveBeenCalledWith([]);
            expect(viewMock.displayError).toHaveBeenCalledWith('An unexpected error occured during the load of your favorite languages. No language will be set instead.');
        });
    });
});
