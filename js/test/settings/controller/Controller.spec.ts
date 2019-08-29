import { Controller } from '../../../src/settings/controller/Controller';
import { windowAny } from '../../fixtures/fixtures';
import { View } from '../../../src/settings/view/View';
import { HttpService } from '../../../src/settings/service/HttpService';

describe("The Controller's", () => {

    let cut: Controller;
    let viewMock: jasmine.SpyObj<View>;
    let httpServiceMock: jasmine.SpyObj<HttpService>;
    let documentMock: jasmine.SpyObj<Document>;


    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.n = jasmine.createSpy('n');
        viewMock = jasmine.createSpyObj('view', ['displayError', 'getSelectValues', 'disableSelect', 'init', 'enableSelect', 'setSelectValues', 'hideLoad']);
        httpServiceMock = jasmine.createSpyObj('httpService', ['fetchFavoriteLanguages', 'postFavoriteLanguages']);
        documentMock = jasmine.createSpyObj('document', ['getElementById']);
        cut = new (await import('../../../src/settings/controller/Controller')).Controller(viewMock, httpServiceMock, documentMock);
    });

    describe('init function', () => {
        it('should initialize the app correctly.', async () => {
            const langs = ['deu'];
            httpServiceMock.fetchFavoriteLanguages.and.returnValue(Promise.resolve(langs));
            viewMock.init.withArgs(langs).and.returnValue();
            viewMock.hideLoad.and.returnValue();
            spyOn(cut, 'registerEvents').and.returnValue();

            await cut.init();

            expect(cut.registerEvents).toHaveBeenCalledTimes(1);
            expect(httpServiceMock.fetchFavoriteLanguages).toHaveBeenCalledTimes(1);
            expect(viewMock.init).toHaveBeenCalledWith(langs);
            expect(viewMock.hideLoad).toHaveBeenCalledTimes(1);
        });

        it('should throw an Error when loading languages fails during init.', async () => {
            httpServiceMock.fetchFavoriteLanguages.and.returnValue(Promise.reject(new Error()));
            windowAny.t.withArgs('ocr', 'An unexpected error occured during load of your favorite languages. Please try again.')
                .and.returnValue('An unexpected error occured during load of your favorite languages. Please try again.');

            const result = cut.init();

            await expectAsync(result).toBeRejectedWith(new Error('An unexpected error occured during load of your favorite languages. Please try again.'));
            expect(httpServiceMock.fetchFavoriteLanguages).toHaveBeenCalledTimes(1);
        });
    });

    describe('registerEvents function', () => {
        it('should register all events.', () => {
            const button = jasmine.createSpyObj('button', ['addEventListener']);
            documentMock.getElementById.withArgs('ocrLanguagesSave').and.returnValue(button);

            cut.registerEvents();

            expect(button.addEventListener).toHaveBeenCalledWith('click', cut.clickToSaveHandler);
            expect(documentMock.getElementById).toHaveBeenCalledWith('ocrLanguagesSave');
        });
    });

    describe('clickToSaveHandler function', () => {
        it('should post the languages and update the view accordingly.', async () => {
            const langs = ['deu'];
            viewMock.getSelectValues.and.returnValue(langs);
            viewMock.disableSelect.and.returnValue();
            httpServiceMock.postFavoriteLanguages.withArgs(langs).and.returnValue(Promise.resolve(langs));
            viewMock.enableSelect.and.returnValue();
            viewMock.setSelectValues.withArgs(langs).and.returnValue();

            await cut.clickToSaveHandler();

            expect(viewMock.setSelectValues).toHaveBeenCalledWith(langs);
            expect(viewMock.enableSelect).toHaveBeenCalled();
            expect(viewMock.disableSelect).toHaveBeenCalled();
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(httpServiceMock.postFavoriteLanguages).toHaveBeenCalledWith(langs);
        });

        it('should display error when posting the languages fails.', async () => {
            const langs = ['deu'];
            viewMock.getSelectValues.and.returnValue(langs);
            viewMock.disableSelect.and.returnValue();
            httpServiceMock.postFavoriteLanguages.withArgs(langs).and.returnValue(Promise.reject(new Error('test')));
            viewMock.enableSelect.and.returnValue();
            viewMock.setSelectValues.withArgs(undefined).and.returnValue();
            viewMock.displayError.withArgs('test').and.returnValue();

            await cut.clickToSaveHandler();

            expect(viewMock.setSelectValues).toHaveBeenCalledWith(undefined);
            expect(viewMock.enableSelect).toHaveBeenCalled();
            expect(viewMock.disableSelect).toHaveBeenCalled();
            expect(viewMock.getSelectValues).toHaveBeenCalled();
            expect(httpServiceMock.postFavoriteLanguages).toHaveBeenCalledWith(langs);
            expect(viewMock.displayError).toHaveBeenCalledWith('test');
        });
    });
});
