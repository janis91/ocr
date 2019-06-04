import { IFile } from '../controller/poto/file.poto';
import { OcaService } from './oca.service';

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

interface TesseractWorkerPromise {
    progress: (callback: TesseractProgressCallback) => Promise<any>;
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
    private _tesseractWorkers: Array<TesseractWorker>;
    private roundRobinIndex: number = 0;

    constructor(private ocaService: OcaService) {
        this.tesseractWorkers = [
            new Tesseract.TesseractWorker(TesseractService.TESSERACT_WORKER_CONFIG), new Tesseract.TesseractWorker(TesseractService.TESSERACT_WORKER_CONFIG),
            new Tesseract.TesseractWorker(TesseractService.TESSERACT_WORKER_CONFIG), new Tesseract.TesseractWorker(TesseractService.TESSERACT_WORKER_CONFIG),
        ];
    }

    public async process(file: IFile, languages: Array<string>, progressCallback: TesseractProgressCallback): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tesseractWorker
                .recognize(
                    this.ocaService.getDownloadUrl(file),
                    languages.join('+'),
                    {
                        'pdf_auto_download': false, // disable auto download
                        'pdf_bin': true,            // add pdf file bin array in result
                        'tessedit_create_pdf': '1',
                    },
                )
                .progress(progressCallback)
                .then((result: any) => resolve(result.files.pdf))
                .catch((err: any) => reject(err));
        });
    }

    public get tesseractWorker(): TesseractWorker {
        const worker = this._tesseractWorkers[this.roundRobinIndex];
        if (this.roundRobinIndex === this._tesseractWorkers.length - 1) {
            this.roundRobinIndex = 0;
        } else {
            this.roundRobinIndex++;
        }
        return worker;
    }

    public set tesseractWorkers(v: Array<TesseractWorker>) {
        this._tesseractWorkers = v;
    }
}
