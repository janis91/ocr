import * as Redis from 'ioredis';
import { LoggerInstance } from 'winston';
import { Configuration } from '../configuration/worker.configuration';
import { LoggerUtil } from '../util/logger.util';

/**
 * Initializes the redis client sub-system.
 *
 * You should take care to only call the build() method once. Otherwise, several redis
 * subsystems may result in unwanted behavior.
 */
export class RedisClientFactory {

    private static redisInstance: Redis.Redis;

    /** Creates an instance of a RedisClient for our worker. */
    public static build(): Redis.Redis {
        /* tslint:disable:no-unused-expression */
        !RedisClientFactory.redisInstance && RedisClientFactory.createRedisInstance();
        /* tslint:enable */
        return RedisClientFactory.redisInstance;
    }

    private static createRedisInstance() {
        const logger: LoggerInstance = LoggerUtil.build();
        RedisClientFactory.redisInstance = new Redis(Configuration.REDIS_CLIENT_OPTIONS);
        // register Error handling
        RedisClientFactory.redisInstance.on('error', (e: Error) => {
            logger.error(`ERROR: ${e.message}.`);
        });
        // register close connection warning
        RedisClientFactory.redisInstance.on('close', () => {
            logger.warn(`Connection closed to redis server.`);
        });
        // register reconnection trial info
        RedisClientFactory.redisInstance.on('reconnect', () => {
            logger.info(`Reconnecting to redis server.`);
        });
    }
}
