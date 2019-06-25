import { OcaService } from './oca.service';
import { OCAFile } from '../../global-oc-types';
import { Util } from '../util/util';

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
    recognize: (imageUrl: string, languagesJoinedByPlus: string, options: TesseractRecognizeOptions) => TesseractWorkerPromise;
    new(options: TesseractWorkerOptions): TesseractWorker;
}

declare var Tesseract: { TesseractWorker: TesseractWorker };

export class TesseractService {

    private static TESSERACT_WORKER_CONFIG: TesseractWorkerOptions = {
        corePath: '/apps/ocr/vendor/tesseract.js/tesseract-core.wasm.js',
        langPath: '/apps/ocr/tessdata/4.0.0',
        workerPath: '/apps/ocr/vendor/tesseract.js/worker.min.js',
    };

    public tesseractWorkers: Array<TesseractWorker> = [];
    private roundRobinIndex: number = 0;

    public static checkTesseractAvailability: () => boolean = () => {
        const isAvailable = Util.isDefinedIn;
        return isAvailable('Tesseract', window) && isAvailable('TesseractWorker', (window as any).Tesseract);
    }

    constructor(private ocaService: OcaService) {
        const webWorkerCount = navigator.hardwareConcurrency || 4;
        for (let i = 0; i < webWorkerCount; i++) {
            this.tesseractWorkers.push(new Tesseract.TesseractWorker(TesseractService.TESSERACT_WORKER_CONFIG));
        }
    }

    public process: (file: OCAFile, languages: Array<string>) => Promise<object> = async (file, languages) => {
        return await new Promise((resolve, reject) => {
            this.getNextTesseractWorker()
                .recognize(
                    this.ocaService.getDownloadUrl(file),
                    languages.join('+'),
                    {
                        'pdf_auto_download': false, // disable auto download
                        'pdf_bin': true,            // return pdf in binary format
                        'tessedit_create_pdf': '1', // create pdf as result
                    },
                )
                .then((result: any) => resolve(result.files.pdf))
                .catch((err: any) => reject(err));
        });
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
}
