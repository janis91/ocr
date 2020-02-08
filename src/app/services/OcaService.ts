import { Translations as CommonTranslations } from '@/common/Translations'
import { OcaError } from '@a/error/OcaError'
import { Translations } from '@a/configuration/Translations'

export class OcaService {
    public registerFileActions: (actionHandler: OCAFileActionHandler) => void = (actionHandler) => {
      OCA.Files.fileActions.registerAction({
        actionHandler,
        altText: CommonTranslations.TRANSLATION_OCR,
        displayName: CommonTranslations.TRANSLATION_OCR,
        iconClass: 'icon-ocr',
        mime: 'image',
        name: 'Ocr',
        order: 100,
        permissions: OC.PERMISSION_UPDATE
      })
    }

    public registerCheckBoxEvents: (handler: () => void) => void = (handler) => {
      OCA.Files.App.fileList.$fileList.on('change', 'td.selection>.selectCheckBox', handler)
      OCA.Files.App.fileList.$el.find('.select-all').click(handler)
    }

    public registerMultiSelectMenuItem: (handler: () => void) => void = (handler) => {
      const index = OCA.Files.App.fileList.multiSelectMenuItems.findIndex(i => i.name === 'ocr')
      if (index !== -1) return
      OCA.Files.App.fileList.multiSelectMenuItems.push({
        action: handler,
        displayName: CommonTranslations.TRANSLATION_OCR,
        iconClass: 'icon-ocr',
        name: 'ocr'
      })
      OCA.Files.App.fileList.fileMultiSelectMenu.render(OCA.Files.App.fileList.multiSelectMenuItems)
    }

    public unregisterMultiSelectMenuItem: () => void = () => {
      const index = OCA.Files.App.fileList.multiSelectMenuItems.findIndex(i => i.name === 'ocr')
      if (index === -1) return
      OCA.Files.App.fileList.multiSelectMenuItems.splice(index, 1)
      OCA.Files.App.fileList.fileMultiSelectMenu.render(OCA.Files.App.fileList.multiSelectMenuItems)
    }

    public getCurrentDirectory: () => string = () => {
      const dir = OCA.Files.App.fileList.getCurrentDirectory()
      return dir.endsWith('/') ? dir : dir + '/'
    }

    public putFileContents: (path: string, body: ArrayBuffer) => Promise<void> = async (path, body) => {
      try {
        await new Promise((resolve, reject) => OCA.Files.App.fileList.filesClient.putFileContents(path, body, { contentType: 'application/pdf', overwrite: true })
          .done(resolve)
          .fail(reject))
        await new Promise((resolve, reject) => OCA.Files.App.fileList.addAndFetchFileInfo(path, '', { scrollTo: true })
          .done(resolve)
          .fail(reject))
      } catch (e) {
        if (e === 412) {
          throw new OcaError(`${Translations.TRANSLATION_TARGET_FILE_ALREADY_EXISTS} ${path}`)
        } else {
          throw new OcaError(Translations.TRANSLATION_UNEXPECTED_ERROR_UPLOAD, e)
        }
      }
    }

    public deleteFile: (fileName: string) => Promise<void> = async (name) => {
      try {
        await new Promise((resolve, reject) => OCA.Files.App.fileList.filesClient.remove(this.getCurrentDirectory() + name)
          .done(resolve)
          .fail(reject))
        OCA.Files.App.fileList.remove(name)
      } catch (e) {
        throw new OcaError(Translations.TRANSLATION_UNEXPECTED_ERROR_DELETION, e)
      }
    }
}
