import { View } from './view';

describe('For the view', () => {

    let cut: View;
    let notificationMock: any;
    let handlebarsDropdownTemplateMock: any;
    let jqueryMock: any;
    let documentMock: any;
    let t = (appName: string, translationString: string) => { return translationString; };
    let n = (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number) => { return singleTranslationString; };

    beforeEach(() => {
        handlebarsDropdownTemplateMock = jasmine.createSpy('ocrDropdownTemplateFunction');
        notificationMock = jasmine.createSpyObj('notification', ['showHtml', 'hide']);
        jqueryMock = jasmine.createSpy('jquery');
        documentMock = jasmine.createSpyObj('document', ['getElementById', 'removeChild', 'querySelectorAll']);
        cut = new View(notificationMock, handlebarsDropdownTemplateMock, t, n, jqueryMock, documentMock);
    });

    describe('the displayError function', () => {
        it('should display an error message.', () => {
            const message = 'test';

            cut.displayError(message);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>${message}</div>`, { timeout: 10, type: 'error' });
        });
    });

    describe('the renderDropdown function', () => {
        it('should destroy the dropdown before rendering it new.', () => {
            const languages = ['deu', 'eng'];
            spyOn(cut, 'destroyDropdown');

            cut.renderDropdown(languages);

            expect(cut.destroyDropdown).toHaveBeenCalled();
        });

        it('should return the rendered template.', () => {
            const languages = ['deu', 'eng'];
            spyOn(cut, 'destroyDropdown');
            handlebarsDropdownTemplateMock.and.returnValue('template');

            const result = cut.renderDropdown(languages);

            expect(cut.destroyDropdown).toHaveBeenCalled();
            expect(handlebarsDropdownTemplateMock).toHaveBeenCalledWith({ languages: languages, buttonText: 'Process' });
            expect(result).toBe('template');
        });
    });

    describe('the destroyDropdown function', () => {
        it('should try to destroy the dropdown, if it exists.', () => {
            const parent = jasmine.createSpyObj('parentNode', ['removeChild']);
            let element = {
                parentNode: parent,
            };
            documentMock.getElementById.and.returnValue(element);

            cut.destroyDropdown();

            expect(element.parentNode.removeChild).toHaveBeenCalledWith(element);
        });

        it('should not try to destroy the dropdown, if it exists.', () => {
            const parent = jasmine.createSpyObj('parentNode', ['removeChild']);
            let element = {
                parentNode: parent,
            };
            documentMock.getElementById.and.returnValue(null);

            cut.destroyDropdown();

            expect(element.parentNode.removeChild).not.toHaveBeenCalled();
        });
    });

    describe('the togglePendingNotification function', () => {
        it('should show the pending notification if force is true and count zero.', () => {
            spyOnProperty(cut, 'notificationRow', 'get').and.returnValue(1);
            const html = `<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span> OCR started: %n new file in queue.</span>`;

            cut.togglePendingNotification(true, 0);

            expect(notificationMock.hide).toHaveBeenCalledWith(1);
            expect(notificationMock.showHtml).toHaveBeenCalledWith(html);
        });

        it('should show the pending notification if force is false and count is a positive number.', () => {
            spyOnProperty(cut, 'notificationRow', 'get').and.returnValue(1);
            const html = `<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span> OCR: %n currently pending file in queue.</span>`;

            cut.togglePendingNotification(false, 2);

            expect(notificationMock.hide).toHaveBeenCalledWith(1);
            expect(notificationMock.showHtml).toHaveBeenCalledWith(html);
        });

        it('should hide the pending notification if force is false and count is zero.', () => {
            spyOnProperty(cut, 'notificationRow', 'get').and.returnValue(1);

            cut.togglePendingNotification(false, 0);

            expect(notificationMock.hide).toHaveBeenCalledWith(1);
            expect(notificationMock.showHtml).toHaveBeenCalledTimes(0);
        });

        it('should not hide if notificationRow is undefined and force is true or count is a positive number.', () => {
            spyOnProperty(cut, 'notificationRow', 'get').and.returnValue(undefined);
            const html = `<span class="icon icon-loading-small ocr-row-adjustment"></span>&nbsp;<span> OCR started: %n new file in queue.</span>`;

            cut.togglePendingNotification(true, 2);

            expect(notificationMock.hide).toHaveBeenCalledTimes(0);
            expect(notificationMock.showHtml).toHaveBeenCalledWith(html);
        });

        it('should not hide if notificationRow is undefined and force is false and count is zero.', () => {
            spyOnProperty(cut, 'notificationRow', 'get').and.returnValue(undefined);

            cut.togglePendingNotification(false, 0);

            expect(notificationMock.hide).toHaveBeenCalledTimes(0);
            expect(notificationMock.showHtml).toHaveBeenCalledTimes(0);
        });
    });

    describe('the toggleSelectedFilesActionButton function', () => {
        it('should show the SelectedFilesActionButton.', () => {
            const classList = jasmine.createSpyObj('classList', ['remove']);
            let element = {
                classList: classList,
            };
            documentMock.getElementById.and.returnValue(element);

            cut.toggleSelectedFilesActionButton(true);

            expect(element.classList.remove).toHaveBeenCalledWith('hidden');
        });

        it('should hide the SelectedFilesActionButton.', () => {
            const classList = jasmine.createSpyObj('classList', ['add']);
            let element = {
                classList: classList,
            };
            documentMock.getElementById.and.returnValue(element);

            cut.toggleSelectedFilesActionButton(false);

            expect(element.classList.add).toHaveBeenCalledWith('hidden');
        });
    });

    describe('the renderFileAction function', () => {
        it('should append the dropdown to the proper position for one file.', () => {
            const languages = ['deu', 'eng'];
            spyOn(cut, 'renderDropdown').and.returnValue('<div></div>');
            spyOn(cut, 'renderSelectTwo');
            spyOn(cut, 'appendHtmlToElement');
            const elementOne = jasmine.createSpyObj('elementOne', ['getAttribute', 'querySelectorAll']);
            elementOne.getAttribute.and.returnValue('file');
            elementOne.querySelectorAll.and.returnValue('a td element');
            const elementTwo = jasmine.createSpyObj('elementTwo', ['getAttribute']);
            elementTwo.getAttribute.and.returnValue('not the right file');
            const elementThree = jasmine.createSpyObj('elementThree', ['getAttribute']);
            elementThree.getAttribute.and.returnValue('also not the right file');
            documentMock.querySelectorAll.and.returnValue([elementOne, elementTwo, elementThree]);

            cut.renderFileAction('file', languages);

            expect(cut.renderSelectTwo).toHaveBeenCalled();
            expect(cut.renderDropdown).toHaveBeenCalledWith(languages);
            expect(elementOne.getAttribute).toHaveBeenCalledWith('data-file');
            expect(elementTwo.getAttribute).toHaveBeenCalledWith('data-file');
            expect(elementThree.getAttribute).toHaveBeenCalledWith('data-file');
            expect(cut.appendHtmlToElement).toHaveBeenCalledWith('<div></div>', 'a td element');
        });

        it('should append the dropdown to the proper position for multiple files.', () => {
            const languages = ['deu', 'eng'];
            spyOn(cut, 'renderDropdown').and.returnValue('<div></div>');
            spyOn(cut, 'renderSelectTwo');
            spyOn(cut, 'appendHtmlToElement');
            documentMock.querySelectorAll.and.returnValue('the tr th.column-name elements');

            cut.renderFileAction(undefined, languages);

            expect(cut.renderSelectTwo).toHaveBeenCalled();
            expect(cut.renderDropdown).toHaveBeenCalledWith(languages);
            expect(cut.appendHtmlToElement).toHaveBeenCalledWith('<div></div>', 'the tr th.column-name elements');
        });
    });

    describe('the checkClickOther function', () => {
        it('should return true and destroyDropdown if not clicked on ocrDropdown.', () => {
            const target = jasmine.createSpyObj('target', ['closest']);
            const event = {
                target: target,
            };
            target.closest.and.returnValue(null);
            spyOn(cut, 'destroyDropdown');

            const result = cut.checkClickOther(event);

            expect(cut.destroyDropdown).toHaveBeenCalled();
            expect(event.target.closest).toHaveBeenCalledWith('#ocrDropdown');
            expect(result).toBeTruthy();
        });

        it('should return false if clicked on ocrDropdown.', () => {
            const target = jasmine.createSpyObj('target', ['closest']);
            const event = {
                target: target,
            };
            target.closest.and.returnValue({});

            const result = cut.checkClickOther(event);

            expect(event.target.closest).toHaveBeenCalledWith('#ocrDropdown');
            expect(result).toBeFalsy();
        });
    });

    describe('the renderSelectedFilesActionButton function', () => {
        it('should render the selected files action button.', () => {
            spyOnProperty(cut, 'templateOCRSelectedFileAction', 'get').and.returnValue('template');
            spyOn(cut, 'appendHtmlToElement');
            documentMock.getElementById.and.returnValue('an element');

            cut.renderSelectedFilesActionButton();

            expect(documentMock.getElementById).toHaveBeenCalledWith('headerName-container');
            expect(cut.appendHtmlToElement).toHaveBeenCalledWith('template', 'an element');
        });
    });

    describe('the destroySelectedFilesActionButton function', () => {
        it('should remove the button.', () => {
            const parent = jasmine.createSpyObj('parentNode', ['removeChild']);
            let element = {
                parentNode: parent,
            };
            documentMock.getElementById.and.returnValue(element);

            cut.destroySelectedFilesActionButton();

            expect(documentMock.getElementById).toHaveBeenCalledWith('selectedActionsOCRId');
        });
    });

    describe('the destroy function', () => {
        it('should destroy the selectedFilesActionButton and the Dropdown on destroy.', () => {
            spyOn(cut, 'destroyDropdown');
            spyOn(cut, 'destroySelectedFilesActionButton');

            cut.destroy();

            expect(cut.destroySelectedFilesActionButton).toHaveBeenCalled();
            expect(cut.destroyDropdown).toHaveBeenCalled();
        });
    });
});
