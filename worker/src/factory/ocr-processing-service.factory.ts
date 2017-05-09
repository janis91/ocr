import { IncomingJsonMessageToJobTf } from '../service/transformer/incoming-json-message-to-job.tf';
import { JobToFinishedJobTf } from '../service/transformer/job-to-finished-job.tf';
import { LoggerUtil } from '../util/logger.util';
import { OcrProcessingService } from '../service/ocr-processing.service';
import { LoggerInstance } from 'winston';
import { spawnSync } from 'child_process';
import { ITransformer } from '../service/transformer/transformer';
import { RedisClientFactory } from './redis-client.factory';
import * as Redis from 'ioredis';
import { unlinkSync } from 'fs';

/**
 * Initializes the ocr processing sub-system.
 *
 * You should take care to only call the build() method once. Otherwise, several worker
 * subsystems may conflict each other.
 */
export class OcrProcessingServiceFactory {

    /** Creates an instance of a OcrProcessingService for our worker. */
    public static build(): OcrProcessingService {
        const logger: LoggerInstance = LoggerUtil.build();
        const incomingJsonMessageToJobTf: ITransformer = new IncomingJsonMessageToJobTf();
        const jobToFinishedJobTf: ITransformer = new JobToFinishedJobTf();
        const redisClient: Redis.Redis = RedisClientFactory.build();
        return new OcrProcessingService(logger, incomingJsonMessageToJobTf, unlinkSync, jobToFinishedJobTf, redisClient, spawnSync);
    }
}
