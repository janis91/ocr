import { HttpService } from './http.service';

describe('For the http service', () => {

    let cut: HttpService;
    let configMock: any;
    let jqueryMock: any;

    beforeEach(() => {
        configMock = jasmine.createSpyObj('config', ['languagesSettingsEndpoint', 'redisSettingsEndpoint']);
        jqueryMock = jasmine.createSpyObj('jquery', ['ajax']);
        cut = new HttpService(configMock, jqueryMock);
    });

    describe('the makeRequest function', () => {
        it('should make the request with the right options.', () => {
            const opts = { method: 'GET' };
            jqueryMock.ajax.and.returnValue(true);

            const result = cut.makeRequest(opts);

            expect(jqueryMock.ajax).toHaveBeenCalledWith(opts);
            expect(result).toBeTruthy();
        });
    });

    describe('the sendLanguages function', () => {
        it('should send the languages to the endpoint.', () => {
            const languages = 'deu;eng';
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.languagesSettingsEndpoint = 'languagesSettingsEndpoint';

            const result = cut.sendLanguages(languages);

            expect(cut.makeRequest).toHaveBeenCalledWith({
                data: {
                    languages: languages,
                },
                method: 'POST',
                url: 'languagesSettingsEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });

    describe('the sendRedis function', () => {
        it('should send the redis settings to the endpoint.', () => {
            const redisHost = '127.0.0.1';
            const redisPort = '6379';
            const redisDb = '0';
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.redisSettingsEndpoint = 'redisSettingsEndpoint';

            const result = cut.sendRedis(redisHost, redisPort, redisDb);

            expect(cut.makeRequest).toHaveBeenCalledWith({
                data: {
                    redisDb: redisDb,
                    redisHost: redisHost,
                    redisPort: redisPort,
                },
                method: 'POST',
                url: 'redisSettingsEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });
});
