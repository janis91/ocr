import { Logger, LoggerInstance, LoggerOptions, transports, config } from 'winston';
import { Configuration } from '../configuration/worker.configuration';

/**
 * This is a singleton instance of the logger for the whole app.
 */
export class LoggerUtil {

    private static loggerInstance: LoggerInstance;
    private static readonly WARN: string = 'warn';
    private static readonly DEBUG: string = 'debug';

    /**
     * Creates an instance of the logger or if already exiting returns this.
     */
    public static build(): LoggerInstance {
        /* tslint:disable:no-unused-expression */
        !LoggerUtil.loggerInstance && LoggerUtil.createLoggerInstance();
        /* tslint:enable */
        return LoggerUtil.loggerInstance;
    }

    private static createLoggerInstance() {
        LoggerUtil.loggerInstance = new Logger(<LoggerOptions>{
            exitOnError: false,
            level: LoggerUtil.getLogLevelConfiguration(),
            transports: [
                new (transports.Console)({ timestamp: true, colorize: true }),
            ],
        });
    }

    private static getLogLevelConfiguration(): string {
        return process.env.NODE_ENV === Configuration.ENVIRONMENT_PRODUCTION ? LoggerUtil.WARN : LoggerUtil.DEBUG;
    }
}
