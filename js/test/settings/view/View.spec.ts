import { View, OcrHandleBarsTemplate } from '../../../src/settings/view/View';
import { windowAny } from '../../fixtures/fixtures';
import { OCNotification } from '../../../src/global-oc-types';
import { Common } from '../../../src/common/Common';


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
        documentMock = jasmine.createSpyObj('document', ['createElement', 'getElementById']);
        cut = new (await import('../../../src/settings/view/View')).View(notificationMock, ocrTemplateMock, documentMock);
    });

    describe('displayError function', () => {
        it('should display an error message.', () => {
            const message = 'test';
            notificationMock.showHtml.and.returnValue({} as JQuery);
            windowAny.t.and.returnValue('OCR');

            cut.displayError(message);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>OCR: ${message}</div>`, { timeout: 10, type: 'error' });
        });
    });

    describe('init function', () => {
        it('should trigger the rendering of the ocrLanguageSelect and append it to the DOM for the given lanugages.', () => {
            const languages = ['deu', 'eng'];
            spyOn(cut, 'renderOcrLanguageSelect').and.returnValue('<div></div>');
            const container = { innerHTML: '' };
            documentMock.createElement.and.returnValue(container as HTMLElement);
            const languageSettings = jasmine.createSpyObj('language-settings', ['appendChild']);
            languageSettings.appendChild.and.returnValue();
            documentMock.getElementById.withArgs('language-settings').and.returnValue(languageSettings);
            spyOn(cut, 'renderSelect').withArgs(languages).and.returnValue();

            cut.init(languages);

            expect(cut.renderSelect).toHaveBeenCalledWith(languages);
            expect(documentMock.createElement).toHaveBeenCalledWith('div');
            expect(container.innerHTML).toEqual('<div></div>');
            expect(languageSettings.appendChild).toHaveBeenCalledWith(container);
            expect(cut.renderOcrLanguageSelect).toHaveBeenCalled();
        });
    });

    describe('renderSelect function', () => {
        it('should create the new Choices object, assign it to choices property and set selected values to given input.', () => {
            const favLangs = ['deu'];
            windowAny.t.withArgs('ocr', 'Press to select').and.returnValue('Press to select');
            windowAny.t.withArgs('ocr', 'No matches found').and.returnValue('No matches found');
            windowAny.t.withArgs('ocr', 'Select language').and.returnValue('Select language');
            const choices = {};
            windowAny.Choices.and.returnValue(choices);
            spyOn(cut, 'setSelectValues').and.returnValue();

            cut.renderSelect(favLangs);

            expect(cut.choices).toEqual(choices);
            expect(windowAny.Choices).toHaveBeenCalledWith('#ocrLanguages', {
                duplicateItemsAllowed: false,
                itemSelectText: 'Press to select',
                noResultsText: 'No matches found',
                placeholderValue: 'Select language',
                position: 'bottom',
                removeItemButton: true,
                removeItems: true,
            });
            expect(cut.setSelectValues).toHaveBeenCalledWith(favLangs);
        });
    });

    describe('renderOcrLanguageSelect function', () => {
        it('should destroy the old dialog first and return the handlebar result for multiple given files.', () => {
            ocrTemplateMock.and.returnValue('<div></div>');
            windowAny.t.withArgs('ocr', 'Save').and.returnValue('Save');
            windowAny.t.withArgs('ocr', 'Selected languages will be preselected by default in the OCR dialog.').and
                .returnValue('Selected languages will be preselected by default in the OCR dialog.');

            const result = cut.renderOcrLanguageSelect();

            expect(result).toEqual('<div></div>');
            expect(ocrTemplateMock).toHaveBeenCalledWith({
                buttonText: 'Save',
                languages: Common.AVAILABLE_LANGUAGES,
                hint: 'Selected languages will be preselected by default in the OCR dialog.',
            });
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

    describe('setSelectValues function', () => {
        it('should set the choices values.', () => {
            const favLangs = ['deu'];
            cut.choices = { setChoiceByValue: jasmine.createSpy('setChoiceByValue') };
            cut.choices.setChoiceByValue.withArgs(favLangs).and.returnValue();

            cut.setSelectValues(favLangs);

            expect(cut.choices.setChoiceByValue).toHaveBeenCalledWith(favLangs);
        });
    });

    describe('disableSelect function', () => {
        it('should disable the choices input.', () => {
            cut.choices = { disable: jasmine.createSpy('disable') };
            cut.choices.disable.and.returnValue();

            cut.disableSelect();

            expect(cut.choices.disable).toHaveBeenCalled();
        });
    });

    describe('enableSelect function', () => {
        it('should enable the choices input.', () => {
            cut.choices = { enable: jasmine.createSpy('enable') };
            cut.choices.enable.and.returnValue();

            cut.enableSelect();

            expect(cut.choices.enable).toHaveBeenCalled();
        });
    });

    describe('hideLoad function', () => {
        it('should hide progress and show choices.', () => {
            const progress = {
                classList: jasmine.createSpyObj('progress', ['add']),
            };
            documentMock.getElementById.withArgs('ocrProgressWrapper').and.returnValue(progress as HTMLElement);

            cut.hideLoad();

            expect(progress.classList.add).toHaveBeenCalledWith('ocr-hidden');
        });
    });
});
