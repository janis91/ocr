export class Job implements IJob {
    private _id: number;
    private _status: string;
    private _originalFilename: string;
    private _errorLog: string;
    private _replace: string;

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get status(): string {
        return this._status;
    }

    public set status(value: string) {
        this._status = value;
    }

    public get originalFilename(): string {
        return this._originalFilename;
    }

    public set originalFilename(value: string) {
        this._originalFilename = value;
    }

    public get errorLog(): string {
        return this._errorLog;
    }

    public set errorLog(value: string) {
        this._errorLog = value;
    }

    public get replace(): string {
        return this._replace;
    }

    public set replace(value: string) {
        this._replace = value;
    }
}

export interface IJob {
    id: number;
    status: string;
    originalFilename: string;
    errorLog: string;
    replace: string;
}
