import { IMultiTranslation, ISingleTranslation } from '../../global-oc-functions';
import { IFile, File } from '../controller/poto/file.poto';
import _ from 'underscore';

declare var OCA: any;

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */
// TODO: testing with giving in the OCA.Files.fileActions or FileList and so on directly (separately).
export class OcaService {

    constructor(private t: ISingleTranslation, private n: IMultiTranslation, private OC: any) { }

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
    public registerCheckBoxEvents(instance: any): void {
        OCA.Files.App.fileList.$fileList.on('change', 'td.filename>.selectCheckBox', _.bind(instance.toggleSelectedFilesActionButton, instance));
        OCA.Files.App.fileList.$el.find('.select-all').click(_.bind(instance.toggleSelectedFilesActionButton, instance));
        OCA.Files.App.fileList.$el.find('.delete-selected').click(_.bind(instance.hideSelectedFilesActionButton, instance));
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
        // Register FileAction for mimetype pdf
        OCA.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: this.t('ocr', 'OCR'),
            displayName: this.t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'application/pdf',
            name: 'Ocr',
            order: 100,
            permissions: this.OC.PERMISSION_UPDATE,

        });
        // Register FileAction for mimetype image
        OCA.Files.fileActions.registerAction({
            actionHandler: this.fileActionHandler,
            altText: this.t('ocr', 'OCR'),
            displayName: this.t('ocr', 'OCR'),
            iconClass: 'icon-ocr',
            mime: 'image',
            name: 'Ocr',
            order: 100,
            permissions: this.OC.PERMISSION_UPDATE,
        });
    }

    /**
     * Triggers the rendering of the OCR dropdown for a single file action.
     * Acts as the ActionHandler which is registered within the registerFileActions method.
     * @param ocaFilesFileName The file name retrieved by the OCAFiles.fileActions.
     * @param context The context object retrieved by the OCAFiles.fileActions.
     */
    private fileActionHandler(ocaFilesFileName: string, context: any): void {
        const file: IFile = new File();
        file.id = context.$file.attr('data-id');
        file.mimetype = context.fileActions.getCurrentMimeType();
        const files = new Array<IFile>();
        files.push(file);
        // We are in a callback context, therefore we need to call it statically. (As we cannot pass "this")
        OCA.Ocr.$app.controller.selectedFiles = files;
        OCA.Ocr.$app.view.renderFileAction(ocaFilesFileName, OCA.Ocr.$app.controller.availableLanguages);
    }
}
