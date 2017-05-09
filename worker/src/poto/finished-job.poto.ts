import { IJsonObject } from './json-object';

export interface IFinishedJob {
    id: number;
    error: boolean;
    log: string;
}

export class FinishedJob implements IFinishedJob, IJsonObject {
    private _id: number;
    private _error: boolean;
    private _log: string;

    public toJSON(): string {
        return JSON.stringify(
            {
                id: this.id,
                error: this.error,
                log: this.log,
            },
        );
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get error(): boolean {
        return this._error;
    }

    public set error(value: boolean) {
        this._error = value;
    }

    public get log(): string {
        return this._log;
    }

    public set log(value: string) {
        this._log = value;
    }
}
