import { View, OcrHandleBarsTemplate } from '../../../src/app/view/View';
import { windowAny, FilesFixtures } from '../../fixtures/fixtures';
import { OCNotification } from '../../../src/global-oc-types';
import { Configuration } from '../../../src/app/configuration/Configuration';


describe("The View's", () => {

    let cut: View;
    let notificationMock: jasmine.SpyObj<OCNotification>;
    let ocrTemplateMock: jasmine.Spy<OcrHandleBarsTemplate>;
    let documentMock: jasmine.SpyObj<Document>;


    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.n = jasmine.createSpy('n');
        windowAny.Choices = jasmine.createSpy('Choices');
        notificationMock = jasmine.createSpyObj('notification', ['showHtml']);
        ocrTemplateMock = jasmine.createSpy('ocrTemplate');
        documentMock = jasmine.createSpyObj('document', ['createElement', 'querySelector', 'getElementById']);
        cut = new (await import('../../../src/app/view/View')).View(notificationMock, ocrTemplateMock, documentMock);
    });

    describe('destroy function', () => {
        it('should destroy the dialog correctly.', () => {
            spyOn(cut, 'destroyOcrDialog').and.returnValue();

            cut.destroy();

            expect(cut.destroyOcrDialog).toHaveBeenCalledTimes(1);
        });
    });

    describe('displayError function', () => {
        it('should display an error message.', () => {
            const message = 'test';
            notificationMock.showHtml.and.returnValue({} as JQuery);
            windowAny.t.and.returnValue('OCR');

            cut.displayError(message);

            expect(windowAny.t).toHaveBeenCalledWith('ocr', 'OCR');
            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>OCR: ${message}</div>`, { timeout: 10, type: 'error' });
        });
    });

    describe('activateBusyState function', () => {
        it('should activate the busy state (add and remove ocr-hidden classes respectively) for given file count = 1 and trigger drawing.', () => {
            spyOn(cut, 'drawFileState').and.returnValue();
            const ocrProgressWrapperElement = { classList: jasmine.createSpyObj('classList', ['remove']) } as unknown as HTMLDivElement;
            (ocrProgressWrapperElement.classList.remove as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrProgressWrapper').and.returnValue(ocrProgressWrapperElement);
            const ocrCloseDialogElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLButtonElement;
            (ocrCloseDialogElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrDialogClose').and.returnValue(ocrCloseDialogElement);
            const ocrProcessElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLButtonElement;
            (ocrProcessElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('processOCR').and.returnValue(ocrProcessElement);
            const ocrFillElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLDivElement;
            (ocrFillElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrFill').and.returnValue(ocrFillElement);

            cut.activateBusyState(1);

            expect(cut.fileCount).toEqual(1);
            expect(cut.finishedFiles).toEqual(0);
            expect(ocrProgressWrapperElement.classList.remove).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrCloseDialogElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrProcessElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrFillElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
        });

        it('should activate the busy state (add and remove ocr-hidden classes respectively) for given file count = 2 and trigger drawing.', () => {
            spyOn(cut, 'drawFileState').and.returnValue();
            const ocrProgressWrapperElement = { classList: jasmine.createSpyObj('classList', ['remove']) } as unknown as HTMLDivElement;
            (ocrProgressWrapperElement.classList.remove as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrProgressWrapper').and.returnValue(ocrProgressWrapperElement);
            const ocrCloseDialogElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLButtonElement;
            (ocrCloseDialogElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrDialogClose').and.returnValue(ocrCloseDialogElement);
            const ocrProcessElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLButtonElement;
            (ocrProcessElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('processOCR').and.returnValue(ocrProcessElement);
            const ocrFillElement = { classList: jasmine.createSpyObj('classList', ['add']) } as unknown as HTMLDivElement;
            (ocrFillElement.classList.add as any).and.returnValue();
            documentMock.getElementById.withArgs('ocrFill').and.returnValue(ocrFillElement);

            cut.activateBusyState(2);

            expect(cut.fileCount).toEqual(2);
            expect(cut.finishedFiles).toEqual(0);
            expect(cut.drawFileState).toHaveBeenCalledTimes(1);
            expect(ocrProgressWrapperElement.classList.remove).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrCloseDialogElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrProcessElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
            expect(ocrFillElement.classList.add).toHaveBeenCalledWith('ocr-hidden');
        });
    });

    describe('addFinishedFileToState function', () => {
        it('should add another finished file to the state = 0 and trigger drawing.', () => {
            spyOn(cut, 'drawFileState').and.returnValue();
            cut.finishedFiles = 0;

            cut.addFinishedFileToState();

            expect(cut.drawFileState).toHaveBeenCalledTimes(1);
            expect(cut.finishedFiles).toEqual(1);
        });

        it('should add another finished file to the state = 1 and trigger drawing.', () => {
            spyOn(cut, 'drawFileState').and.returnValue();
            cut.finishedFiles = 1;

            cut.addFinishedFileToState();

            expect(cut.drawFileState).toHaveBeenCalledTimes(1);
            expect(cut.finishedFiles).toEqual(2);
        });
    });

    describe('destroyOcrDialog function', () => {
        it('should check if dialog is open and remove it from the DOM, if so.', () => {
            const element = { parentNode: jasmine.createSpyObj('parentNode', ['removeChild']) };
            element.parentNode.removeChild.and.returnValue();
            documentMock.getElementById.and.returnValue(element as HTMLElement);

            cut.destroyOcrDialog();

            expect(element.parentNode.removeChild).toHaveBeenCalledWith(element);
            expect(documentMock.getElementById).toHaveBeenCalledWith('ocrDialog');
            expect(cut.choices).not.toBeDefined();
            expect(cut.fileCount).not.toBeDefined();
            expect(cut.finishedFiles).not.toBeDefined();
        });

        it('should check if dialog is open and not remove it from the DOM, if not.', () => {
            documentMock.getElementById.and.returnValue(null);

            cut.destroyOcrDialog();

            expect(documentMock.getElementById).toHaveBeenCalledWith('ocrDialog');
            expect(cut.choices).not.toBeDefined();
            expect(cut.fileCount).not.toBeDefined();
            expect(cut.finishedFiles).not.toBeDefined();
        });
    });

    describe('renderFileAction function', () => {
        it('should trigger the rendering of the ocrDialog and append it to the DOM for the given files.', () => {
            const files = [FilesFixtures.PDF, FilesFixtures.PNG];
            spyOn(cut, 'renderOcrDialog').and.returnValue('<div></div>');
            const container = { innerHTML: '' };
            documentMock.createElement.and.returnValue(container as HTMLElement);
            const body = jasmine.createSpyObj('body', ['appendChild']);
            body.appendChild.and.returnValue();
            documentMock.querySelector.and.returnValue(body);
            spyOn(cut, 'renderSelect').and.returnValue();

            cut.renderFileAction(files);

            expect(cut.renderOcrDialog).toHaveBeenCalledWith(files);
            expect(documentMock.createElement).toHaveBeenCalledWith('div');
            expect(container.innerHTML).toEqual('<div></div>');
            expect(body.appendChild).toHaveBeenCalledWith(container);
            expect(cut.renderSelect).toHaveBeenCalled();
        });
    });

    describe('checkClickToExit function', () => {
        it('should return false, when still in progress (fileCount defined).', () => {
            cut.fileCount = 2;

            const result = cut.checkClickToExit({} as Event);

            expect(result).toBeFalsy();
        });

        it('should return false, when still in progress (finishedfiles defined).', () => {
            cut.fileCount = undefined;
            cut.finishedFiles = 1;

            const result = cut.checkClickToExit({} as Event);

            expect(result).toBeFalsy();
        });

        it('should return false, when not in progress but click was not at the right target.', () => {
            cut.fileCount = undefined;
            cut.finishedFiles = undefined;
            const event = { target: jasmine.createSpyObj('target', ['closest']) };
            event.target.closest.withArgs('.ocr-close').and.returnValue(null);
            event.target.closest.withArgs('.ocr-modal-content').and.returnValue({});

            const result = cut.checkClickToExit(event as Event);

            expect(result).toBeFalsy();
        });

        it('should return true and destroy the dialog, when not in progress and clicked on close.', () => {
            cut.fileCount = undefined;
            cut.finishedFiles = undefined;
            const event = { target: jasmine.createSpyObj('target', ['closest']) };
            event.target.closest.withArgs('.ocr-close').and.returnValue({});
            event.target.closest.withArgs('.ocr-modal-content').and.returnValue({});

            const result = cut.checkClickToExit(event as Event);

            expect(result).toBeTruthy();
        });

        it('should return true and destroy the dialog, when not in progress and clicked outside of the dialog.', () => {
            cut.fileCount = undefined;
            cut.finishedFiles = undefined;
            const event = { target: jasmine.createSpyObj('target', ['closest']) };
            event.target.closest.withArgs('.ocr-close').and.returnValue(null);
            event.target.closest.withArgs('.ocr-modal-content').and.returnValue(null);

            const result = cut.checkClickToExit(event as Event);

            expect(result).toBeTruthy();
        });
    });

    describe('getSelectValues function', () => {
        it('should return the choices values.', () => {
            cut.choices = { getValue: jasmine.createSpy('getValue') };
            cut.choices.getValue.and.returnValue(['deu']);

            const result = cut.getSelectValues();

            expect(result).toEqual(['deu']);
            expect(cut.choices.getValue).toHaveBeenCalledWith(true);
        });
    });

    describe('getReplaceValue function', () => {
        it('should return true if checked.', () => {
            const element = { checked: true };
            documentMock.getElementById.and.returnValue(element as HTMLInputElement);

            const result = cut.getReplaceValue();

            expect(result).toBeTruthy();
        });

        it('should return false if not checked.', () => {
            const element = { checked: false };
            documentMock.getElementById.and.returnValue(element as HTMLInputElement);

            const result = cut.getReplaceValue();

            expect(result).toBeFalsy();
        });
    });

    describe('renderSelect function', () => {
        it('should create the new Choices object and assign it to choices property.', () => {
            windowAny.t.withArgs('ocr', 'Press to select').and.returnValue('Press to select');
            windowAny.t.withArgs('ocr', 'No matches found').and.returnValue('No matches found');
            windowAny.t.withArgs('ocr', 'Select language').and.returnValue('Select language');
            const choices = {};
            windowAny.Choices.and.returnValue(choices);

            cut.renderSelect();

            expect(windowAny.t.calls.argsFor(0)).toEqual(['ocr', 'Press to select']);
            expect(windowAny.t.calls.argsFor(1)).toEqual(['ocr', 'No matches found']);
            expect(windowAny.t.calls.argsFor(2)).toEqual(['ocr', 'Select language']);
            expect(cut.choices).toEqual(choices);
            expect(windowAny.Choices).toHaveBeenCalledWith('#ocrLanguage', {
                duplicateItemsAllowed: false,
                itemSelectText: 'Press to select',
                noResultsText: 'No matches found',
                placeholderValue: 'Select language',
                position: 'bottom',
                removeItemButton: true,
                removeItems: true,
            });
        });
    });

    describe('drawFileState function', () => {
        it('should set the text content of the process description to the right state.', () => {
            const element = { textContent: '' };
            documentMock.getElementById.and.returnValue(element as HTMLSpanElement);
            windowAny.t.and.returnValue('1/2 Files successfully processed');
            cut.finishedFiles = 1;
            cut.fileCount = 2;

            cut.drawFileState();

            expect(windowAny.t).toHaveBeenCalledWith('ocr', '{file}/{files} Files successfully processed', { file: '1', files: '2' });
            expect(element.textContent).toEqual('1/2 Files successfully processed');
            expect(documentMock.getElementById).toHaveBeenCalledWith('ocrProgressFilesDescription');
        });
    });

    describe('renderOcrDialog function', () => {
        it('should destroy the old dialog first and return the handlebar result for multiple given files.', () => {
            spyOn(cut, 'destroyOcrDialog').and.returnValue();
            const files = [FilesFixtures.PDF, FilesFixtures.PNG];
            ocrTemplateMock.and.returnValue('<div></div>');
            windowAny.t.withArgs('ocr', 'Process').and.returnValue('Process');
            windowAny.t.withArgs('ocr', 'PDF files and a large number of files may take a very long time.')
                .and.returnValue('PDF files and a large number of files may take a very long time.');
            windowAny.t.withArgs('ocr', 'Replace target file if existing and delete original file')
                .and.returnValue('Replace target file if existing and delete original file');
            windowAny.t.withArgs('ocr', 'OCR').and.returnValue('OCR');
            windowAny.n.withArgs('ocr', '%n file is being processed:', '%n files are being processed:', 2)
                .and.returnValue('2 files are being processed:');
            windowAny.n.withArgs('ocr', '%n file', '%n files', 2).and.returnValue('2 files');

            const result = cut.renderOcrDialog(files);

            expect(result).toEqual('<div></div>');
            expect(cut.destroyOcrDialog).toHaveBeenCalled();
            expect(ocrTemplateMock).toHaveBeenCalledWith({
                buttonText: 'Process',
                filesQueued: '2 files are being processed:',
                hint: 'PDF files and a large number of files may take a very long time.',
                languages: Configuration.availableLanguages,
                replaceText: 'Replace target file if existing and delete original file',
                title: 'OCR: 2 files',
            });
        });

        it('should destroy the old dialog first and return the handlebar result for single given file.', () => {
            spyOn(cut, 'destroyOcrDialog').and.returnValue();
            const files = [FilesFixtures.PNG];
            ocrTemplateMock.and.returnValue('<div></div>');
            windowAny.t.withArgs('ocr', 'Process').and.returnValue('Process');
            windowAny.t.withArgs('ocr', 'PDF files and a large number of files may take a very long time.')
                .and.returnValue('PDF files and a large number of files may take a very long time.');
            windowAny.t.withArgs('ocr', 'Replace target file if existing and delete original file')
                .and.returnValue('Replace target file if existing and delete original file');
            windowAny.t.withArgs('ocr', 'OCR').and.returnValue('OCR');
            windowAny.n.withArgs('ocr', '%n file is being processed:', '%n files are being processed:', 1)
                .and.returnValue('1 file is being processed:');

            const result = cut.renderOcrDialog(files);

            expect(result).toEqual('<div></div>');
            expect(cut.destroyOcrDialog).toHaveBeenCalled();
            expect(ocrTemplateMock).toHaveBeenCalledWith({
                buttonText: 'Process',
                filesQueued: '1 file is being processed:',
                hint: 'PDF files and a large number of files may take a very long time.',
                languages: Configuration.availableLanguages,
                replaceText: 'Replace target file if existing and delete original file',
                title: 'OCR: file3.png',
            });
        });
    });
});
