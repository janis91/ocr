import { Util } from '../util/Util';
import { OCSingleTranslation } from '../../global-oc-types';
import { TesseractError } from './error/TesseractError';
import { Configuration } from '../configuration/Configuration';

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

type TesseractWorkerOptions = { corePath: string, langPath: string, workerPath: string };
type TesseractProgressCallback = ({ status, progress }: { status: string, progress: number }) => void;

interface TesseractWorkerPromise extends Promise<any> {
    progress: (callback: TesseractProgressCallback) => TesseractWorkerPromise;
}

interface TesseractRecognizeOptions {
    [opts: string]: any;
}

interface TesseractWorker {
    options: TesseractWorkerOptions;
    recognize: (imageUrlOrCanvas: string | HTMLCanvasElement, languagesJoinedByPlus: string, options: TesseractRecognizeOptions) => TesseractWorkerPromise;
    terminate: () => void;
    new(options: TesseractWorkerOptions): TesseractWorker;
}

declare var Tesseract: { TesseractWorker: TesseractWorker };

export class TesseractService {

    private static LANG_PATH: string = 'https://raw.githubusercontent.com/janis91/tessdata/fcc04f158939977d1e04922b808add72c003d407/4.0.0_fast';
    private static CORE_PATH: string = '/vendor/tesseract.js/tesseract-core.wasm.js'; // can be directed to wasm file directly in the future hopefully
    private static WORKER_PATH: string = '/vendor/tesseract.js/worker.min.js';

    public tesseractWorkers: Array<TesseractWorker> = [];
    private roundRobinIndex: number = 0;

    public static checkTesseractAvailability: () => boolean = () => {
        const isAvailable = Util.isDefinedIn;
        return isAvailable('Tesseract', window) && isAvailable('TesseractWorker', (window as any).Tesseract) &&
            [...document.querySelectorAll('script')].find(script => script.src.includes(TesseractService.WORKER_PATH)) !== undefined;
    }

    constructor(private document: Document) {
        const webWorkerCount = navigator.hardwareConcurrency || 4;
        const workerSrc = [...this.document.querySelectorAll('script')].find(script => script.src.includes(TesseractService.WORKER_PATH)).src;
        const prefix = workerSrc.slice(0, workerSrc.indexOf(TesseractService.WORKER_PATH));
        const tesseractWorkerOptions: TesseractWorkerOptions = {
            corePath: prefix + TesseractService.CORE_PATH,
            langPath: TesseractService.LANG_PATH,
            workerPath: prefix + TesseractService.WORKER_PATH,
        };
        for (let i = 0; i < webWorkerCount; i++) {
            this.tesseractWorkers.push(new Tesseract.TesseractWorker(tesseractWorkerOptions));
        }
    }

    public process: (urlOrCanvas: string | HTMLCanvasElement, languages: Array<string>) => Promise<ArrayBuffer> = async (urlOrCanvas, languages) => {
        try {
            const worker = this.getNextTesseractWorker();
            const buff: ArrayBuffer = await new Promise((resolve, reject) => {
                worker
                    .recognize(
                        urlOrCanvas,
                        languages.join('+'),
                        {
                            'tessjs_create_pdf': '1',
                            'tessjs_pdf_auto_download': false, // disable auto download
                            'tessjs_pdf_bin': true, // create pdf as result
                        },
                    )
                    .then((result: any) => {
                        resolve(result.files.pdf);
                    })
                    .catch((err: any) => reject(err));
            });
            worker.terminate();
            return buff;
        } catch (e) {
            throw new TesseractError(Configuration.TRANSLATION_UNEXPECTED_ERROR_TESSERACT_PROCESSING, urlOrCanvas, e);
        }
    }

    public getNextTesseractWorker: () => TesseractWorker = () => {
        const worker = this.tesseractWorkers[this.roundRobinIndex];
        if (this.roundRobinIndex === this.tesseractWorkers.length - 1) {
            this.roundRobinIndex = 0;
        } else {
            this.roundRobinIndex++;
        }
        return worker;
    }

    public resetRoundRobinIndex: () => void = () => {
        this.roundRobinIndex = 0;
    }
}
