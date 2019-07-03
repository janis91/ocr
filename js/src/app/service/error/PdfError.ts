import { OcrError } from './OcrError';

export class PdfError extends OcrError {
    constructor(message: string, original?: Error | any) {
        super(message, original);
    }
}
