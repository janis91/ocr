import { IJob, Job } from '../../poto/job.poto';
import { JobType } from '../../poto/job-type.enum';
import { TransformerException } from './transformer.exception';
import { ITransformer } from './transformer';

export class IncomingJsonMessageToJobTf implements ITransformer {

    public transform(message: string): IJob {
        if (message.length > 1) {
            const job: IJob = new Job();
            const json: any = this.safelyParseJson(message);
            if (json && !Array.isArray(json) && typeof json === 'object') {
                const fieldsNotSet: Array<string> = new Array();
                typeof json.id === 'number' ? job.id = json.id : fieldsNotSet.push('id');
                typeof json.type === 'number' && (json.type === JobType.TESSERACT || json.type === JobType.OCRMYPDF) ? job.type = json.type : fieldsNotSet.push('type');
                typeof json.source === 'string' && json.source.length > 0 ? job.source = json.source : fieldsNotSet.push('source');
                typeof json.tempFile === 'string' && json.tempFile.length > 0 ? job.tempFile = json.tempFile : fieldsNotSet.push('tempFile');
                if (fieldsNotSet.length === 0) {
                    job.languages = json.languages;
                    job.tempFile = job.tempFile.replace(/^\/tmp\//, '');
                    return job;
                } else {
                    throw new TransformerException(`The following fields are not set: ${fieldsNotSet.join(', ')}.`);
                }
            } else {
                throw new TransformerException(`The message data was corrupt.`);
            }
        } else {
            throw new TransformerException('The message had no content.');
        }
    }

    private safelyParseJson(message: string): any {
        try {
            return JSON.parse(message);
        } catch (e) {
            throw new TransformerException(`The message data was corrupt: ${e}`);
        }
    }
}
