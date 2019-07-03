import { OcrError } from './OcrError';

export class OcaError extends OcrError {
    constructor(message: string, original?: Error | any) {
        super(message, original);
    }
}
