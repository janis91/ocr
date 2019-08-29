import { App } from '../../src/settings/App';
import { windowAny } from '../fixtures/fixtures';
import 'jasmine-ajax';

describe("The App's", () => {

    let cut: App;

    beforeEach(() => {
        jasmine.clock().install();
        jasmine.Ajax.install();
    });

    afterEach(() => {
        windowAny.t = undefined;
        windowAny.n = undefined;
        windowAny.OC = undefined;
        jasmine.clock().uninstall();
        jasmine.Ajax.uninstall();
    });

    describe('constructor', () => {
        it('should construct the app successfully (and asynchronously), if everything necessary is available/prepared.', async () => {
            windowAny.OC = { Notification: {} };
            windowAny.t = jasmine.createSpy('t').and.callFake((_x, y) => y);
            windowAny.n = jasmine.createSpy('n');
            jasmine.Ajax.stubRequest('/apps/ocr/api/personal/languages').andReturn({
                status: 200,
                response: '["deu"]',
                responseHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });

            cut = new (await import('../../src/settings/App')).App();

            jasmine.clock().tick(100);

            expect(cut.controller).toBeDefined();
            expect(cut.view).toBeDefined();
            expect(cut.httpService).toBeDefined();
        });

        // FIXME: does not work because of the very annoying bug of jasmine, that does not provide the ability to clear an interval in the fake clock.
        xit('should show an Error, if something during the initiallization phase goes wrong.', async () => {
            windowAny.OC = { Notification: { showHtml: jasmine.createSpy('showHtml') }, generateUrl: (t: string) => t, appswebroots: { ocr: '/apps/ocr' } };
            windowAny.t = jasmine.createSpy('t').and.callFake((_x, y) => y);
            windowAny.n = jasmine.createSpy('n');
            jasmine.Ajax.stubRequest('/apps/ocr/api/personal/languages').andReturn({
                status: 400,
                response: '',
                responseHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
            });

            cut = new (await import('../../src/settings/App')).App();

            jasmine.clock().tick(100);

            expect(cut.controller).toBeDefined();
            expect(cut.view).toBeDefined();
            expect(cut.httpService).toBeDefined();
            expect(windowAny.OC.Notification.showHtml)
                .toHaveBeenCalledWith('<div>OCR: An unexpected error occured during load of your favorite languages. Please try again.</div>', { timeout: 10, type: 'error' });
        });
    });
});
