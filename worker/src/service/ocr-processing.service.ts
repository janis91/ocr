import { JobType } from '../poto/job-type.enum';
import { IJob } from '../poto/job.poto';
import { FinishedJob } from '../poto/finished-job.poto';
import { IncomingJsonMessageToJobTf } from './transformer/incoming-json-message-to-job.tf';
import { ServiceException } from './service.exception';
import { Configuration } from '../configuration/worker.configuration';
import { LoggerInstance } from 'winston';

import { SpawnSyncOptionsWithStringEncoding, SpawnSyncReturns } from 'child_process';
import { ITransformer } from './transformer/transformer';
import * as Redis from 'ioredis';

type SpanwSync = (command: string, args?: any[], options?: SpawnSyncOptionsWithStringEncoding) => SpawnSyncReturns<string>;
type UnlinkSync = (path: string) => void;

export class OcrProcessingService {

    constructor(private logger: LoggerInstance, private incomingJsonMessageToJobTf: ITransformer, private unlinkSync: UnlinkSync,
        private jobToFinishedJobTf: ITransformer, private redisClient: Redis.Redis, private spawnSync: SpanwSync) { }

    public process(jobMessage: string): void {
        this.logger.debug(`Starting Job: ${jobMessage}`);
        const job: IJob = this.incomingJsonMessageToJobTf.transform(jobMessage);
        this.logger.debug(`The sanitized and transformed job: ${JSON.stringify(job)}`);
        try {
            switch (job.type) {
                case JobType.TESSERACT:
                    this.execTesseract(job);
                    break;
                case JobType.OCRMYPDF:
                    this.execOcrMyPdf(job);
                    break;
            }
        } catch (e) {
            this.logger.error(`Job errored: ${e.message}`);
            this.finishJob(job, e);
        }
        this.finishJob(job);
    }

    public finishJob(job: IJob, error?: Error): void {
        const finishedJob: FinishedJob = this.jobToFinishedJobTf.transform(job);
        if (error) {
            finishedJob.error = true;
            finishedJob.log = error.message;
        }
        this.redisClient.lpush('finished', finishedJob.toJSON());
    }

    private execTesseract(job: IJob): void {
        this.unlinkSync(`${Configuration.OUTPUT_PATH}/${job.tempFile}`);
        const commandArgs: Array<String> = [
            `${Configuration.INPUT_PATH}/${job.source}`,
            `${Configuration.OUTPUT_PATH}/${job.tempFile.replace(/\.[^/.]+$/, '')}`,
        ];
        if (job.languages.length > 0) {
            commandArgs.push(`-l`, `${job.languages.join('+')}`);
        }
        const spawn = this.spawnSync('tesseract',
            commandArgs,
            Configuration.SPAWN_SYNC_OPTIONS);
        if (spawn.status !== 0) {
            throw new ServiceException(`The execution of 'tesseract' command failed: ${spawn.error ? spawn.error : spawn.stderr.toString().trim()}`);
        }
        this.logger.debug(`tesseract command finished successfully: ${spawn.output}`);
    }

    private execOcrMyPdf(job: IJob): void {
        const commandArgs: Array<String> = [
            `${Configuration.INPUT_PATH}/${job.source}`,
            `${Configuration.OUTPUT_PATH}/${job.tempFile}`,
            `--skip-text`,
        ];
        if (job.languages.length > 0) {
            commandArgs.push(`-l`, `${job.languages.join('+')}`);
        }
        const spawn = this.spawnSync('ocrmypdf',
            commandArgs,
            Configuration.SPAWN_SYNC_OPTIONS);
        if (spawn.status !== 0) {
            throw new ServiceException(`The execution of 'ocrmypdf' command failed: ${spawn.error ? spawn.error : spawn.stderr.toString().trim()}`);
        }
        this.logger.debug(`OCRmyPDF command finished successfully: ${spawn.output}`);
    }
}
