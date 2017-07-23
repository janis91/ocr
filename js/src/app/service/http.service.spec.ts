import { HttpService } from './http.service';
import { File } from '../controller/poto/file.poto';

describe('For the http service', () => {

    let cut: HttpService;
    let utilMock: any;
    let configMock: any;
    let jqueryMock: any;

    beforeEach(() => {
        utilMock = jasmine.createSpyObj('util', ['shrinkFilesToReducedFiles']);
        configMock = jasmine.createSpyObj('config', ['jobEndpoint', 'statusEndpoint', 'languagesEndpoint']);
        jqueryMock = jasmine.createSpyObj('jquery', ['ajax']);
        cut = new HttpService(utilMock, configMock, jqueryMock);
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

    describe('the process function', () => {
        it('should trigger the process for the right files and languages.', () => {
            const replace = true;
            const languages = ['deu', 'eng'];
            const file1 = new File();
            file1.id = 1;
            file1.mimetype = 'any';
            const file2 = new File();
            file2.id = 2;
            file2.mimetype = 'any';
            const files = [file1, file2];
            const reducedFiles = [{ id: file1.id }, { id: file2.id }];
            utilMock.shrinkFilesToReducedFiles.and.returnValue(reducedFiles);
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.jobEndpoint = 'jobEndpoint';

            const result = cut.startProcess(files, languages, replace);

            expect(cut.makeRequest).toHaveBeenCalledWith({
                data: {
                    files: reducedFiles,
                    languages: languages,
                    replace: replace,
                },
                method: 'POST',
                url: 'jobEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });

    describe('the checkStatus function', () => {
        it('should retrieve the status.', () => {
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.statusEndpoint = 'statusEndpoint';

            const result = cut.checkStatus();

            expect(cut.makeRequest).toHaveBeenCalledWith({
                method: 'GET',
                url: 'statusEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });

    describe('the loadAvailableLanguages function', () => {
        it('should retrieve the languages.', () => {
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.languagesEndpoint = 'languagesEndpoint';

            const result = cut.loadAvailableLanguages();

            expect(cut.makeRequest).toHaveBeenCalledWith({
                method: 'GET',
                url: 'languagesEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });

    describe('the checkRedisSettings function', () => {
        it('should retrieve the status.', () => {
            spyOn(cut, 'makeRequest').and.returnValue(true);
            configMock.redisEvaluationEndpoint = 'redisEvaluationEndpoint';

            const result = cut.checkRedisSettings();

            expect(cut.makeRequest).toHaveBeenCalledWith({
                method: 'GET',
                url: 'redisEvaluationEndpoint',
            });
            expect(result).toBeTruthy();
        });
    });
});
