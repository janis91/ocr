import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { IFile } from '../controller/poto/file.poto';
import _ from 'underscore';
import { Controller } from '../controller/controller';

declare var OCA: any;
declare var t: ISingleTranslation;
declare var n: IMultiTranslation;

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

    constructor(private OC: any) { }

    /**
     * Destroy the OCR related FileActions.
     */
    public destroy(): void {
        OCA.Files.fileActions.clear();
        OCA.Files.fileActions.registerDefaultActions();
    }

    /**
     * Binds the instances selectedFilesActionButton to the events of the FileList
     * of the OCA.Files app.
     * @param instance The instance that the events should be bound to (this).
     */
    public registerCheckBoxEvents(instance: Controller): void {
        OCA.Files.App.fileList.$fileList.on('change', 'td.selection>.selectCheckBox', _.bind(instance.toggleSelectedFilesActionButton, instance));
        OCA.Files.App.fileList.$el.find('.select-all').click(_.bind(instance.toggleSelectedFilesActionButton, instance));
    }

    /**
     * Retrieves the array of selected files in the FileList of the OCA.Files app.
     * @returns The array of files that is currently selected.
     */
    public getSelectedFiles(): Array<IFile> {
        return OCA.Files.App.fileList.getSelectedFiles();
    }

    /**
     * Reloads the FileList of the OCA.Files app.
     */
    public reloadFilelist(): void {
        OCA.Files.App.fileList.reload();
    }

    /**
     * Registers the FileActions at OCA.Files app.
     */
    public registerFileActions(): void {
        // Register FileAction for MIME type pdf
        OCA.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'application/pdf',
            name: 'Ocr',
            order: 100,
            permissions: this.OC.PERMISSION_UPDATE,

        });
        // Register FileAction for MIME type image
        OCA.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: t('ocr', 'OCR'),
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'image',
            name: 'Ocr',
            order: 100,
            permissions: this.OC.PERMISSION_UPDATE,
        });
    }

    public registerMultiSelectMenuItem(handler: () => void) {
        const index = (OCA.Files.App.fileList.multiSelectMenuItems as Array<any>).findIndex(i => i.name === 'ocr');
        if (index !== -1) { return; }
        OCA.Files.App.fileList.multiSelectMenuItems.push({
            action: handler,
            displayName: t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            name: 'ocr',
        });
    }

    public unregisterMultiSelectMenuItem() {
        const index = (OCA.Files.App.fileList.multiSelectMenuItems as Array<any>).findIndex(i => i.name === 'ocr');
        if (index === -1) { return; }
        (OCA.Files.App.fileList.multiSelectMenuItems as Array<any>).splice(index, 1);
    }

    /**
     * Triggers the rendering of the OCR dropdown for a single file action.
     * Acts as the ActionHandler which is registered within the registerFileActions method.
     * @param ocaFilesFileName The file name retrieved by the OCAFiles.fileActions.
     * @param context The context object retrieved by the OCAFiles.fileActions.
     */
    private fileActionHandler(ocaFilesFileName: string, context: any): void {
        // We are in a callback context, therefore we need to call it statically. (As we cannot pass "this")
        OCA.Ocr.$app.controller.selectedFiles = [context.fileInfoModel.attributes];
        OCA.Ocr.$app.view.renderFileAction(OCA.Ocr.$app.controller.selectedFiles);
    }
}
