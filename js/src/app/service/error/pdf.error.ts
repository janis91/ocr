import { OcrError } from './ocr.error';

export class PdfError extends OcrError {
    constructor(message: string, original?: Error | any) {
        super(message, original);
    }
}
