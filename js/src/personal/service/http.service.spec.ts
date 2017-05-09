import { HttpService } from './http.service';

describe('For the http service', () => {

    let cut: HttpService;
    let configMock: any;
    let jqueryMock: any;

    beforeEach(() => {
        configMock = jasmine.createSpyObj('config', ['jobEndpoint']);
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

    describe('the getAllStatus function', () => {
        it('should retrieve the status.', () => {
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.jobEndpoint = 'jobEndpoint';

            const result = cut.getAllJobs();

            expect(cut.makeRequest).toHaveBeenCalledWith({
                method: 'GET',
                url: 'jobEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });

    describe('the deleteStatus function', () => {
        it('should retrieve the status.', () => {
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.jobEndpoint = 'jobEndpoint';

            const result = cut.deleteJob(3);

            expect(cut.makeRequest).toHaveBeenCalledWith({
                data: { id: 3 },
                method: 'DELETE',
                url: 'jobEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });
});
