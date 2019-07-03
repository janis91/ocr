import { OcrError } from './ocr.error';

export class TesseractError extends OcrError {
    constructor(message: string, public urlOrCanvas: string | HTMLCanvasElement, original?: Error | any) {
        super(message, original);
    }
}
