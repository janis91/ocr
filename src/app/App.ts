import { TesseractService } from '@a/services/TesseractService'
import { OcaService } from '@a/services/OcaService'
import { Util } from '@a/util/Util'
import { Translations } from '@a/configuration/Translations'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'
import { LOAD_FAVORITE_LANGUAGES, SET_SELECTED_FILES, SHOW_MODAL, CLEAR_SELECTED_FILES } from '@a/store/Store'

export class App {
  private tesseractService: TesseractService;
  private ocaService: OcaService;

  constructor() {
    this.ocaService = new OcaService()
    this.tesseractService = new TesseractService()
  }

  public init = () => {
    this.updateFavoriteLanguages()
    this.ocaService.registerFileActions(this.fileActionHandler)
    this.ocaService.registerCheckBoxEvents(this.selectedFilesActionHandler)
    // eslint-disable-next-line no-console
    console.debug('OCA.Ocr initialized')
  }

  public updateFavoriteLanguages = () => {
    OCA.Ocr.store.dispatch(LOAD_FAVORITE_LANGUAGES)
  }

  public process = async (file: OCAFile, selectedLanguages: string[], replace: boolean): Promise<void> => {
    const pdf = await this.tesseractService.process(OCA.Files.App.fileList.getDownloadUrl(file.name), selectedLanguages)
    const newPath = this.ocaService.getCurrentDirectory() + file.name.split('.').filter((k, i) => i !== file.name.split('.').length - 1).join('.') + '.pdf'
    await this.ocaService.putFileContents(newPath, pdf)
    if (replace) {
      await this.ocaService.deleteFile(file.name)
    }
  }

  public fileActionHandler: OCAFileActionHandler = (_something, context) => {
    const selectedFiles = Util.filterFilesWithMimeTypes([context.fileInfoModel.attributes])
    if (selectedFiles.length > 0) {
      OCA.Ocr.store.commit(SET_SELECTED_FILES, { selectedFiles })
      OCA.Ocr.store.commit(SHOW_MODAL)
    } else {
      NextcloudGuiApiService.displayError(`${Translations.TRANSLATION_OCR_PROCESSING_FAILED} ${Translations.TRANSLATION_MIMETYPE_NOT_SUPPORTED}`)
    }
  }

  public selectedFilesActionHandler: () => void = () => {
    const selFiles: Array<OCAFile> = Util.filterFilesWithMimeTypes(OCA.Files.App.fileList.getSelectedFiles())
    if (selFiles.length > 0) {
      this.ocaService.registerMultiSelectMenuItem(() => OCA.Ocr.store.commit(SHOW_MODAL))
      OCA.Ocr.store.commit(SET_SELECTED_FILES, { selectedFiles: selFiles })
    } else {
      this.ocaService.unregisterMultiSelectMenuItem()
      OCA.Ocr.store.commit(CLEAR_SELECTED_FILES)
    }
  }
}
