import { PdfService } from '../../../src/app/service/pdf.service';
import { PDFJSStatic, PDFDocumentProxy, PDFPromise, PDFPageProxy, PDFPageViewport } from 'pdfjs-dist';
import { PDFDocumentFactory, PDFDocumentWriter } from 'pdf-lib';

describe("The pdfService's", () => {

    let pdfJsMock: jasmine.SpyObj<PDFJSStatic>;
    let pdfLibMock: jasmine.SpyObj<{ PDFDocumentFactory: PDFDocumentFactory, PDFDocumentWriter: PDFDocumentWriter }>;
    let documentMock: jasmine.SpyObj<Document>;
    let cut: PdfService;

    beforeEach(async () => {
        pdfJsMock = jasmine.createSpyObj('PDFJS', ['getDocument']);
        pdfLibMock = {
            PDFDocumentFactory: jasmine.createSpyObj('PDFDocumentFactory', ['load']),
            PDFDocumentWriter: jasmine.createSpyObj('PDFDocumentWriter', ['saveToBytes']),
        };
        documentMock = jasmine.createSpyObj('document', ['createElement']);
        cut = new (await import('../../../src/app/service/pdf.service')).PdfService(pdfJsMock, pdfLibMock, documentMock);
    });

    describe('getDocumentPagesAsImages function', () => {
        it('should return single pdf page as canvas element in array, given a url.', async () => {
            const page: jasmine.SpyObj<PDFPageProxy> = jasmine.createSpyObj('pdfPageProxy', ['getViewport', 'render']);
            const viewport = { height: 1, width: 2 } as PDFPageViewport;
            const canvas: jasmine.SpyObj<HTMLCanvasElement> = jasmine.createSpyObj('canvas', ['getContext']);
            const canvasContext = {} as CanvasRenderingContext2D;
            const pdfDocumentProxy: jasmine.SpyObj<PDFDocumentProxy> = jasmine.createSpyObj('pdfDocumentProxy', ['getPage']);
            pdfDocumentProxy.numPages = 1;
            pdfJsMock.getDocument.and.returnValue(Promise.resolve(pdfDocumentProxy) as any);
            pdfDocumentProxy.getPage.withArgs(1).and.returnValue(Promise.resolve(page) as any);
            page.getViewport.and.returnValue(viewport);
            documentMock.createElement.and.returnValue(canvas);
            canvas.getContext.and.returnValue(canvasContext);
            page.render.and.returnValue(Promise.resolve(undefined) as any);

            const result = cut.getDocumentPagesAsImages('url');

            await expectAsync(result).toBeResolvedTo([canvas]);
            expect(pdfJsMock.getDocument).toHaveBeenCalledWith('url');
            expect(pdfDocumentProxy.getPage).toHaveBeenCalledWith(1);
            expect(page.getViewport).toHaveBeenCalledWith(1.5);
            expect(documentMock.createElement).toHaveBeenCalledWith('canvas');
            expect(canvas.getContext).toHaveBeenCalledWith('2d');
            expect(canvas.height).toEqual(1);
            expect(canvas.width).toEqual(2);
            expect(page.render).toHaveBeenCalledWith({ canvasContext, viewport });
        });

        it('should return two pdf pages as individual canvas elements in array, given a url.', async () => {
            const page1: jasmine.SpyObj<PDFPageProxy> = jasmine.createSpyObj('pdfPageProxy1', ['getViewport', 'render']);
            const page2: jasmine.SpyObj<PDFPageProxy> = jasmine.createSpyObj('pdfPageProxy2', ['getViewport', 'render']);
            const viewport1 = { height: 2, width: 1 } as PDFPageViewport;
            const viewport2 = { height: 1, width: 2 } as PDFPageViewport;
            const canvas1: jasmine.SpyObj<HTMLCanvasElement> = jasmine.createSpyObj('canvas', ['getContext']);
            const canvas2: jasmine.SpyObj<HTMLCanvasElement> = jasmine.createSpyObj('canvas', ['getContext']);
            const canvasContext1 = {} as CanvasRenderingContext2D;
            const canvasContext2 = {} as CanvasRenderingContext2D;
            const pdfDocumentProxy: jasmine.SpyObj<PDFDocumentProxy> = jasmine.createSpyObj('pdfDocumentProxy', ['getPage']);
            pdfDocumentProxy.numPages = 2;
            pdfJsMock.getDocument.and.returnValue(Promise.resolve(pdfDocumentProxy) as any);
            pdfDocumentProxy.getPage.withArgs(1).and.returnValue(Promise.resolve(page1) as any);
            pdfDocumentProxy.getPage.withArgs(2).and.returnValue(Promise.resolve(page2) as any);
            page1.getViewport.and.returnValue(viewport1);
            page2.getViewport.and.returnValue(viewport2);
            documentMock.createElement.and.returnValues(canvas1, canvas2);
            canvas1.getContext.and.returnValue(canvasContext1);
            canvas2.getContext.and.returnValue(canvasContext2);
            page1.render.and.returnValue(Promise.resolve(undefined) as any);
            page2.render.and.returnValue(Promise.resolve(undefined) as any);

            const result = cut.getDocumentPagesAsImages('url');

            await expectAsync(result).toBeResolvedTo([canvas1, canvas2]);
            expect(pdfJsMock.getDocument).toHaveBeenCalledWith('url');
            expect(pdfDocumentProxy.getPage.calls.argsFor(0)).toEqual([1]);
            expect(pdfDocumentProxy.getPage.calls.argsFor(1)).toEqual([2]);
            expect(page1.getViewport).toHaveBeenCalledWith(1.5);
            expect(page2.getViewport).toHaveBeenCalledWith(1.5);
            expect(documentMock.createElement.calls.argsFor(0)).toEqual(['canvas']);
            expect(documentMock.createElement.calls.argsFor(1)).toEqual(['canvas']);
            expect(canvas1.getContext).toHaveBeenCalledWith('2d');
            expect(canvas2.getContext).toHaveBeenCalledWith('2d');
            expect(canvas1.height).toEqual(2);
            expect(canvas1.width).toEqual(1);
            expect(canvas2.height).toEqual(1);
            expect(canvas2.width).toEqual(2);
            expect(page1.render).toHaveBeenCalledWith({ canvasContext: canvasContext1, viewport: viewport1 });
            expect(page2.render).toHaveBeenCalledWith({ canvasContext: canvasContext2, viewport: viewport2 });
        });

        it('should throw an Error, given invalid url.', async () => {
            const pdfDocumentProxy: jasmine.SpyObj<PDFDocumentProxy> = jasmine.createSpyObj('pdfDocumentProxy', ['getPage']);
            pdfDocumentProxy.numPages = 0;
            pdfJsMock.getDocument.and.returnValue(Promise.resolve(pdfDocumentProxy) as any);

            const result = cut.getDocumentPagesAsImages('url');

            await expectAsync(result).toBeRejectedWith(new Error('PDF does not contain any Pages.'));
            expect(pdfJsMock.getDocument).toHaveBeenCalledWith('url');
        });

        it('should throw an Error, when getDocument fails, given valid url.', async () => {
            const e = new Error('test');
            pdfJsMock.getDocument.and.returnValue(Promise.reject(e) as any);

            const result = cut.getDocumentPagesAsImages('url');

            await expectAsync(result).toBeRejectedWith(e);
            expect(pdfJsMock.getDocument).toHaveBeenCalledWith('url');
        });
    });

    describe('createPdfFromBuffers function', () => {
        it('should return a combined pdf, given one single page pdf in array.', () => {
            const input = new Uint8Array(1);
            const output = new Uint8Array(1);
            const pdfDoc = jasmine.createSpyObj('pdfDocument', ['addPage', 'getPages']);
            (pdfLibMock.PDFDocumentFactory as any).load.and.returnValue(pdfDoc);
            (pdfLibMock.PDFDocumentWriter as any).saveToBytes.and.returnValue(output);

            const result = cut.createPdfFromBuffers([input]);

            expect(result).toEqual(output);
            expect((pdfLibMock.PDFDocumentFactory as any).load).toHaveBeenCalledWith(input);
            expect((pdfLibMock.PDFDocumentWriter as any).saveToBytes).toHaveBeenCalledWith(pdfDoc);
        });

        it('should return a combined pdf, given two single page pdfs in array.', () => {
            const input1 = new Uint8Array(1);
            const input2 = new Uint8Array(2);
            const output = new Uint8Array(3);
            const page2 = {};
            const pdfDoc1 = jasmine.createSpyObj('pdfDocument1', ['addPage']);
            const pdfDoc2 = jasmine.createSpyObj('pdfDocument2', ['getPages']);
            (pdfLibMock.PDFDocumentFactory as any).load.withArgs(input1).and.returnValue(pdfDoc1);
            (pdfLibMock.PDFDocumentFactory as any).load.withArgs(input2).and.returnValue(pdfDoc2);
            pdfDoc1.addPage.and.returnValue(pdfDoc1);
            pdfDoc2.getPages.and.returnValue([page2]);
            (pdfLibMock.PDFDocumentWriter as any).saveToBytes.and.returnValue(output);

            const result = cut.createPdfFromBuffers([input1, input2]);

            expect(result).toEqual(output);
            expect((pdfLibMock.PDFDocumentFactory as any).load.calls.argsFor(0)).toEqual([input1]);
            expect((pdfLibMock.PDFDocumentFactory as any).load.calls.argsFor(1)).toEqual([input2]);
            expect(pdfDoc1.addPage).toHaveBeenCalledWith(page2);
            expect(pdfDoc2.getPages).toHaveBeenCalled();
            expect((pdfLibMock.PDFDocumentWriter as any).saveToBytes).toHaveBeenCalledWith(pdfDoc1);
        });
    });
});
