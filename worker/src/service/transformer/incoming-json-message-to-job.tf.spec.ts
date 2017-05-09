import { TransformerException } from './transformer.exception';
import { IncomingJsonMessageToJobTf } from './incoming-json-message-to-job.tf';

describe('The incoming json message to job transformer', () => {
    let cut: IncomingJsonMessageToJobTf;

    beforeEach(() => {
        cut = new IncomingJsonMessageToJobTf();
    });

    it('should transform the incoming json message correctly', () => {
        const jsonMessage = '{"id":3,"type":0,"source":"admin\/files\/gif.gif","tempFile":"\/tmp\/ocr_Uk3THS.txt","languages":["deu"]}';

        const result = cut.transform(jsonMessage);

        expect(result.id).toBe(3);
        expect(result.type).toBe(0);
        expect(result.source).toBe('admin/files/gif.gif');
        expect(result.tempFile).toBe('ocr_Uk3THS.txt');
        expect(result.languages[0]).toBe('deu');
    });

    it('should throw an error for empty string', () => {
        const jsonMessage = '';

        expect(
            () => { cut.transform(jsonMessage); },
        ).toThrow(new TransformerException('The message had no content.'));
    });

    it('should throw an error for wrong json', () => {
        const jsonMessage = '["languages":["deu"]]';

        expect(
            () => { cut.transform(jsonMessage); },
        ).toThrow(new TransformerException('The message data was corrupt: SyntaxError: Unexpected token : in JSON at position 12'));
    });

    it('should throw an error for not an object', () => {
        const jsonMessage = '["deu"]';

        expect(
            () => { cut.transform(jsonMessage); },
        ).toThrow(new TransformerException('The message data was corrupt.'));
    });

    it('should throw an error for empty object', () => {
        const jsonMessage = '{"languages":["deu"]}';

        expect(
            () => { cut.transform(jsonMessage); },
        ).toThrow(new TransformerException('The following fields are not set: id, type, source, tempFile.'));
    });
});
