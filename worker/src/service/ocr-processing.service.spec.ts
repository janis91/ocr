import { ServiceException } from './service.exception';
import { Configuration } from '../configuration/worker.configuration';
import { Job } from '../poto/job.poto';
import { FinishedJob } from '../poto/finished-job.poto';
import { JobType } from '../poto/job-type.enum';
import { OcrProcessingService } from './ocr-processing.service';

describe('For the ocr processing service', () => {
    let cut: OcrProcessingService;
    let loggerMock: any;
    let incomingJsonMessageToJobTfMock: any;
    let jobToFinishedJobTfMock: any;
    let redisClientMock: any;
    let spawnSyncMock: any;
    let unlinkSyncMock: any;

    beforeEach(() => {
        loggerMock = jasmine.createSpyObj('logger', ['debug', 'error']);
        incomingJsonMessageToJobTfMock = jasmine.createSpyObj('incomingJsonMessageToJobTf', ['transform']);
        jobToFinishedJobTfMock = jasmine.createSpyObj('jobToFinishedJobTf', ['transform']);
        redisClientMock = jasmine.createSpyObj('redisClient', ['lpush']);
        spawnSyncMock = jasmine.createSpy('spawnSync');
        unlinkSyncMock = jasmine.createSpy('unlinkSync');
        cut = new OcrProcessingService(loggerMock, incomingJsonMessageToJobTfMock, unlinkSyncMock, jobToFinishedJobTfMock, redisClientMock, spawnSyncMock);
    });

    describe('the process function', () => {
        it('should process the job of type tesseract.', () => {
            const jobMessage = 'this is a valid job message';
            const job = new Job();
            job.type = JobType.TESSERACT;
            job.tempFile = 'tempFile';
            job.source = 'source';
            job.languages = ['deu'];
            incomingJsonMessageToJobTfMock.transform.and.returnValue(job);
            spyOn(cut, 'finishJob');
            spawnSyncMock.and.callFake(() => {
                return { status: 0 };
            });

            cut.process(jobMessage);

            expect(unlinkSyncMock).toHaveBeenCalledWith(`${Configuration.OUTPUT_PATH}/${job.tempFile}.pdf`);
            expect(spawnSyncMock).toHaveBeenCalledWith('tesseract',
                [
                    `-l`, `${job.languages.join('+')}`,
                    `${Configuration.INPUT_PATH}/${job.source}`,
                    `${Configuration.OUTPUT_PATH}/${job.tempFile}`,
                    `pdf`,
                ],
                Configuration.SPAWN_SYNC_OPTIONS);
            expect(incomingJsonMessageToJobTfMock.transform).toHaveBeenCalledWith(jobMessage);
            expect(cut.finishJob).toHaveBeenCalledWith(job);
        });

        it('should process the job of type tesseract for empty languages array.', () => {
            const jobMessage = 'this is a valid job message';
            const job = new Job();
            job.type = JobType.TESSERACT;
            job.tempFile = 'tempFile';
            job.source = 'source';
            job.languages = [];
            incomingJsonMessageToJobTfMock.transform.and.returnValue(job);
            spyOn(cut, 'finishJob');
            spawnSyncMock.and.callFake(() => {
                return { status: 0 };
            });

            cut.process(jobMessage);

            expect(unlinkSyncMock).toHaveBeenCalledWith(`${Configuration.OUTPUT_PATH}/${job.tempFile}.pdf`);
            expect(spawnSyncMock).toHaveBeenCalledWith('tesseract',
                [
                    `${Configuration.INPUT_PATH}/${job.source}`,
                    `${Configuration.OUTPUT_PATH}/${job.tempFile}`,
                    `pdf`,
                ],
                Configuration.SPAWN_SYNC_OPTIONS);
            expect(incomingJsonMessageToJobTfMock.transform).toHaveBeenCalledWith(jobMessage);
            expect(cut.finishJob).toHaveBeenCalledWith(job);
        });

        it('should process the job of type ocrmypdf.', () => {
            const jobMessage = 'this is a valid job message';
            const job = new Job();
            job.type = JobType.OCRMYPDF;
            job.tempFile = 'tempFile';
            job.source = 'source';
            job.languages = ['deu'];
            incomingJsonMessageToJobTfMock.transform.and.returnValue(job);
            spyOn(cut, 'finishJob');
            spawnSyncMock.and.callFake(() => {
                return { status: 0 };
            });

            cut.process(jobMessage);

            expect(unlinkSyncMock).not.toHaveBeenCalled();
            expect(spawnSyncMock).toHaveBeenCalledWith('ocrmypdf',
                [
                    `-l`, `${job.languages.join('+')}`,
                    `--skip-text`,
                    `${Configuration.INPUT_PATH}/${job.source}`,
                    `${Configuration.OUTPUT_PATH}/${job.tempFile}.pdf`,
                ],
                Configuration.SPAWN_SYNC_OPTIONS);
            expect(incomingJsonMessageToJobTfMock.transform).toHaveBeenCalledWith(jobMessage);
            expect(cut.finishJob).toHaveBeenCalledWith(job);
        });

        it('should process the job of type ocrmypdf for empty languages array.', () => {
            const jobMessage = 'this is a valid job message';
            const job = new Job();
            job.type = JobType.OCRMYPDF;
            job.tempFile = 'tempFile';
            job.source = 'source';
            job.languages = [];
            incomingJsonMessageToJobTfMock.transform.and.returnValue(job);
            spyOn(cut, 'finishJob');
            spawnSyncMock.and.callFake(() => {
                return { status: 0 };
            });

            cut.process(jobMessage);

            expect(unlinkSyncMock).not.toHaveBeenCalled();
            expect(spawnSyncMock).toHaveBeenCalledWith('ocrmypdf',
                [
                    `--skip-text`,
                    `${Configuration.INPUT_PATH}/${job.source}`,
                    `${Configuration.OUTPUT_PATH}/${job.tempFile}.pdf`,
                ],
                Configuration.SPAWN_SYNC_OPTIONS);
            expect(incomingJsonMessageToJobTfMock.transform).toHaveBeenCalledWith(jobMessage);
            expect(cut.finishJob).toHaveBeenCalledWith(job);
        });

        it('should process the job for a failed transformation.', () => {
            const jobMessage = 'this is a valid job message';
            const job = new Job();
            job.type = JobType.OCRMYPDF;
            job.tempFile = 'tempFile';
            job.source = 'source';
            job.languages = ['deu'];
            incomingJsonMessageToJobTfMock.transform.and.returnValue(job);
            spyOn(cut, 'finishJob');
            spawnSyncMock.and.callFake(() => {
                return { status: 1, error: 'test' };
            });

            cut.process(jobMessage);

            expect(unlinkSyncMock).not.toHaveBeenCalled();
            expect(spawnSyncMock).toHaveBeenCalledWith('ocrmypdf',
                [
                    `-l`, `${job.languages.join('+')}`,
                    `--skip-text`,
                    `${Configuration.INPUT_PATH}/${job.source}`,
                    `${Configuration.OUTPUT_PATH}/${job.tempFile}.pdf`,
                ],
                Configuration.SPAWN_SYNC_OPTIONS);
            expect(incomingJsonMessageToJobTfMock.transform).toHaveBeenCalledWith(jobMessage);
            expect(cut.finishJob).toHaveBeenCalledWith(job, new ServiceException(`The execution of 'ocrmypdf' command failed: test`));
        });
    });

    describe('the finishJob function', () => {
        it('should push the job to the finished queue if no error.', () => {
            const job = new Job();
            const finishedJob = new FinishedJob();
            finishedJob.id = 1;
            finishedJob.error = false;
            finishedJob.log = '';
            jobToFinishedJobTfMock.transform.and.returnValue(finishedJob);

            cut.finishJob(job);

            expect(jobToFinishedJobTfMock.transform).toHaveBeenCalledWith(job);
            expect(redisClientMock.lpush).toHaveBeenCalledWith('finished', finishedJob.toJSON());
        });

        it('should push the job to the finished queue if error.', () => {
            const job = new Job();
            const finishedJob = new FinishedJob();
            finishedJob.id = 1;
            finishedJob.error = false;
            finishedJob.log = '';
            jobToFinishedJobTfMock.transform.and.returnValue(finishedJob);
            const expectedJob = new FinishedJob();
            expectedJob.error = true;
            expectedJob.id = 1;
            expectedJob.log = 'test';

            cut.finishJob(job, new Error('test'));

            expect(jobToFinishedJobTfMock.transform).toHaveBeenCalledWith(job);
            expect(redisClientMock.lpush).toHaveBeenCalledWith('finished', expectedJob.toJSON());
        });
    });
});
