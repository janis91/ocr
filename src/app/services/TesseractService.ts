import { TesseractError } from '@a/error/TesseractError'
import { Translations } from '@a/configuration/Translations'
import { generateUrl, generateFilePath } from '@nextcloud/router'
import { WorkerOptions } from 'tesseract.js'

export class TesseractService {
    private static LANG_PATH: string = '/apps/ocr/tessdata';
    private static CORE_PATH: string = window.navigator.userAgent.indexOf('Edge') > -1
      ? 'vendor/tesseract.js/tesseract-core.asm.js' : 'vendor/tesseract.js/tesseract-core.wasm.js'; // can be directed to wasm file directly in the future hopefully
    private static WORKER_PATH: string = 'vendor/tesseract.js/worker.min.js';

    private tesseractWorkerOptions: Partial<WorkerOptions>;

    constructor() {
      this.tesseractWorkerOptions = {
        corePath: generateFilePath('ocr', '', TesseractService.CORE_PATH),
        langPath: generateUrl(TesseractService.LANG_PATH),
        workerPath: generateFilePath('ocr', '', TesseractService.WORKER_PATH)
      }
    }

    public process: (url: string, languages: Array<string>) => Promise<Uint8Array> = async (url, languages) => {
      const langs = (languages.length > 0 ? languages : ['eng']).join('+')
      const tesseract = await import('tesseract.js')
      const worker = tesseract.createWorker(this.tesseractWorkerOptions)
      try {
        await worker.load()
        await worker.loadLanguage(langs)
        await worker.initialize(langs)
        await worker.setParameters({
          tessedit_ocr_engine_mode: tesseract.OEM.LSTM_ONLY
        })
        await worker.recognize(url)
        const { data } = await (worker as any).getPDF()
        await worker.terminate()
        return new Uint8Array(data)
      } catch (e) {
        await worker.terminate()
        throw new TesseractError(Translations.TRANSLATION_UNEXPECTED_ERROR_TESSERACT_PROCESSING, e)
      }
    }
}
