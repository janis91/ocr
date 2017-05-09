import { JobType } from './job-type.enum';

export interface IJob {
    id: number;
    type: JobType;
    source: string;
    tempFile: string;
    languages: string[];
}

export class Job implements IJob {

    private _id: number;
    private _type: JobType;
    private _source: string;
    private _tempFile: string;
    private _languages: string[];

    public get type(): JobType {
        return this._type;
    }

    public set type(value: JobType) {
        this._type = value;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get source(): string {
        return this._source;
    }

    public set source(value: string) {
        this._source = value;
    }

    public get tempFile(): string {
        return this._tempFile;
    }

    public set tempFile(value: string) {
        this._tempFile = value;
    }

    public get languages(): string[] {
        return this._languages;
    }

    public set languages(value: string[]) {
        this._languages = value;
    }
}
