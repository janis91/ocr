import { OCSingleTranslation, OCA, OC, OCAFileActionHandler, OCAFile } from '../../global-oc-types';
import { Util } from '../util/util';
import { OcaError } from './error/oca.error';

declare var t: OCSingleTranslation;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class OcaService {

    public static checkOCAvailability: () => boolean = () => {
        const isAvailable = Util.isDefinedIn;
        const win = (window as any);
        return isAvailable('OC', window) && isAvailable('Notification', win.OC) && // OC.Notification is used by the View
            isAvailable('OCA', window) && isAvailable('Files', win.OCA) &&
            isAvailable('fileActions', win.OCA.Files) &&
            isAvailable('App', win.OCA.Files) && isAvailable('fileList', win.OCA.Files.App) &&
            isAvailable('filesClient', win.OCA.Files.App.fileList);
    }

    constructor(private oc: OC, private oca: OCA) { }

    /**
     * Destroy the OCR related FileActions.
     */
    public destroy: () => void = () => {
        this.oca.Files.fileActions.clear();
        this.oca.Files.fileActions.registerDefaultActions();
        this.unregisterMultiSelectMenuItem();
    }

    /**
     * Binds the selectedFilesActionButton to the events of the FileList
     * of the OCA.Files app.
     */
    public registerCheckBoxEvents: (handler: () => void) => void = (handler) => {
        this.oca.Files.App.fileList.$fileList.on('change', 'td.selection>.selectCheckBox', handler);
        this.oca.Files.App.fileList.$el.find('.select-all').click(handler);
    }

    /**
     * Retrieves the array of selected files in the FileList of the OCA.Files app.
     * @returns The array of files that is currently selected.
     */
    public getSelectedFiles: () => Array<OCAFile> = () => {
        return this.oca.Files.App.fileList.getSelectedFiles();
    }

    /**
     * Reloads the FileList of the OCA.Files app.
     */
    public reloadFilelist: () => void = () => {
        this.oca.Files.App.fileList.reload();
    }

    /**
     * Registers the FileActions at OCA.Files app for pdf and images.
     */
    public registerFileActions: (actionHandler: OCAFileActionHandler) => void = (actionHandler) => {
        this.oca.Files.fileActions.registerAction({
            actionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'application/pdf',
            name: 'Ocr',
            order: 100,
            permissions: this.oc.PERMISSION_UPDATE,
        });
        this.oca.Files.fileActions.registerAction({
            actionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'image',
            name: 'Ocr',
            order: 100,
            permissions: this.oc.PERMISSION_UPDATE,
        });
    }

    public registerMultiSelectMenuItem: (handler: () => void) => void = (handler) => {
        const index = this.oca.Files.App.fileList.multiSelectMenuItems.findIndex(i => i.name === 'ocr');
        if (index !== -1) { return; }
        this.oca.Files.App.fileList.multiSelectMenuItems.push({
            action: handler,
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            name: 'ocr',
        });
    }

    public unregisterMultiSelectMenuItem: () => void = () => {
        const index = this.oca.Files.App.fileList.multiSelectMenuItems.findIndex(i => i.name === 'ocr');
        if (index === -1) { return; }
        this.oca.Files.App.fileList.multiSelectMenuItems.splice(index, 1);
    }

    public getDownloadUrl: (file: OCAFile) => string = (file) => {
        return this.oca.Files.App.fileList.getDownloadUrl(file.name);
    }

    public putFileContents: (path: string, body: ArrayBuffer, replace: boolean) => Promise<void> = async (path, body, replace) => {
        try {
            await new Promise((resolve, reject) => {
                this.oca.Files.App.fileList.filesClient.putFileContents(path, body, { contentType: 'application/pdf', overwrite: !replace })
                    .done(resolve)
                    .fail(reject);
            });
            await new Promise((resolve, reject) => {
                this.oca.Files.App.fileList.addAndFetchFileInfo(path, '', { scrollTo: true })
                    .done(resolve)
                    .fail(reject);
            });
        } catch (e) {
            if (e === 412) {
                throw new OcaError(`${t('ocr', 'Target file already exists:')} ${path}`);
            } else {
                throw new OcaError(t('ocr', 'An unexpected error occured during the upload of the processed file.'), e);
            }
        }
    }

    public deleteFile: (file: OCAFile) => Promise<void> = async (file) => {
        try {
            await new Promise((resolve, reject) => {
                this.oca.Files.App.fileList.filesClient.remove(file.path + file.name)
                    .done(resolve)
                    .fail(reject);
            });
            this.oca.Files.App.fileList.remove(file.name);
        } catch (e) {
            throw new OcaError(t('ocr', 'An unexpected error occured during the deletion of the original file.'), e);
        }
    }

    public getCurrentDirectory: () => string = () => {
        return this.oca.Files.App.fileList.getCurrentDirectory();
    }
}
