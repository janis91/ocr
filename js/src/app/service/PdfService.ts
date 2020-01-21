import { Util } from '../util/Util';
import { PDFJSStatic } from 'pdfjs-dist';
import { PDFDocumentFactory, PDFDocument, PDFDocumentWriter } from 'pdf-lib';
import { PdfError } from './error/PdfError';
import { Configuration } from '../configuration/Configuration';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class PdfService {

    public static checkPdfUtilAvailability: () => boolean = () => {
        const isAvailable = Util.isDefinedIn;
        const win = window as any;
        return isAvailable('PDFJS', window) && isAvailable('PDFLib', window) && isAvailable('PDFDocumentFactory', win.PDFLib) && isAvailable('PDFDocumentWriter', win.PDFLib);
    }

    constructor(private pdfjs: PDFJSStatic, private pdfLib: { PDFDocumentFactory: PDFDocumentFactory, PDFDocumentWriter: PDFDocumentWriter }, private document: Document) {
        this.pdfjs.isEvalSupported = false;
        this.pdfjs.disableWorker = true;
    }

    public getDocumentPagesAsScaledImages: (url: string) => Promise<HTMLCanvasElement[]> = async (url) => {
        try {
            const pdf = await this.pdfjs.getDocument(url);
            if (pdf.numPages === 0) { throw new PdfError(Configuration.TRANSLATION_PDF_DOESNT_CONTAIN_PAGES); }
            const canvass = [...Array(pdf.numPages + 1).keys()].slice(1).map(async (i) => {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport(3 / 0.72); // needed for exact the same page size and a good dpi for tesseract.
                const canvas = this.document.createElement('canvas');
                const canvasContext = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext, viewport });
                return canvas;
            });
            return await Promise.all(canvass);
        } catch (e) {
            if (e instanceof PdfError) { throw e; }
            throw new PdfError(Configuration.TRANSLATION_UNEXPECTED_ERROR_PDF_PROCESSING, e);
        }
    }

    public createPdfFromBuffers: (buffers: Uint8Array[]) => Uint8Array = (buffers) => {
        try {
            const pdfs: PDFDocument[] = buffers.map((buffer) => (this.pdfLib.PDFDocumentFactory as any).load(buffer));
            const pdf = pdfs.reduce((prev, curr) => {
                if (prev === undefined) {
                    return curr;
                } else {
                    return prev.addPage(curr.getPages()[0]);
                }
            }, undefined);
            return (this.pdfLib.PDFDocumentWriter as any).saveToBytes(pdf);
        } catch (e) {
            throw new PdfError(Configuration.TRANSLATION_UNEXPECTED_ERROR_PDF_PROCESSING, e);
        }
    }
}
