import { RedisOptions } from 'ioredis';
import { SpawnSyncOptionsWithStringEncoding } from 'child_process';

export class Configuration {

    public static readonly ENVIRONMENT_PRODUCTION = 'production';
    public static readonly REDIS_CLIENT_OPTIONS: RedisOptions = {
        db: process.env.REDIS_DB || 0,
        host: process.env.REDIS_HOST || 'redis',
        keyPrefix: 'ocr:',
        port: process.env.REDIS_PORT || 6379,
        reconnectOnError: function (err) {
            if (err.message.slice(0, 'READONLY'.length) === 'READONLY') {
                return true;
            }
        },
        retryStrategy: function (times) {
            const delay = Math.min(times * 50, 2000); // two minutes
            return delay;
        },
    };
    public static readonly INPUT_PATH = '/home/node/data';
    public static readonly OUTPUT_PATH = '/home/node/output';
    public static readonly SPAWN_SYNC_OPTIONS: SpawnSyncOptionsWithStringEncoding = {
        encoding: 'utf8',
        timeout: 1000 * 120, // two minutes
    };
}
