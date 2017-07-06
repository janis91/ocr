import { LoggerInstance } from 'winston';
import * as Redis from 'ioredis';
import { Configuration } from './configuration/worker.configuration';
import { LoggerUtil } from './util/logger.util';
import { OcrProcessingService } from './service/ocr-processing.service';
import { OcrProcessingServiceFactory } from './factory/ocr-processing-service.factory';
import { RedisClientFactory } from './factory/redis-client.factory';

/**
 * The worker class.
 *
 * @class Worker
 */
export class Worker {

    private logger: LoggerInstance;
    private ocrProcessingService: OcrProcessingService;
    private redisClient: Redis.Redis;

    /**
     * The constructor.
     */
    constructor() {
        this.logger = LoggerUtil.build();
        this.ocrProcessingService = OcrProcessingServiceFactory.build();
        this.redisClient = RedisClientFactory.build();
        this.logger.info(`Application: "OCR worker" initialized.`);
    }

    /**
     * Starts the node worker loop.
     */
    public loop() {
        this.redisClient.brpoplpush('incoming', 'working', 0).then((jobMessage: string) => {
            this.logger.debug(`Message recieved from Redis server: ${jobMessage}`);
            try {
                this.ocrProcessingService.process(jobMessage);
            } catch (e) {
                this.logger.error(`${e.message}: ${e.stack}`);
            }
            this.redisClient.lrem('working', 1, jobMessage).then(() => { this.loop(); });
        });
    }
}
