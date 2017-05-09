import { TransformerException } from './transformer.exception';
import { JobToFinishedJobTf } from './job-to-finished-job.tf';
import { Job } from '../../poto/job.poto';
import { JobType } from '../../poto/job-type.enum';

describe('The job to finished job transformer', () => {
    let cut: JobToFinishedJobTf;

    beforeEach(() => {
        cut = new JobToFinishedJobTf();
    });

    it('should transform the job to a finished job correctly', () => {
        const job = new Job();
        job.id = 1;
        job.languages = ['deu'];
        job.source = 'source';
        job.tempFile = 'tempFile';
        job.type = JobType.OCRMYPDF;

        const result = cut.transform(job);

        expect(result.id).toBe(1);
        expect(result.error).toBe(false);
        expect(result.log).toBe('');
    });
});
