import { HttpService } from '../service/http.service';
import { ISingleTranslation } from '../../global-oc-functions';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2017
 */


export class Controller {

    private _applyLanguagesButton: HTMLButtonElement;
    private _applyRedisButton: HTMLButtonElement;

    constructor(private httpService: HttpService, private notification: any, private jquery: JQueryStatic,
        private document: Document, private t: ISingleTranslation) { }

    /**
     * Initializes the Controller / OCR admin settings in the frontend of Nextcloud.
     */
    public init(): void {
        this.registerEvents();
        this.applyLanguagesButton = <HTMLButtonElement>this.document.getElementById('languages_apply');
        this.applyRedisButton = <HTMLButtonElement>this.document.getElementById('redis_apply');
    }

    /**
     * Registers the events and the appropriate methods of the view.
     */
    public registerEvents(): void {
        this.document.addEventListener('click', (event: any): any => {
            if (event.target.id === 'languages_apply') {
                this.saveLanguages();
            }
            if (event.target.id === 'redis_apply') {
                this.saveRedis();
            }
        });
    }

    /**
     * Saves the languages.
     */
    public saveLanguages(): void {
        this.applyLanguagesButton.disabled = true;
        const languages = this.getLanguages();
        if (this.checkLanguagesValidity(languages)) {
            this.sendLanguages(languages).done(() => {
                this.displayMessage(this.t('ocr', 'Saved.'), false);
            }).fail((message) => {
                this.displayMessage(`${this.t('ocr', 'Saving languages failed:')} ${message}`, true);
            });
        } else {
            this.displayMessage(this.t('ocr', 'The languages are not specified in the correct format.'), true);
        }
        this.applyLanguagesButton.disabled = false;
    }

    /**
     * Saves the redis settings.
     */
    public saveRedis(): void {
        this.applyRedisButton.disabled = true;
        const redisHost = this.getRedisHost();
        const redisPort = this.getRedisPort();
        const redisDb = this.getRedisDb();
        if (this.checkRedisHostValidity(redisHost) && this.checkRedisPortValidity(redisPort) && this.checkRedisDbValidity(redisDb)) {
            this.sendRedis(redisHost, `${redisPort}`, `${redisDb}`).done(() => {
                this.displayMessage(this.t('ocr', 'Saved.'), false);
            }).fail((message) => {
                this.displayMessage(`${this.t('ocr', 'Saving Redis settings failed:')} ${message}`, true);
            });
        } else {
            this.displayMessage(this.t('ocr', 'The Redis settings are not specified in the right format.'), true);
        }
        this.applyLanguagesButton.disabled = false;
    }

    /**
     * Displays a message in the top of Nextcloud.
     * @param message String to display.
     * @param error If a message is an error or not.
     */
    public displayMessage(message: string, error: boolean): void {
        if (error) {
            this.notification.showHtml(`<div>${message}</div>`, { timeout: 10, type: 'error' });
        } else {
            this.notification.showHtml(`<div>${message}</div>`, { timeout: 5 });
        }
    }

    /**
     * Get the languages of the input.
     * @returns The string of languages.
     */
    public getLanguages(): string {
        return (<HTMLInputElement>this.document.getElementById('languages')).value;
    }

    /**
     * Get the redis host of the input.
     * @returns The redis host.
     */
    public getRedisHost(): string {
        return (<HTMLInputElement>this.document.getElementById('redisHost')).value;
    }

    /**
     * Get the redis port of the input.
     * @returns The redis port.
     */
    public getRedisPort(): number {
        return parseInt((<HTMLInputElement>this.document.getElementById('redisPort')).value, 10);
    }

    /**
     * Get the redis db of the input.
     * @returns The redis db.
     */
    public getRedisDb(): number {
        return parseInt((<HTMLInputElement>this.document.getElementById('redisDb')).value, 10);
    }

    /**
     * Validates if the given string is in the right format.
     * @param languages The string to validate.
     */
    public checkLanguagesValidity(languages: string): boolean {
        return /^(([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4});)*([a-z]{3,4}|[a-z]{3,4}\-[a-z]{3,4})$/.test(languages);
    }

    /**
     * Validates if the given string is in the right format.
     * @param redisHost The string to validate.
     */
    public checkRedisHostValidity(redisHost: string): boolean {
        /* tslint:disable:max-line-length */
        return /(^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$)/.test(redisHost);
        /* tslint:enable */
    }

    /**
     * Validates if the given number is in the right format.
     * @param redisPort The number to validate.
     */
    public checkRedisPortValidity(redisPort: number): boolean {
        return redisPort > 0 && redisPort < 65535;
    }

    /**
     * Validates if the given number is in the right format.
     * @param redisDb The number to validate.
     */
    public checkRedisDbValidity(redisDb: number): boolean {
        return redisDb >= 0;
    }

    /**
     * Sets the languages in the app config.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public sendLanguages(languages: string): JQueryPromise<{}> {
        const deferred = this.jquery.Deferred();
        this.httpService.sendLanguages(languages).done(() => {
            deferred.resolve();
        }).fail((jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR.responseText);
        });
        return deferred.promise();
    }

    /**
     * Sets the redis settings in the app config.
     * @returns A JQueryPromise to deal with the asynchronous ajax call.
     */
    public sendRedis(redisHost: string, redisPort: string, redisDb: string): JQueryPromise<{}> {
        const deferred = this.jquery.Deferred();
        this.httpService.sendRedis(redisHost, redisPort, redisDb).done(() => {
            deferred.resolve();
        }).fail((jqXHR: JQueryXHR) => {
            deferred.reject(jqXHR.responseText);
        });
        return deferred.promise();
    }

    public get applyLanguagesButton(): HTMLButtonElement {
        return this._applyLanguagesButton;
    }

    public set applyLanguagesButton(value: HTMLButtonElement) {
        this._applyLanguagesButton = value;
    }

    public get applyRedisButton(): HTMLButtonElement {
        return this._applyRedisButton;
    }

    public set applyRedisButton(value: HTMLButtonElement) {
        this._applyRedisButton = value;
    }
}
