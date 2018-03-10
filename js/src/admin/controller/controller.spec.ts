import { Controller } from './controller';

describe('For the controller', () => {

    let cut: Controller;
    let httpServiceMock: any;
    let documentMock: any;
    let jqueryMock: any;
    let notificationMock: any;
    let OC: any;
    let t = (appName: string, translationString: string) => { return translationString; };
    let n = (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number) => { return singleTranslationString; };

    beforeEach(() => {
        httpServiceMock = jasmine.createSpyObj('httpService', ['sendLanguages', 'sendRedis']);
        documentMock = jasmine.createSpyObj('document', ['addEventListener', 'getElementById']);
        jqueryMock = jasmine.createSpy('jquery');
        notificationMock = jasmine.createSpyObj('notification', ['showHtml']);
        cut = new Controller(httpServiceMock, notificationMock, jqueryMock, documentMock, t);
    });

    describe('the init function', () => {
        it('should init the app correctly.', () => {
            spyOn(cut, 'registerEvents');
            const applyLanguagesButtonMock = { disabled: false };
            const applyRedisButtonMock = { disabled: false };
            documentMock.getElementById.and.returnValues(applyLanguagesButtonMock, applyRedisButtonMock);

            cut.init();

            expect(cut.registerEvents).toHaveBeenCalledTimes(1);
            expect(documentMock.getElementById).toHaveBeenCalledTimes(2);
            expect(documentMock.getElementById).toHaveBeenCalledWith('languages_apply');
            expect(documentMock.getElementById).toHaveBeenCalledWith('redis_apply');
        });
    });

    describe('the registerEvents function', () => {
        it('should add the eventlistener for the click event on the apply button.', () => {
            cut.registerEvents();

            expect(documentMock.addEventListener).toHaveBeenCalledTimes(1);
            expect(documentMock.addEventListener).toHaveBeenCalledWith('click', jasmine.anything());
        });
    });

    // TODO: describe('the saveLanguages function', () => { });

    describe('the displayMessage function', () => {
        it('should display an error message.', () => {
            const message = 'test';

            cut.displayMessage(message, true);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>OCR: ${message}</div>`, { timeout: 10, type: 'error' });
        });

        it('should display a normal message.', () => {
            const message = 'test';

            cut.displayMessage(message, false);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>OCR: ${message}</div>`, { timeout: 5 });
        });
    });

    describe('the getLanguages function', () => {
        it('should get the value from the input field.', () => {
            const inputMock = { value: 'eng;deu' };
            documentMock.getElementById.and.returnValue(inputMock);

            const result = cut.getLanguages();

            expect(result).toBe('eng;deu');
            expect(documentMock.getElementById).toHaveBeenCalledWith('languages');
        });
    });

    describe('the getRedisHost function', () => {
        it('should get the value from the input field.', () => {
            const inputMock = { value: '127.0.0.1' };
            documentMock.getElementById.and.returnValue(inputMock);

            const result = cut.getRedisHost();

            expect(result).toBe('127.0.0.1');
            expect(documentMock.getElementById).toHaveBeenCalledWith('redisHost');
        });
    });

    describe('the getRedisPort function', () => {
        it('should get the value from the input field.', () => {
            const inputMock = { value: '6379' };
            documentMock.getElementById.and.returnValue(inputMock);

            const result = cut.getRedisPort();

            expect(result).toBe(6379);
            expect(documentMock.getElementById).toHaveBeenCalledWith('redisPort');
        });
    });

    describe('the getRedisDb function', () => {
        it('should get the value from the input field.', () => {
            const inputMock = { value: '0' };
            documentMock.getElementById.and.returnValue(inputMock);

            const result = cut.getRedisDb();

            expect(result).toBe(0);
            expect(documentMock.getElementById).toHaveBeenCalledWith('redisDb');
        });
    });

    describe('the getRedisPassword function', () => {
        it('should get the value from the input field.', () => {
            const inputMock = { value: 'OCR' };
            documentMock.getElementById.and.returnValue(inputMock);

            const result = cut.getRedisPassword();

            expect(result).toBe('OCR');
            expect(documentMock.getElementById).toHaveBeenCalledWith('redisPassword');
        });
    });

    describe('the checkLanguagesValidity function', () => {
        it('should test the input for validity and return true for single input.', () => {
            const input = 'eng';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for single fraktur input.', () => {
            const input = 'eng-frak';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for multiple input.', () => {
            const input = 'eng;deu';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for multiple fraktur input.', () => {
            const input = 'eng-frak;deu-frak';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for multiple mixed input.', () => {
            const input = 'eng;deu-frak;spa';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return false for invalid input.', () => {
            const input = 'eng;deu;';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeFalsy();
        });

        it('should test the input for validity and return true for custom namings.', () => {
            const input = 'eng;deu-fraktur';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for custom namings.', () => {
            const input = 'english';

            const result = cut.checkLanguagesValidity(input);

            expect(result).toBeTruthy();
        });
    });

    describe('the checkRedisHostValidity function', () => {
        it('should test the input for validity and return true for valid IP.', () => {
            const input = '127.0.0.1';

            const result = cut.checkRedisHostValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return true for "localhost".', () => {
            const input = 'localhost';

            const result = cut.checkRedisHostValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return false for invalid input.', () => {
            const input = 'test:8080';

            const result = cut.checkRedisHostValidity(input);

            expect(result).toBeFalsy();
        });

        it('should test the input for validity and return false for another invalid input.', () => {
            const input = 'http://test';

            const result = cut.checkRedisHostValidity(input);

            expect(result).toBeFalsy();
        });
    });

    describe('the checkRedisPortValidity function', () => {
        it('should test the input for validity and return true for valid port.', () => {
            const input = 6379;

            const result = cut.checkRedisPortValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return false for invalid input.', () => {
            const input = 1211111111;

            const result = cut.checkRedisPortValidity(input);

            expect(result).toBeFalsy();
        });

        it('should test the input for validity and return false for invalid input.', () => {
            const input = -1;

            const result = cut.checkRedisPortValidity(input);

            expect(result).toBeFalsy();
        });
    });

    describe('the checkRedisDbValidity function', () => {
        it('should test the input for validity and return true for valid number.', () => {
            const input = 0;

            const result = cut.checkRedisDbValidity(input);

            expect(result).toBeTruthy();
        });

        it('should test the input for validity and return false for invalid input.', () => {
            const input = -1;

            const result = cut.checkRedisDbValidity(input);

            expect(result).toBeFalsy();
        });
    });
});
