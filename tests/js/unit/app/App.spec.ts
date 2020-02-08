import '../GlobalMocks.mock'
import { App } from '@a/App.ts'
import { OcaService } from '@a/services/OcaService'
import { LOAD_FAVORITE_LANGUAGES, SET_SELECTED_FILES, SHOW_MODAL, CLEAR_SELECTED_FILES } from '@a/store/Store'
import { FileFixtures } from '../fixtures/FileFixtures'
import { TesseractService } from '@/app/services/TesseractService'
import { Util } from '@a/util/Util'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'

const mockOcaService: Partial<OcaService> = {
  getCurrentDirectory: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  putFileContents: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  registerFileActions: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  registerCheckBoxEvents: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  deleteFile: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  registerMultiSelectMenuItem: jest.fn(() => { throw new Error('Mock behavior not defined') }),
  unregisterMultiSelectMenuItem: jest.fn(() => { throw new Error('Mock behavior not defined') })
}
const mockTesseractService: Partial<TesseractService> = {
  process: jest.fn(() => { throw new Error('Mock behavior not defined') })
};
(OCA.Ocr as any) = {
  store: {
    dispatch: jest.fn(() => { throw new Error('Mock behavior not defined') }),
    commit: jest.fn(() => { throw new Error('Mock behavior not defined') })
  }
}

jest.mock('@a/store/Store')
jest.mock('@a/services/TesseractService', () => {
  return { TesseractService: jest.fn().mockImplementation(() => mockTesseractService) }
})
jest.mock('@a/services/OcaService', () => {
  return { OcaService: jest.fn().mockImplementation(() => mockOcaService) }
})
jest.mock('@a/util/Util')
jest.mock('@a/services/NextcloudGuiApiService')

describe('App', () => {
  let cut: App

  beforeEach(() => {
    cut = new App()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('init()', () => {
    it('WHEN init is called, THEN returns.', () => {
      (mockOcaService.registerFileActions as jest.Mock).mockReturnValueOnce(undefined);
      (mockOcaService.registerCheckBoxEvents as jest.Mock).mockReturnValueOnce(undefined);
      (OCA.Ocr.store.dispatch as jest.Mock).mockReturnValueOnce(undefined)

      cut.init()

      expect(OCA.Ocr.store.dispatch).toHaveBeenCalledWith(LOAD_FAVORITE_LANGUAGES)
      expect(mockOcaService.registerCheckBoxEvents).toHaveBeenCalledWith(cut.selectedFilesActionHandler)
      expect(mockOcaService.registerFileActions).toHaveBeenCalledWith(cut.fileActionHandler)
    })
  })

  describe('process()', () => {
    it('GIVEN tesseract processes successful AND pdf can be put to server, WHEN process is called with file = PNG AND languages = ["deu"] AND replace = false, THEN resolves.', async () => {
      const pdf = new Uint8Array(0);
      (mockOcaService.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/');
      (mockOcaService.putFileContents as jest.Mock).mockResolvedValueOnce(undefined);
      (mockTesseractService.process as jest.Mock).mockResolvedValueOnce(pdf);
      (OCA.Files.App.fileList.getDownloadUrl as jest.Mock).mockReturnValueOnce('https://something/file3.png')

      await cut.process(FileFixtures.PNG, ['deu'], false)

      expect(mockTesseractService.process).toHaveBeenCalledWith('https://something/file3.png', ['deu'])
      expect(OCA.Files.App.fileList.getDownloadUrl).toHaveBeenCalledWith(FileFixtures.PNG.name)
      expect(mockOcaService.getCurrentDirectory).toHaveBeenCalledWith()
      expect(mockOcaService.putFileContents).toHaveBeenCalledWith('/file3.pdf', pdf)
    })

    it('GIVEN tesseract processes successful AND pdf can be put to server, WHEN process is called with file that has multiple dots in name AND languages = ["deu", "eng"] AND replace = true, THEN resolves.', async () => {
      const pdf = new Uint8Array(0)
      const file = {
        ...FileFixtures.PNG,
        name: 'file3.cool.png'
      };
      (mockOcaService.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/test/');
      (mockOcaService.putFileContents as jest.Mock).mockResolvedValueOnce(undefined);
      (mockTesseractService.process as jest.Mock).mockResolvedValueOnce(pdf);
      (OCA.Files.App.fileList.getDownloadUrl as jest.Mock).mockReturnValueOnce('https://something/test/file3.cool.png');
      (mockOcaService.deleteFile as jest.Mock).mockReturnValueOnce(undefined)

      await cut.process(file, ['deu'], true)

      expect(mockTesseractService.process).toHaveBeenCalledWith('https://something/test/file3.cool.png', ['deu'])
      expect(OCA.Files.App.fileList.getDownloadUrl).toHaveBeenCalledWith(file.name)
      expect(mockOcaService.getCurrentDirectory).toHaveBeenCalledWith()
      expect(mockOcaService.putFileContents).toHaveBeenCalledWith('/test/file3.cool.pdf', pdf)
      expect(mockOcaService.deleteFile).toHaveBeenCalledWith(file.name)
    })
  })

  describe('fileActionHandler()', () => {
    it('GIVEN selected file is valid, WHEN fileActionHandler is called with valid context, THEN returns and commits corresponding store mutations.', () => {
      (Util.filterFilesWithMimeTypes as jest.Mock).mockReturnValueOnce([FileFixtures.PNG]);
      (OCA.Ocr.store.commit as jest.Mock).mockReturnValue(undefined)

      cut.fileActionHandler('anything', { fileInfoModel: { attributes: FileFixtures.PNG } })

      expect(Util.filterFilesWithMimeTypes).toHaveBeenCalledWith([FileFixtures.PNG])
      expect(OCA.Ocr.store.commit).toHaveBeenCalledWith(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG] })
      expect(OCA.Ocr.store.commit).toHaveBeenCalledWith(SHOW_MODAL)
    })

    it('GIVEN selected file is invalid, WHEN fileActionHandler is called with valid context, THEN returns and displays corresponding error.', () => {
      (Util.filterFilesWithMimeTypes as jest.Mock).mockReturnValueOnce([]);
      (NextcloudGuiApiService.displayError as jest.Mock).mockReturnValueOnce(undefined)

      cut.fileActionHandler('anything', { fileInfoModel: { attributes: FileFixtures.WRONG_MIME } })

      expect(Util.filterFilesWithMimeTypes).toHaveBeenCalledWith([FileFixtures.WRONG_MIME])
      expect(OCA.Ocr.store.commit).not.toHaveBeenCalled()
      expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('OCR processing failed: MIME type not supported.')
    })
  })

  describe('selectedFilesActionHandler()', () => {
    it('GIVEN selected files are valid, WHEN selectedFilesActionHandler is called, THEN returns and multi select menu items are registered and commits corresponding store mutations.', () => {
      (Util.filterFilesWithMimeTypes as jest.Mock).mockReturnValueOnce([FileFixtures.PNG, FileFixtures.BMP]);
      (OCA.Files.App.fileList.getSelectedFiles as jest.Mock).mockReturnValueOnce([FileFixtures.PNG, FileFixtures.BMP, FileFixtures.WRONG_MIME]);
      (mockOcaService.registerMultiSelectMenuItem as jest.Mock).mockReturnValueOnce(undefined);
      (OCA.Ocr.store.commit as jest.Mock).mockReturnValue(undefined)

      cut.selectedFilesActionHandler()

      expect(Util.filterFilesWithMimeTypes).toHaveBeenCalledWith([FileFixtures.PNG, FileFixtures.BMP, FileFixtures.WRONG_MIME])
      expect(OCA.Ocr.store.commit).toHaveBeenCalledWith(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG, FileFixtures.BMP] })
      expect(OCA.Files.App.fileList.getSelectedFiles).toHaveBeenCalledWith()
      expect(mockOcaService.registerMultiSelectMenuItem).toHaveBeenCalledWith(expect.anything())
      expect(OCA.Ocr.store.commit).not.toHaveBeenCalledWith(SHOW_MODAL);
      (mockOcaService.registerMultiSelectMenuItem as jest.Mock).mock.calls[0][0]()
      expect(OCA.Ocr.store.commit).toHaveBeenCalledWith(SHOW_MODAL)
    })

    it('GIVEN selected files are empty, WHEN selectedFilesActionHandler is called, THEN returns and multi select menu items are unregistered and commits corresponding store mutations.', () => {
      (Util.filterFilesWithMimeTypes as jest.Mock).mockReturnValueOnce([]);
      (OCA.Files.App.fileList.getSelectedFiles as jest.Mock).mockReturnValueOnce([FileFixtures.WRONG_MIME]);
      (mockOcaService.unregisterMultiSelectMenuItem as jest.Mock).mockReturnValueOnce(undefined);
      (OCA.Ocr.store.commit as jest.Mock).mockReturnValue(undefined)

      cut.selectedFilesActionHandler()

      expect(Util.filterFilesWithMimeTypes).toHaveBeenCalledWith([FileFixtures.WRONG_MIME])
      expect(OCA.Ocr.store.commit).toHaveBeenCalledWith(CLEAR_SELECTED_FILES)
      expect(OCA.Files.App.fileList.getSelectedFiles).toHaveBeenCalledWith()
      expect(mockOcaService.unregisterMultiSelectMenuItem).toHaveBeenCalledWith()
    })
  })
})
