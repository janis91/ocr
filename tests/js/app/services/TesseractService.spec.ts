import '../../GlobalMocks.mock'
import { TesseractService } from '@a/services/TesseractService'
import { generateFilePath, generateUrl } from '@nextcloud/router'
import Tesseract from 'tesseract.js'
import { TesseractError } from '@a/error/TesseractError'

jest.mock('@nextcloud/router')
jest.mock('tesseract.js')

Object.defineProperty(window, 'navigator', {
  writable: true,
  value: {
    userAgent: 'SomethingElse'
  }
})

describe('TesseractService', () => {
  let cut: TesseractService

  beforeEach(() => {
    (generateFilePath as jest.Mock).mockReturnValueOnce('vendor/tesseract.js/tesseract-core.wasm.js')
      .mockReturnValueOnce('vendor/tesseract.js/worker.min.js');
    (generateUrl as jest.Mock).mockReturnValueOnce('/apps/ocr/tessdata')
    cut = new TesseractService()
  })

  afterEach(() => {
    expect(generateFilePath).toHaveBeenCalledTimes(2)
    expect(generateFilePath).toHaveBeenCalledWith('ocr', '', 'vendor/tesseract.js/tesseract-core.wasm.js')
    expect(generateFilePath).toHaveBeenCalledWith('ocr', '', 'vendor/tesseract.js/worker.min.js')
    expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/tessdata')
    jest.clearAllMocks()
  })

  describe('process()', () => {
    it('GIVEN tesseract worker successfully processes, WHEN process is called with a valid url AND one language, THEN resolves with ArrayBuffer.', async () => {
      const pdf = { data: [] }
      const worker = {
        load: jest.fn().mockResolvedValueOnce(undefined),
        loadLanguage: jest.fn().mockResolvedValueOnce(undefined),
        initialize: jest.fn().mockResolvedValueOnce(undefined),
        setParameters: jest.fn().mockResolvedValueOnce(undefined),
        recognize: jest.fn().mockResolvedValueOnce(undefined),
        getPDF: jest.fn().mockResolvedValueOnce(pdf),
        terminate: jest.fn().mockResolvedValueOnce(undefined)
      };
      (Tesseract.createWorker as jest.Mock).mockReturnValueOnce(worker)

      const promise = cut.process('https://something.de/test.pdf', ['deu'])

      await expect(promise).resolves.toEqual(new Uint8Array(pdf.data))
      expect(Tesseract.createWorker).toHaveBeenCalledWith({
        corePath: 'vendor/tesseract.js/tesseract-core.wasm.js',
        langPath: '/apps/ocr/tessdata',
        workerPath: 'vendor/tesseract.js/worker.min.js'
      })
      expect(worker.load).toHaveBeenCalledWith()
      expect(worker.loadLanguage).toHaveBeenCalledWith('deu')
      expect(worker.initialize).toHaveBeenCalledWith('deu')
      expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 })
      expect(worker.recognize).toHaveBeenCalledWith('https://something.de/test.pdf')
      expect(worker.getPDF).toHaveBeenCalledWith()
      expect(worker.terminate).toHaveBeenCalledWith()
    })

    it('GIVEN tesseract worker successfully processes, WHEN process is called with a valid url AND no language, THEN resolves with ArrayBuffer, processed with english.', async () => {
      const pdf = { data: [] }
      const worker = {
        load: jest.fn().mockResolvedValueOnce(undefined),
        loadLanguage: jest.fn().mockResolvedValueOnce(undefined),
        initialize: jest.fn().mockResolvedValueOnce(undefined),
        setParameters: jest.fn().mockResolvedValueOnce(undefined),
        recognize: jest.fn().mockResolvedValueOnce(undefined),
        getPDF: jest.fn().mockResolvedValueOnce(pdf),
        terminate: jest.fn().mockResolvedValueOnce(undefined)
      };
      (Tesseract.createWorker as jest.Mock).mockReturnValueOnce(worker)

      const promise = cut.process('https://something.de/test.pdf', [])

      await expect(promise).resolves.toEqual(new Uint8Array(pdf.data))
      expect(Tesseract.createWorker).toHaveBeenCalledWith({
        corePath: 'vendor/tesseract.js/tesseract-core.wasm.js',
        langPath: '/apps/ocr/tessdata',
        workerPath: 'vendor/tesseract.js/worker.min.js'
      })
      expect(worker.load).toHaveBeenCalledWith()
      expect(worker.loadLanguage).toHaveBeenCalledWith('eng')
      expect(worker.initialize).toHaveBeenCalledWith('eng')
      expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 })
      expect(worker.recognize).toHaveBeenCalledWith('https://something.de/test.pdf')
      expect(worker.getPDF).toHaveBeenCalledWith()
      expect(worker.terminate).toHaveBeenCalledWith()
    })

    it('GIVEN tesseract worker successfully processes, WHEN process is called with a valid url AND two languages, THEN resolves with ArrayBuffer.', async () => {
      const pdf = { data: [] }
      const worker = {
        load: jest.fn().mockResolvedValueOnce(undefined),
        loadLanguage: jest.fn().mockResolvedValueOnce(undefined),
        initialize: jest.fn().mockResolvedValueOnce(undefined),
        setParameters: jest.fn().mockResolvedValueOnce(undefined),
        recognize: jest.fn().mockResolvedValueOnce(undefined),
        getPDF: jest.fn().mockResolvedValueOnce(pdf),
        terminate: jest.fn().mockResolvedValueOnce(undefined)
      };
      (Tesseract.createWorker as jest.Mock).mockReturnValueOnce(worker)

      const promise = cut.process('https://something.de/test.pdf', ['deu', 'spa'])

      await expect(promise).resolves.toEqual(new Uint8Array(pdf.data))
      expect(Tesseract.createWorker).toHaveBeenCalledWith({
        corePath: 'vendor/tesseract.js/tesseract-core.wasm.js',
        langPath: '/apps/ocr/tessdata',
        workerPath: 'vendor/tesseract.js/worker.min.js'
      })
      expect(worker.load).toHaveBeenCalledWith()
      expect(worker.loadLanguage).toHaveBeenCalledWith('deu+spa')
      expect(worker.initialize).toHaveBeenCalledWith('deu+spa')
      expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 })
      expect(worker.recognize).toHaveBeenCalledWith('https://something.de/test.pdf')
      expect(worker.getPDF).toHaveBeenCalledWith()
      expect(worker.terminate).toHaveBeenCalledWith()
    })

    it('GIVEN tesseract worker rejects, WHEN process is called with a valid url AND two languages, THEN rejects corresponding error.', async () => {
      const e = new Error('test')
      const worker = {
        load: jest.fn().mockResolvedValueOnce(undefined),
        loadLanguage: jest.fn().mockResolvedValueOnce(undefined),
        initialize: jest.fn().mockResolvedValueOnce(undefined),
        setParameters: jest.fn().mockResolvedValueOnce(undefined),
        recognize: jest.fn().mockRejectedValueOnce(e),
        terminate: jest.fn().mockResolvedValueOnce(undefined)
      };
      (Tesseract.createWorker as jest.Mock).mockReturnValueOnce(worker)

      const promise = cut.process('https://something.de/test.pdf', ['deu', 'spa'])

      await expect(promise).rejects.toThrow(new TesseractError('An unexpected error occured during Tesseract processing.', e))
      expect(Tesseract.createWorker).toHaveBeenCalledWith({
        corePath: 'vendor/tesseract.js/tesseract-core.wasm.js',
        langPath: '/apps/ocr/tessdata',
        workerPath: 'vendor/tesseract.js/worker.min.js'
      })
      expect(worker.load).toHaveBeenCalledWith()
      expect(worker.loadLanguage).toHaveBeenCalledWith('deu+spa')
      expect(worker.initialize).toHaveBeenCalledWith('deu+spa')
      expect(worker.setParameters).toHaveBeenCalledWith({ tessedit_ocr_engine_mode: 1 })
      expect(worker.recognize).toHaveBeenCalledWith('https://something.de/test.pdf')
      expect(worker.terminate).toHaveBeenCalledWith()
    })
  })
})
