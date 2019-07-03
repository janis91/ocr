import { OcrError } from './OcrError';

export class TesseractError extends OcrError {
    constructor(message: string, public urlOrCanvas: string | HTMLCanvasElement, original?: Error | any) {
        super(message, original);
    }
}
