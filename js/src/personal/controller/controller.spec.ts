import { Controller } from './controller';

describe('For the controller', () => {

    let cut: Controller;
    let viewMock: any;
    let httpServiceMock: any;
    let documentMock: any;
    let jqueryMock: any;
    let t = (appName: string, translationString: string) => { return translationString; };

    beforeEach(() => {
        viewMock = jasmine.createSpyObj('view', ['destroy']);
        httpServiceMock = jasmine.createSpy('httpService');
        documentMock = jasmine.createSpyObj('document', ['addEventListener']);
        jqueryMock = jasmine.createSpy('jquery');
        cut = new Controller(viewMock, httpServiceMock, documentMock, jqueryMock, t);
    });

    describe('the init function', () => {
        it('should init the app.', () => {
            spyOn(cut, 'registerEvents');
            spyOn(cut, 'loadAndRender');

            cut.init();

            expect(cut.registerEvents).toHaveBeenCalledTimes(1);
            expect(cut.loadAndRender).toHaveBeenCalledTimes(1);
        });
    });

    describe('the destroy function', () => {
        it('should destroy the view.', () => {
            cut.destroy();

            expect(viewMock.destroy).toHaveBeenCalledTimes(1);
        });
    });

    describe('the registerEvents function', () => {
        it('should add the event listeners.', () => {
            cut.registerEvents();

            expect(documentMock.addEventListener).toHaveBeenCalledTimes(2);
        });
    });
});
