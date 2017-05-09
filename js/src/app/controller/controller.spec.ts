import { Controller } from './controller';

describe('For the controller', () => {

    let cut: Controller;
    let utilMock: any;
    let viewMock: any;
    let httpServiceMock: any;
    let ocaServiceMock: any;
    let documentMock: any;
    let jqueryMock: any;
    let OC: any;
    let t = (appName: string, translationString: string) => { return translationString; };
    let n = (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number) => { return singleTranslationString; };


    beforeEach(() => {
        utilMock = jasmine.createSpyObj('util', ['filterFilesWithMimeTypes']);
        viewMock = jasmine.createSpyObj('view', ['renderSelectedFilesActionButton', 'destroy',
            'checkClickOther', 'displayError', 'destroyDropdown', 'getSelectTwoValues',
            'renderFileAction', 'toggleSelectedFilesActionButton', 'togglePendingNotification']);
        httpServiceMock = jasmine.createSpyObj('httpService', ['loadAvailableLanguages', 'process']);
        ocaServiceMock = jasmine.createSpyObj('ocaService', ['destroy', 'registerFileActions', 'registerCheckBoxEvents', 'getSelectedFiles', 'reloadFilelist']);
        documentMock = jasmine.createSpyObj('document', ['addEventListener']);
        jqueryMock = jasmine.createSpy('jquery');
        cut = new Controller(utilMock, viewMock, httpServiceMock, ocaServiceMock, t, n, documentMock, jqueryMock);
    });

    describe('the startEverything function', () => {
        it('should start the app correctly.', () => {
            spyOn(cut, 'loadLanguages');
            cut.availableLanguages = ['deu', 'eng'];
            spyOn(cut, 'registerEvents');
            viewMock.renderSelectedFilesActionButton.and.returnValue(true);
            spyOn(cut, 'loopForStatus');

            cut.startEverything();

            expect(cut.loadLanguages).toHaveBeenCalled();
            expect(cut.registerEvents).toHaveBeenCalled();
            expect(viewMock.renderSelectedFilesActionButton).toHaveBeenCalled();
            expect(cut.loopForStatus).toHaveBeenCalled();
            expect(cut.availableLanguages.length).toBe(2);
        });
    });

    describe('the destroy function', () => {
        it('should destroy the view and the ocaService capabilities.', () => {
            cut.destroy();

            expect(viewMock.destroy).toHaveBeenCalled();
            expect(ocaServiceMock.destroy).toHaveBeenCalled();
        });
    });

    describe('the registerEvents function', () => {
        it('should add the eventlisteners and register the ocaService events.', () => {
            cut.registerEvents();

            expect(documentMock.addEventListener).toHaveBeenCalledTimes(3);
            expect(ocaServiceMock.registerFileActions).toHaveBeenCalled();
            expect(ocaServiceMock.registerCheckBoxEvents).toHaveBeenCalledWith(cut);
        });
    });

    describe('the clickOnOtherEvent function', () => {
        it('should set selectedFiles to empty if clicked outside of the dropdown.', () => {
            const event = 'test';
            viewMock.checkClickOther.and.returnValue(true);

            cut.clickOnOtherEvent(event);

            expect(viewMock.checkClickOther).toHaveBeenCalledWith(event);
            expect(cut.selectedFiles).toEqual([]);
        });

        it('should not set selectedFiles to empty if clicked inside of the dropdown.', () => {
            const event = 'test';
            viewMock.checkClickOther.and.returnValue(false);

            cut.clickOnOtherEvent(event);

            expect(viewMock.checkClickOther).toHaveBeenCalledWith(event);
            expect(cut.selectedFiles).toBeUndefined();
        });
    });

    describe('the clickOnProcessButtonEvent function', () => {
        it('should display an error if selectedFiles are empty and destroy the dropdown.', () => {
            spyOnProperty(cut, 'selectedFiles', 'get').and.returnValue([]);

            cut.clickOnProcessButtonEvent();

            expect(viewMock.displayError).toHaveBeenCalledWith(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'No file(s) selected.')}`);
            expect(viewMock.destroyDropdown).toHaveBeenCalled();
        });

        it('should display an error if filteredFiles are empty and destroy the dropdown.', () => {
            const selectedFiles = ['length greater one'];
            spyOnProperty(cut, 'selectedFiles', 'get').and.returnValue(selectedFiles);
            utilMock.filterFilesWithMimeTypes.and.returnValue([]);

            cut.clickOnProcessButtonEvent();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(selectedFiles);
            expect(viewMock.displayError).toHaveBeenCalledWith(`${t('ocr', 'OCR processing failed:')} ${t('ocr', 'MIME type(s) not supported.')}`);
            expect(viewMock.destroyDropdown).toHaveBeenCalled();
        });

        /*it('should display an error for a failed request of the httpService and destroy the dropdown.', () => {
            // TODO: jQuery Deferred Mocking
            const selectedFiles = ['length greater one'];
            const selectedLanguages = ['deu', 'eng'];
            spyOnProperty(cut, 'selectedFiles', 'get').and.returnValue(selectedFiles);
            utilMock.filterFilesWithMimeTypes.and.returnValue(selectedFiles);
            httpServiceMock.process.and.returnValue(deferred.promise());
            viewMock.getSelectTwoValues.and.returnValue(selectedLanguages);

            cut.clickOnProcessButtonEvent();

            expect(httpServiceMock.process).toHaveBeenCalledWith(selectedFiles, selectedLanguages);
            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(selectedFiles);
            expect(viewMock.displayError).toHaveBeenCalledWith(`${t('ocr', 'OCR processing failed:')} ${jqXHR.responseText}`);
            expect(viewMock.destroyDropdown).toHaveBeenCalled();
        });*/
    });

    describe('the clickOnTopBarSelectedFilesActionButton function', () => {
        it('should trigger the rendering of the dropdown and set the selected files.', () => {
            const languages = ['deu', 'eng'];
            const files = [{ id: 3, mimetype: 'test' }];
            spyOnProperty(cut, 'availableLanguages', 'get').and.returnValue(languages);
            ocaServiceMock.getSelectedFiles.and.returnValue(files);

            cut.clickOnTopBarSelectedFilesActionButton();

            expect(viewMock.renderFileAction).toHaveBeenCalledWith(undefined, languages);
            expect(cut.selectedFiles).toEqual(files);
        });
    });

    describe('the toggleSelectedFilesActionButton function', () => {
        it('should toggle the selected files action button and set selected files if selected files greater than zero.', () => {
            const files = [{ id: 3, mimetype: 'test' }];
            utilMock.filterFilesWithMimeTypes.and.returnValue(files);
            ocaServiceMock.getSelectedFiles.and.returnValue(files);

            cut.toggleSelectedFilesActionButton();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(files);
            expect(viewMock.toggleSelectedFilesActionButton).toHaveBeenCalledWith(true);
            expect(cut.selectedFiles).toEqual(files);
        });
        it('should toggle the selected files action button and set selected files if selected files undefined or less than zero.', () => {
            utilMock.filterFilesWithMimeTypes.and.returnValue([]);
            ocaServiceMock.getSelectedFiles.and.returnValue(undefined);

            cut.toggleSelectedFilesActionButton();

            expect(utilMock.filterFilesWithMimeTypes).toHaveBeenCalledWith(undefined);
            expect(viewMock.toggleSelectedFilesActionButton).toHaveBeenCalledWith(false);
            expect(cut.selectedFiles).toEqual([]);
        });
    });

    // TODO: describe('the loopForStatus function', () => { });

    describe('the updateFileList function', () => {
        it('should reload the file list and toggle the selected files action button.', () => {
            spyOn(cut, 'toggleSelectedFilesActionButton');

            cut.updateFileList();

            expect(cut.toggleSelectedFilesActionButton).toHaveBeenCalled();
            expect(ocaServiceMock.reloadFilelist).toHaveBeenCalled();
        });
    });

    describe('the togglePendingState function', () => {
        it('should toggle the pending notification of the view with pending state count.', () => {
            const status = { pending: 3 };
            spyOnProperty(cut, 'status', 'get').and.returnValue(status);

            cut.togglePendingState(true);

            expect(viewMock.togglePendingNotification).toHaveBeenCalledWith(true, 3);
        });

        it('should toggle the pending notification of the view with initialcount.', () => {
            spyOnProperty(cut, 'status', 'get').and.throwError('Should not have been get.');

            cut.togglePendingState(true, 3);

            expect(viewMock.togglePendingNotification).toHaveBeenCalledWith(true, 3);
        });
    });

    describe('the hideSelectedFilesActionButton function', () => {
        it('should hide the selected files action button and empty the selected files.', () => {
            cut.hideSelectedFilesActionButton();

            expect(viewMock.toggleSelectedFilesActionButton).toHaveBeenCalledWith(false);
            expect(cut.selectedFiles).toEqual([]);
        });
    });

    // TODO: describe('the checkStatus function', () => { });

    // TODO: describe('the checkRedis function', () => { });

    // TODO: describe('the loadLanguages function', () => { });
});
