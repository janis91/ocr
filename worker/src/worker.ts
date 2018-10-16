import { LoggerInstance } from 'winston';
import * as Redis from 'ioredis';
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
        this.logger.info(`Application "OCR worker" initialized.`);
        this.registerProcessTerminationEvent();
    }

    /**
     * Starts the node worker loop.
     */
    public loop() {
        this.redisClient.brpoplpush('incoming', 'working', 0).then((jobMessage: string) => {
            this.logger.debug(`Message received from Redis server: ${jobMessage}`);
            try {
                this.ocrProcessingService.process(jobMessage);
            } catch (e) {
                this.logger.error(`${e.message}: ${e.stack}`);
            }
            this.redisClient.lrem('working', 1, jobMessage).then(() => { this.loop(); });
        });
    }

    /**
     * Registers the SIGTERM event for closing the docker container.
     */
    public registerProcessTerminationEvent() {
        process.on('SIGTERM', () => {
            this.logger.info(`Application "OCR worker" stopped.`);
            this.redisClient.disconnect();
            process.exit(0);
        });
    }
}
