import { IJob } from '../../poto/job.poto';
import { IFinishedJob, FinishedJob } from '../../poto/finished-job.poto';
import { ITransformer } from './transformer';

export class JobToFinishedJobTf implements ITransformer {

    public transform(job: IJob): IFinishedJob {
        const finishedJob: IFinishedJob = new FinishedJob();
        finishedJob.id = job.id;
        finishedJob.error = false;
        finishedJob.log = '';
        return finishedJob;
    }
}
