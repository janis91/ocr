import { HttpService } from '../../../src/settings/service/HttpService';
import { OC } from '../../../src/global-oc-types';
import { windowAny } from '../../fixtures/fixtures';
import { AxiosInstance } from 'axios';

describe("The HttpService's", () => {

    let cut: HttpService;
    let ocMock: OC;
    let axiosMock: jasmine.SpyObj<AxiosInstance>;


    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.n = jasmine.createSpy('n');
        ocMock = {
            generateUrl: jasmine.createSpy('generateUrl'),
            Notification: jasmine.createSpyObj('Notification', ['showHtml']),
            PERMISSION_UPDATE: 26,
            requestToken: 'token',
        };
        axiosMock = jasmine.createSpyObj('axios', ['get', 'post']);
        cut = new (await import('../../../src/settings/service/HttpService')).HttpService(ocMock, axiosMock);
    });

    describe('fetchFavoriteLanguages function', () => {
        it('should return the favorite languages for a nextcloud with webroot "/nextcloud".', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should return the favorite languages for a nextcloud with webroot "/".', async () => {
            const url = '/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should return the favorite languages for a nextcloud with webroot "/" and other app root.', async () => {
            const url = '/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should return the favorite languages for a nextcloud with webroot "/nextcloud" and other app root.', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should throw an error when axios fails to load the favorite languages.', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const error = new Error('test');
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.reject(error));

            const result = cut.fetchFavoriteLanguages();

            await expectAsync(result).toBeRejectedWith(error);
        });
    });

    describe('postFavoriteLanguages function', () => {
        it('should return the favorite languages after posting them.', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.post.withArgs(url, { favoriteLanguages: '["deu"]' }, { headers: { 'requesttoken': 'token' } }).and.returnValue(Promise.resolve({ data: langs }));

            const result = await cut.postFavoriteLanguages(langs);

            expect(result).toEqual(langs);
        });

        it('should throw the corresponding error when a 400 error occurs when posting the favorite languages.', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const error = {
                response: {
                    status: 400,
                },
            };
            const langs = ['deu'];
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.post.withArgs(url, { favoriteLanguages: '["deu"]' }, { headers: { 'requesttoken': 'token' } }).and.returnValue(Promise.reject(error));
            windowAny.t.withArgs('ocr', 'An error occured during save of your favorite languages. Please check your input.')
                .and.returnValue('An error occured during save of your favorite languages. Please check your input.');

            const result = cut.postFavoriteLanguages(langs);

            await expectAsync(result).toBeRejectedWith(new Error('An error occured during save of your favorite languages. Please check your input.'));
        });

        it('should throw the corresponding error when another error occurs when posting the favorite languages.', async () => {
            const url = '/nextcloud/apps/ocr/api/personal/languages';
            const error = {
                response: {
                    status: 500,
                },
            };
            const langs = ['deu'];
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.post.withArgs(url, { favoriteLanguages: '["deu"]' }, { headers: { 'requesttoken': 'token' } }).and.returnValue(Promise.reject(error));
            windowAny.t.withArgs('ocr', 'An unexpected error occured during save of your favorite languages. Please try again.')
                .and.returnValue('An unexpected error occured during save of your favorite languages. Please try again.');

            const result = cut.postFavoriteLanguages(langs);

            await expectAsync(result).toBeRejectedWith(new Error('An unexpected error occured during save of your favorite languages. Please try again.'));
        });
    });
});
