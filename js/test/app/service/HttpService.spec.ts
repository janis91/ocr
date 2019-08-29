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
            appswebroots: { ocr: '/apps/ocr' },
            generateUrl: jasmine.createSpy('generateUrl'),
            Notification: jasmine.createSpyObj('Notification', ['showHtml']),
            PERMISSION_UPDATE: 26,
            requestToken: 'token',
        };
        axiosMock = jasmine.createSpyObj('axios', ['get', 'post']);
        cut = new (await import('../../../src/app/service/HttpService')).HttpService(ocMock, axiosMock);
    });

    describe('fetchFavoriteLanguages function', () => {
        it('should return the favorite languages.', async () => {
            const url = '/apps/ocr/api/personal/languages';
            const langs = ['deu'];
            const response = { data: langs };
            (ocMock.generateUrl as jasmine.Spy).withArgs(ocMock.appswebroots.ocr + '/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.resolve(response));

            const result = await cut.fetchFavoriteLanguages();

            expect(result).toEqual(langs);
        });

        it('should throw an error when axios fails to load the favorite languages.', async () => {
            const url = '/apps/ocr/api/personal/languages';
            const error = new Error('test');
            (ocMock.generateUrl as jasmine.Spy).withArgs(ocMock.appswebroots.ocr + '/api/personal/languages')
                .and.returnValue(url);
            axiosMock.get.withArgs(url).and.returnValue(Promise.reject(error));

            const result = cut.fetchFavoriteLanguages();

            await expectAsync(result).toBeRejectedWith(error);
        });
    });
});
