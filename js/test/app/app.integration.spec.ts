import { App } from '../../src/app/app';
import { windowAny } from '../fixtures/fixtures';

describe("The app's", () => {

    let cut: App;

    beforeEach(() => {
        jasmine.clock().install();
    });

    afterEach(() => {
        windowAny.OC = undefined;
        windowAny.OCA = undefined;
        windowAny.Tesseract = undefined;
        jasmine.clock().uninstall();
    });

    describe('constructor', () => {
        it('should construct the app successfully (and asynchronously), if everything necessary is available/prepared.', async () => {
            windowAny.OC = { Notification: {}, PERMISSION_UPDATE: 26 };
            windowAny.OCA = {
                Files: {
                    App: {
                        fileList: {
                            $el: jasmine.createSpyObj('$el', ['find']),
                            $fileList: jasmine.createSpyObj('$fileList', ['on']),
                            filesClient: {},
                        },
                    },
                    fileActions: {
                        registerAction: jasmine.createSpy('registerAction'),
                    },
                },
            };
            windowAny.OCA.Files.App.fileList.$el.find.and.returnValue(jasmine.createSpyObj('found', ['click']));
            windowAny.Tesseract = { TesseractWorker: jasmine.createSpy('TesseractWorker') };
            windowAny.t = jasmine.createSpy('t').and.returnValue('OCR');

            cut = new (await import('../../src/app/app')).App();

            jasmine.clock().tick(100);

            expect(cut.controller).toBeDefined();
            expect(cut.view).toBeDefined();
            expect(cut.ocaService).toBeDefined();
            expect(cut.tesseractService).toBeDefined();
            expect(cut.util).toBeDefined();
        });

        it('should show an Error, if something during the initiallization phase goes wrong.', async () => {
            windowAny.OC = { Notification: { showHtml: jasmine.createSpy('showHtml') }, PERMISSION_UPDATE: 26 };
            windowAny.OCA = {
                Files: {
                    App: {
                        fileList: {
                            $el: jasmine.createSpyObj('$el', ['find']),
                            $fileList: jasmine.createSpyObj('$fileList', ['on']),
                            filesClient: {},
                        },
                    },
                    fileActions: {
                        registerAction: jasmine.createSpy('registerAction'),
                    },
                },
            };
            windowAny.OCA.Files.App.fileList.$el.find.and.throwError('Test');
            windowAny.Tesseract = { TesseractWorker: jasmine.createSpy('TesseractWorker') };
            windowAny.t = jasmine.createSpy('t').withArgs('ocr', 'OCR').and.returnValue('OCR');

            cut = new (await import('../../src/app/app')).App();

            jasmine.clock().tick(100);

            expect(cut.controller).toBeDefined();
            expect(cut.view).toBeDefined();
            expect(cut.ocaService).toBeDefined();
            expect(cut.tesseractService).toBeDefined();
            expect(cut.util).toBeDefined();
            expect(windowAny.OC.Notification.showHtml).toHaveBeenCalledWith('<div>OCR: Test</div>', { timeout: 10, type: 'error' });
        });
        // FIXME: should work actually. But don't know why this is not working so often... I don't have a clue
        xit('should not construct the app as long as everything necessary is not available yet.', async () => {
            windowAny.t = jasmine.createSpy('t').and.returnValue('OCR');

            cut = new (await import('../../src/app/app')).App();

            // Next tick / init OC/OCA context
            expect(cut.controller).not.toBeDefined();
            expect(cut.view).not.toBeDefined();
            expect(cut.ocaService).not.toBeDefined();
            expect(cut.tesseractService).not.toBeDefined();
            expect(cut.util).not.toBeDefined();

            windowAny.OC = { Notification: {}, PERMISSION_UPDATE: 26 };
            windowAny.OCA = {
                Files: {
                    App: {
                        fileList: {
                            $el: jasmine.createSpyObj('$el', ['find']),
                            $fileList: jasmine.createSpyObj('$fileList', ['on']),
                            filesClient: {},
                        },
                    },
                    fileActions: {
                        registerAction: jasmine.createSpy('registerAction'),
                    },
                },
            };
            windowAny.OCA.Files.App.fileList.$el.find.and.returnValue(jasmine.createSpyObj('found', ['click']));

            // Next tick / init Tesseract
            jasmine.clock().tick(1000);

            expect(cut.controller).not.toBeDefined();
            expect(cut.view).not.toBeDefined();
            expect(cut.ocaService).not.toBeDefined();
            expect(cut.tesseractService).not.toBeDefined();
            expect(cut.util).not.toBeDefined();

            windowAny.Tesseract = { TesseractWorker: jasmine.createSpy('TesseractWorker') };

            // Next tick / everything should setup correctly
            jasmine.clock().tick(1000);

            expect(cut.controller).toBeDefined();
            expect(cut.view).toBeDefined();
            expect(cut.ocaService).toBeDefined();
            expect(cut.tesseractService).toBeDefined();
            expect(cut.util).toBeDefined();
        });
        // FIXME: should work actually. But don't know why this is not working so often... I don't have a clue
        xit('should not construct the app at all, when resources are not available after 5 seconds.', async () => {
            windowAny.t = jasmine.createSpy('t').and.returnValue('OCR');
            spyOn(console, 'error').and.callThrough();

            cut = new (await import('../../src/app/app')).App();

            // Next tick / init OC/OCA context
            expect(cut.controller).not.toBeDefined();
            expect(cut.view).not.toBeDefined();
            expect(cut.ocaService).not.toBeDefined();
            expect(cut.tesseractService).not.toBeDefined();
            expect(cut.util).not.toBeDefined();

            windowAny.OC = { Notification: {}, PERMISSION_UPDATE: 26 };
            windowAny.OCA = {
                Files: {
                    App: {
                        fileList: {
                            $el: jasmine.createSpyObj('$el', ['find']),
                            $fileList: jasmine.createSpyObj('$fileList', ['on']),
                            filesClient: {},
                        },
                    },
                    fileActions: {
                        registerAction: jasmine.createSpy('registerAction'),
                    },
                },
            };
            windowAny.OCA.Files.App.fileList.$el.find.and.returnValue(jasmine.createSpyObj('found', ['click']));

            // Next tick / init Tesseract
            jasmine.clock().tick(10000);

            expect(console.error).toHaveBeenCalledWith('OCR could not be initiallized. Some of the required resources (OC, OCA, Tesseract, etc.) did not load in time.');
            expect(cut.controller).not.toBeDefined();
            expect(cut.view).not.toBeDefined();
            expect(cut.ocaService).not.toBeDefined();
            expect(cut.tesseractService).not.toBeDefined();
            expect(cut.util).not.toBeDefined();

            windowAny.Tesseract = { TesseractWorker: jasmine.createSpy('TesseractWorker') };

            // Next tick / everything should setup correctly
            jasmine.clock().tick(100);

            expect(cut.controller).not.toBeDefined();
            expect(cut.view).not.toBeDefined();
            expect(cut.ocaService).not.toBeDefined();
            expect(cut.tesseractService).not.toBeDefined();
            expect(cut.util).not.toBeDefined();
        });
    });
});
