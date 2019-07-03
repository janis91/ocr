import { OcaService } from '../../../src/app/service/oca.service';
import { OC, OCA, MultiSelectMenuItem } from '../../../src/global-oc-types';
import { windowAny, FilesFixtures, JqPromiseMock } from '../../fixtures/fixtures';
import { OcaError } from '../../../src/app/service/error/oca.error';

describe("The ocaService's", () => {

    let cut: OcaService;
    let ocMock: OC;
    let ocaMock: OCA;
    let multiSelectMenuItems: MultiSelectMenuItem[];


    beforeEach(async () => {
        windowAny.t = jasmine.createSpy('t');
        windowAny.n = jasmine.createSpy('n');
        ocMock = {
            Notification: jasmine.createSpyObj('Notification', ['showHtml']),
            PERMISSION_UPDATE: 26,
        };
        ocaMock = createOCAMock();
        cut = new (await import('../../../src/app/service/oca.service')).OcaService(ocMock, ocaMock);
    });

    afterEach(() => {
        multiSelectMenuItems = undefined;
    });

    describe('destroy function', () => {
        it('should destroy the service correctly.', () => {
            (ocaMock.Files.fileActions.clear as jasmine.Spy).and.returnValue(undefined);
            (ocaMock.Files.fileActions.registerDefaultActions as jasmine.Spy).and.returnValue(undefined);
            spyOn(cut, 'unregisterMultiSelectMenuItem').and.returnValue();

            cut.destroy();

            expect(ocaMock.Files.fileActions.clear).toHaveBeenCalledTimes(1);
            expect(ocaMock.Files.fileActions.registerDefaultActions).toHaveBeenCalledTimes(1);
            expect(cut.unregisterMultiSelectMenuItem).toHaveBeenCalledTimes(1);
        });
    });

    describe('registerCheckBoxEvents function', () => {
        it('should register the given on change and click handler for multiselect checkboxes.', () => {
            const handler = jasmine.createSpy('handler');
            (ocaMock.Files.App.fileList.$fileList.on as jasmine.Spy).and.returnValue(undefined);
            const el = jasmine.createSpyObj('el', ['click']);
            el.click.and.returnValue();
            (ocaMock.Files.App.fileList.$el.find as jasmine.Spy).and.returnValue(el);

            cut.registerCheckBoxEvents(handler);

            expect(ocaMock.Files.App.fileList.$fileList.on).toHaveBeenCalledWith('change', 'td.selection>.selectCheckBox', handler);
            expect(ocaMock.Files.App.fileList.$el.find).toHaveBeenCalledWith('.select-all');
            expect(el.click).toHaveBeenCalledWith(handler);
        });
    });

    describe('getSelectedFiles function', () => {
        it('should return the selected files for one file.', () => {
            const files = [FilesFixtures.PNG];
            (ocaMock.Files.App.fileList.getSelectedFiles as jasmine.Spy).and.returnValue(files);

            const result = cut.getSelectedFiles();

            expect(result).toBe(files);
        });

        it('should return the selected files for two files.', () => {
            const files = [FilesFixtures.PNG, FilesFixtures.PDF];
            (ocaMock.Files.App.fileList.getSelectedFiles as jasmine.Spy).and.returnValue(files);

            const result = cut.getSelectedFiles();

            expect(result).toBe(files);
        });
    });

    describe('reloadFilelist function', () => {
        it('should trigger reload.', () => {
            (ocaMock.Files.App.fileList.reload as jasmine.Spy).and.returnValue(undefined);

            cut.reloadFilelist();

            expect(ocaMock.Files.App.fileList.reload).toHaveBeenCalledTimes(1);
        });
    });

    describe('registerFileActions function', () => {
        it('should register file actions for pdf and images for the given action handler.', () => {
            const handler = jasmine.createSpy('handler');
            (ocaMock.Files.fileActions.registerAction as jasmine.Spy).and.returnValue(undefined);
            windowAny.t.withArgs('ocr', 'OCR').and.returnValue('OCR');

            cut.registerFileActions(handler);

            expect((ocaMock.Files.fileActions.registerAction as jasmine.Spy).calls.argsFor(0)).toEqual([{
                actionHandler: handler,
                altText: 'OCR',
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                mime: 'application/pdf',
                name: 'Ocr',
                order: 100,
                permissions: 26,
            }]);
            expect((ocaMock.Files.fileActions.registerAction as jasmine.Spy).calls.argsFor(1)).toEqual([{
                actionHandler: handler,
                altText: 'OCR',
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                mime: 'image',
                name: 'Ocr',
                order: 100,
                permissions: 26,
            }]);
        });
    });

    describe('registerMultiSelectMenuItem function', () => {
        it('should add the MultiSelectMenuItem to the menu if not existing.', () => {
            ocaMock.Files.App.fileList.multiSelectMenuItems = [];
            const handler = jasmine.createSpy('handler');
            windowAny.t.withArgs('ocr', 'OCR').and.returnValue('OCR');

            cut.registerMultiSelectMenuItem(handler);

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(1);
            expect(ocaMock.Files.App.fileList.multiSelectMenuItems).toContain({
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            });
        });

        it('should add the MultiSelectMenuItem to the menu if not existing and others are not touched.', () => {
            ocaMock.Files.App.fileList.multiSelectMenuItems = [{ action: () => console.log, displayName: 'Test', iconClass: 'icon-test', name: 'test' }];
            const handler = jasmine.createSpy('handler');
            windowAny.t.withArgs('ocr', 'OCR').and.returnValue('OCR');

            cut.registerMultiSelectMenuItem(handler);

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(2);
            expect(ocaMock.Files.App.fileList.multiSelectMenuItems).toContain({
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            });
        });

        it('should do nothing to the menu if item exists already.', () => {
            ocaMock.Files.App.fileList.multiSelectMenuItems = [{
                action: jasmine.createSpy('handler'),
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            }];

            cut.registerMultiSelectMenuItem(jasmine.createSpy('handler'));

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(1);
        });
    });

    describe('unregisterMultiSelectMenuItem function', () => {
        it('should unregister the MultiSelectMenuItem, if existing.', () => {
            const handler = jasmine.createSpy('handler');
            ocaMock.Files.App.fileList.multiSelectMenuItems = [{
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            }];

            cut.unregisterMultiSelectMenuItem();

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).not.toContain({
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            });
            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(0);
        });

        it('should not unregister the MultiSelectMenuItem, if not existing.', () => {
            ocaMock.Files.App.fileList.multiSelectMenuItems = [];

            cut.unregisterMultiSelectMenuItem();

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(0);
        });

        it('should unregister the MultiSelectMenuItem, if existing and not touch any other item.', () => {
            const handler = jasmine.createSpy('handler');
            ocaMock.Files.App.fileList.multiSelectMenuItems = [{
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            }, { action: () => console.log, displayName: 'Test', iconClass: 'icon-test', name: 'test' }];

            cut.unregisterMultiSelectMenuItem();

            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).toEqual(1);
            expect(ocaMock.Files.App.fileList.multiSelectMenuItems.length).not.toContain({
                action: handler,
                displayName: 'OCR',
                iconClass: 'icon-ocr',
                name: 'ocr',
            });
        });
    });

    describe('getDownloadUrl function', () => {
        it('should get the download url for the given file.', () => {
            (ocaMock.Files.App.fileList.getDownloadUrl as jasmine.Spy).and.returnValue('/url');

            const result = cut.getDownloadUrl(FilesFixtures.PNG);

            expect(ocaMock.Files.App.fileList.getDownloadUrl).toHaveBeenCalledWith('file3.png');
            expect(result).toEqual('/url');
        });
    });

    describe('putFileContents function', () => {
        it('should put the given binary to the given path and overwrite the origin for replace = true AND add and fetch the file info in the filelist.', async () => {
            const putFileContentsPromise = new JqPromiseMock();
            const addAndFetchFileInfoPromise = new JqPromiseMock();
            const file = new Uint8Array(1);
            (ocaMock.Files.App.fileList.filesClient.putFileContents as jasmine.Spy).and.returnValue(putFileContentsPromise);
            (ocaMock.Files.App.fileList.addAndFetchFileInfo as jasmine.Spy).and.returnValue(addAndFetchFileInfoPromise);

            await cut.putFileContents('/file1.pdf', file, true);

            expect(ocaMock.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/file1.pdf', file, { contentType: 'application/pdf', overwrite: false });
            expect(ocaMock.Files.App.fileList.addAndFetchFileInfo).toHaveBeenCalledWith('/file1.pdf', '', { scrollTo: true });
        });

        it('should put the given binary to the given path and do not overwrite the origin for replace = false AND add and fetch the file info in the filelist.', async () => {
            const putFileContentsPromise = new JqPromiseMock();
            const addAndFetchFileInfoPromise = new JqPromiseMock();
            const file = new Uint8Array(1);
            (ocaMock.Files.App.fileList.filesClient.putFileContents as jasmine.Spy).and.returnValue(putFileContentsPromise);
            (ocaMock.Files.App.fileList.addAndFetchFileInfo as jasmine.Spy).and.returnValue(addAndFetchFileInfoPromise);

            await cut.putFileContents('/file1.pdf', file, false);

            expect(ocaMock.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/file1.pdf', file, { contentType: 'application/pdf', overwrite: true });
            expect(ocaMock.Files.App.fileList.addAndFetchFileInfo).toHaveBeenCalledWith('/file1.pdf', '', { scrollTo: true });
        });

        it('should reject with an error, if something goes wrong with the upload.', async () => {
            const putFileContentsPromise = new JqPromiseMock(3);
            const file = new Uint8Array(1);
            (ocaMock.Files.App.fileList.filesClient.putFileContents as jasmine.Spy).and.returnValue(putFileContentsPromise);
            windowAny.t.withArgs('ocr', 'An unexpected error occured during the upload of the processed file.').and.returnValue('An unexpected error occured during the upload of the processed file.');

            const result = cut.putFileContents('/file1.pdf', file, true);

            await expectAsync(result).toBeRejectedWith(new OcaError('An unexpected error occured during the upload of the processed file.', 3));
            expect(ocaMock.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/file1.pdf', file, { contentType: 'application/pdf', overwrite: false });
        });

        it('should reject with an error, if something goes wrong with the data fetch.', async () => {
            const putFileContentsPromise = new JqPromiseMock();
            const addAndFetchFileInfoPromise = new JqPromiseMock(3);
            const file = new Uint8Array(1);
            (ocaMock.Files.App.fileList.filesClient.putFileContents as jasmine.Spy).and.returnValue(putFileContentsPromise);
            (ocaMock.Files.App.fileList.addAndFetchFileInfo as jasmine.Spy).withArgs('/file1.pdf', '', { scrollTo: true }).and.returnValue(addAndFetchFileInfoPromise);
            windowAny.t.withArgs('ocr', 'An unexpected error occured during the upload of the processed file.')
                .and.returnValue('An unexpected error occured during the upload of the processed file.');

            const result = cut.putFileContents('/file1.pdf', file, true);

            await expectAsync(result).toBeRejectedWith(new OcaError('An unexpected error occured during the upload of the processed file.', 3));
            expect(ocaMock.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/file1.pdf', file, { contentType: 'application/pdf', overwrite: false });
            expect(ocaMock.Files.App.fileList.addAndFetchFileInfo).toHaveBeenCalledWith('/file1.pdf', '', { scrollTo: true });
        });

        it('should reject with a specific error, if target file already exists when uploading a file with replace = false.', async () => {
            const putFileContentsPromise = new JqPromiseMock(412);
            const file = new Uint8Array(1);
            (ocaMock.Files.App.fileList.filesClient.putFileContents as jasmine.Spy).and.returnValue(putFileContentsPromise);
            windowAny.t.withArgs('ocr', 'Target file already exists:').and.returnValue('Target file already exists:');

            const result = cut.putFileContents('/file1.pdf', file, false);

            await expectAsync(result).toBeRejectedWith(new OcaError('Target file already exists: /file1.pdf'));
            expect(ocaMock.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/file1.pdf', file, { contentType: 'application/pdf', overwrite: true });
        });
    });

    describe('deleteFile function', () => {
        it('should remove the given file from the list and the server.', async () => {
            const removePromise = new JqPromiseMock();
            (ocaMock.Files.App.fileList.filesClient.remove as jasmine.Spy).and.returnValue(removePromise);
            (ocaMock.Files.App.fileList.remove as jasmine.Spy).and.returnValue(undefined);

            await cut.deleteFile(FilesFixtures.PDF);

            expect(ocaMock.Files.App.fileList.filesClient.remove).toHaveBeenCalledWith(FilesFixtures.PDF.path + FilesFixtures.PDF.name);
            expect(ocaMock.Files.App.fileList.remove).toHaveBeenCalledWith(FilesFixtures.PDF.name);
        });

        it('should be rejected, if remove does not succeed.', async () => {
            const removePromise = new JqPromiseMock(5);
            (ocaMock.Files.App.fileList.filesClient.remove as jasmine.Spy).and.returnValue(removePromise);
            windowAny.t.withArgs('ocr', 'An unexpected error occured during the deletion of the original file.')
                .and.returnValue('An unexpected error occured during the deletion of the original file.');

            const result = cut.deleteFile(FilesFixtures.PDF);

            await expectAsync(result).toBeRejectedWith(new OcaError('An unexpected error occured during the deletion of the original file.', 5));
            expect(ocaMock.Files.App.fileList.filesClient.remove).toHaveBeenCalledWith(FilesFixtures.PDF.path + FilesFixtures.PDF.name);
        });
    });

    describe('getCurrentDirectory function', () => {
        it('should return the current directory as string.', () => {
            (ocaMock.Files.App.fileList.getCurrentDirectory as jasmine.Spy).and.returnValue('/');

            const result = cut.getCurrentDirectory();

            expect(result).toEqual('/');
        });
    });

    // PRIVATE
    function createOCAMock() {
        return {
            Files: {
                App: {
                    fileList: {
                        $el: jasmine.createSpyObj('$el', ['find']),
                        $fileList: jasmine.createSpyObj('$fileList', ['on']),
                        addAndFetchFileInfo: jasmine.createSpy('addAndFetchFileInfo'),
                        filesClient: jasmine.createSpyObj('filesClient', ['putFileContents', 'remove']),
                        getCurrentDirectory: jasmine.createSpy('getCurrentDirectory'),
                        getDownloadUrl: jasmine.createSpy('getDownloadUrl'),
                        getSelectedFiles: jasmine.createSpy('getSelectedFiles'),
                        multiSelectMenuItems,
                        reload: jasmine.createSpy('reload'),
                        remove: jasmine.createSpy('remove'),
                    },
                },
                fileActions: jasmine.createSpyObj('fileActions', ['clear', 'registerDefaultActions', 'registerAction']),
            },
        };
    }
});
