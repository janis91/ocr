import { IStatus } from '../controller/poto/status.poto';
import { View } from './view';

describe('For the view', () => {

    let cut: View;
    let notificationMock: any;
    let handlebarsTableTemplateFunctionMock: any;
    let t = (appName: string, translationString: string) => { return translationString; };
    let jqueryMock: any;
    let documentMock: any;
    let element: any;

    beforeEach(() => {
        handlebarsTableTemplateFunctionMock = jasmine.createSpy('handlebarsTableTemplateFunction');
        notificationMock = jasmine.createSpyObj('notification', ['showHtml']);
        jqueryMock = jasmine.createSpy('jquery');
        documentMock = jasmine.createSpyObj('document', ['getElementById']);
        cut = new View(notificationMock, handlebarsTableTemplateFunctionMock, t, jqueryMock, documentMock);
    });

    describe('the displayMessage function', () => {
        it('should display a message.', () => {
            const message = 'test';

            cut.displayMessage(message, false);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>${message}</div>`, { timeout: 10 });
        });

        it('should display an error message.', () => {
            const message = 'test';

            cut.displayMessage(message, true);

            expect(notificationMock.showHtml).toHaveBeenCalledWith(`<div>${message}</div>`, { timeout: 10, type: 'error' });
        });
    });

    describe('the render function', () => {
        it('should render and append the table.', () => {
            const status: Array<IStatus> = [{id: 1}];
            spyOn(cut, 'appendHtmlToElement');
            spyOn(cut, 'renderTable').and.returnValue('html');

            cut.render(status);

            expect(cut.renderTable).toHaveBeenCalledWith(status);
            expect(cut.appendHtmlToElement).toHaveBeenCalledWith('html', cut.el);
        });
    });

    describe('the destroy function', () => {
        it('should destroy the table.', () => {
            element = { innerHtml: 'test' };
            spyOnProperty(cut, 'el', 'get').and.returnValue(element);

            cut.destroy();

            expect(cut.el.innerHTML).toEqual('');
        });
    });

    describe('the renderTable function', () => {
        it('should return the rendered template for non empty status array.', () => {
            const status: Array<IStatus> = [{id: 1}];
            handlebarsTableTemplateFunctionMock.and.returnValue('template');

            const result = cut.renderTable(status);

            expect(handlebarsTableTemplateFunctionMock).toHaveBeenCalledWith({
                deleteText: 'Delete',
                enabled: true,
                noPendingOrFailedText: 'No pending or failed OCR items found.',
                refreshButtonText: 'Refresh',
                status: status,
                tableHeadDeleteFromQueueText: 'Delete from queue',
                tableHeadNameText: 'Name',
                tableHeadStatusText: 'Status',
            });
            expect(result).toBe('template');
        });

        it('should return the rendered template for empty status array.', () => {
            const status: any = [];
            handlebarsTableTemplateFunctionMock.and.returnValue('template');

            const result = cut.renderTable(status);

            expect(handlebarsTableTemplateFunctionMock).toHaveBeenCalledWith({
                deleteText: 'Delete',
                enabled: false,
                noPendingOrFailedText: 'No pending or failed OCR items found.',
                refreshButtonText: 'Refresh',
                status: status,
                tableHeadDeleteFromQueueText: 'Delete from queue',
                tableHeadNameText: 'Name',
                tableHeadStatusText: 'Status',
            });
            expect(result).toBe('template');
        });
    });
});
