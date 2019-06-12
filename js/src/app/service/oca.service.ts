import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { IFile } from '../controller/poto/file.poto';

declare var OCA: any;
declare var OC: any;
declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

export type OCAFilesFileActionHandler = (ocaFilesFileName: string, context: any) => void;

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
        return OC && OCA && OCA.Files && OCA.Files.fileActions && OCA.Files.App && OCA.Files.App.fileList && OCA.Files.App.fileList.filesClient;
    }

    constructor(private oc: any, private oca: any) { }

    /**
     * Destroy the OCR related FileActions.
     */
    public destroy: () => void = () => {
        this.oca.Files.fileActions.clear();
        this.oca.Files.fileActions.registerDefaultActions();
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
    public getSelectedFiles: () => Array<IFile> = () => {
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
    public registerFileActions: (actionHandler: OCAFilesFileActionHandler) => void = (actionHandler) => {
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
        const index = (this.oca.Files.App.fileList.multiSelectMenuItems as Array<any>).findIndex(i => i.name === 'ocr');
        if (index !== -1) { return; }
        this.oca.Files.App.fileList.multiSelectMenuItems.push({
            action: handler,
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            name: 'ocr',
        });
    }

    public unregisterMultiSelectMenuItem: () => void = () => {
        const index = (this.oca.Files.App.fileList.multiSelectMenuItems as Array<any>).findIndex(i => i.name === 'ocr');
        if (index === -1) { return; }
        (this.oca.Files.App.fileList.multiSelectMenuItems as Array<any>).splice(index, 1);
    }

    public getDownloadUrl: (file: IFile) => string = (file) => {
        return this.oca.Files.App.fileList.getDownloadUrl(file.name);
    }

    public putFileContents: (path: string, body: any, replace: boolean) => Promise<void> = async (path, body, replace) => {
        try {
            await new Promise((resolve, reject) => {
                this.oca.Files.App.fileList.filesClient.putFileContents(path, body, { contentType: 'application/pdf', overwrite: !replace })
                    .done(resolve).fail(reject);
            });
            await new Promise((resolve, reject) => {
                this.oca.Files.App.fileList.addAndFetchFileInfo(path, '', { scrollTo: true }).then(resolve).fail(reject);
            });
        } catch (e) {
            if (e === 412) {
                throw new Error(`${t('ocr', 'Target file already exists:')} ${path}`);
            }
        }
    }

    public deleteFile: (file: IFile) => Promise<void> = async (file) => {
        await new Promise((resolve, reject) => {
            this.oca.Files.App.fileList.filesClient.remove(file.path + file.name).done(resolve).fail(reject);
        });
        this.oca.Files.App.fileList.remove(file);
    }

    public getCurrentDirectory: () => string = () => {
        return this.oca.Files.App.fileList.getCurrentDirectory();
    }
}
