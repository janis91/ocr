import { HttpService } from '../../../src/app/service/HttpService';
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
            appswebroots: { ocr: '/nextcloud/apps/ocr' },
            generateUrl: jasmine.createSpy('generateUrl'),
            Notification: jasmine.createSpyObj('Notification', ['showHtml']),
            PERMISSION_UPDATE: 26,
            requestToken: 'token',
            webroot: '/nextcloud',
        };
        axiosMock = jasmine.createSpyObj('axios', ['get', 'post']);
        cut = new (await import('../../../src/app/service/HttpService')).HttpService(ocMock, axiosMock);
    });

    describe('fetchFavoriteLanguages function', () => {
        it('should return the favorite languages for a nextcloud with webroot "/nextcloud".', async () => {
            const url = 'nextcloud/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should return the favorite languages for a nextcloud with webroot "/".', async () => {
            ocMock.webroot = '';
            ocMock.appswebroots.ocr = '/apps/ocr';
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
            ocMock.webroot = '';
            ocMock.appswebroots.ocr = '/apps3/ocr';
            const url = '/apps3/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps3/ocr/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should return the favorite languages for a nextcloud with webroot "/nextcloud" and other app root.', async () => {
            ocMock.webroot = '/nextcloud';
            ocMock.appswebroots.ocr = '/nextcloud/apps3/ocr';
            const url = '/nextcloud/apps3/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs('/apps3/ocr/api/personal/languages')
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
});
