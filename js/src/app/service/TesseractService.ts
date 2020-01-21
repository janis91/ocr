import { Util } from '../util/Util';
import { TesseractError } from './error/TesseractError';
import { Configuration } from '../configuration/Configuration';
// FIXME: Karma typescript error: cannot read spread operator in the tesseract.js package. therefore using <any> for now. Consider changing App.ts and tests as well.
// import Tesseract from 'tesseract.js';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class TesseractService {

    private static LANG_PATH: string = 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast';
    private static CORE_PATH: string = window.navigator.userAgent.indexOf('Edge') > -1
        ? '/vendor/tesseract.js/tesseract-core.asm.js' : '/vendor/tesseract.js/tesseract-core.wasm.js'; // can be directed to wasm file directly in the future hopefully
    private static WORKER_PATH: string = '/vendor/tesseract.js/worker.min.js';

    private tesseractWorkerOptions: Partial<any>;

    public static checkTesseractAvailability: () => boolean = () => {
        const isAvailable = Util.isDefinedIn;
        return isAvailable('Tesseract', window) &&
            [...document.querySelectorAll('script')].find(script => script.src.includes(TesseractService.WORKER_PATH)) !== undefined;
    }

    constructor(private document: Document, private tesseract: any) {
        const workerSrc = [...this.document.querySelectorAll('script')].find(script => script.src.includes(TesseractService.WORKER_PATH)).src;
        const prefix = workerSrc.slice(0, workerSrc.indexOf(TesseractService.WORKER_PATH));
        this.tesseractWorkerOptions = {
            corePath: prefix + TesseractService.CORE_PATH,
            langPath: TesseractService.LANG_PATH,
            workerPath: prefix + TesseractService.WORKER_PATH,
        };
    }

    public process: (urlOrCanvas: string | HTMLCanvasElement, languages: Array<string>) => Promise<Uint8Array> = async (urlOrCanvas, languages) => {
        try {
            const worker = this.tesseract.createWorker(this.tesseractWorkerOptions);
            await worker.load();
            await worker.loadLanguage(languages.join('+'));
            await worker.initialize(languages.join('+'));
            await worker.setParameters({
                tessedit_ocr_engine_mode: this.tesseract.OEM.LSTM_ONLY,
            });
            await worker.recognize(urlOrCanvas);
            const { data } = await (worker as any).getPDF();
            await worker.terminate();
            return new Uint8Array(data);
        } catch (e) {
            throw new TesseractError(Configuration.TRANSLATION_UNEXPECTED_ERROR_TESSERACT_PROCESSING, urlOrCanvas, e);
        }
    }
}
