export class Status implements IStatus {
    private _pending: number;
    private _failed: number;
    private _processed: number;

    public get pending(): number {
        return this._pending;
    }

    public set pending(value: number) {
        this._pending = value;
    }

    public get failed(): number {
        return this._failed;
    }

    public set failed(value: number) {
        this._failed = value;
    }

    public get processed(): number {
        return this._processed;
    }

    public set processed(value: number) {
        this._processed = value;
    }

}

export interface IStatus {
    pending: number;
    failed: number;
    processed: number;
}
