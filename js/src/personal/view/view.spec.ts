import { IJob } from '../controller/poto/job.poto';
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
            const jobs: Array<IJob> = [{ id: 1, status: 'FAILED', originalFilename: 'file.jpeg', errorLog: 'Failure' }];
            spyOn(cut, 'appendHtmlToElement');
            spyOn(cut, 'renderTable').and.returnValue('html');

            cut.render(jobs);

            expect(cut.renderTable).toHaveBeenCalledWith(jobs);
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
        it('should return the rendered template for non empty jobs array.', () => {
            const jobs: Array<IJob> = [{ id: 1, status: 'FAILED', originalFilename: 'file.jpeg', errorLog: 'Failure' }];
            handlebarsTableTemplateFunctionMock.and.returnValue('template');

            const result = cut.renderTable(jobs);

            expect(handlebarsTableTemplateFunctionMock).toHaveBeenCalledWith({
                deleteText: 'Delete',
                enabled: true,
                jobs: jobs,
                noPendingOrFailedText: 'No pending or failed OCR items found.',
                refreshButtonText: 'Refresh',
                tableHeadDeleteFromQueueText: 'Delete from queue',
                tableHeadFileText: 'File',
                tableHeadJobText: 'Status',
                tableHeadLogText: 'Log',
            });
            expect(result).toBe('template');
        });

        it('should return the rendered template for empty jobs array.', () => {
            const jobs: any = [];
            handlebarsTableTemplateFunctionMock.and.returnValue('template');

            const result = cut.renderTable(jobs);

            expect(handlebarsTableTemplateFunctionMock).toHaveBeenCalledWith({
                deleteText: 'Delete',
                enabled: false,
                jobs: jobs,
                noPendingOrFailedText: 'No pending or failed OCR items found.',
                refreshButtonText: 'Refresh',
                tableHeadDeleteFromQueueText: 'Delete from queue',
                tableHeadFileText: 'File',
                tableHeadJobText: 'Status',
                tableHeadLogText: 'Log',
            });
            expect(result).toBe('template');
        });
    });
});
