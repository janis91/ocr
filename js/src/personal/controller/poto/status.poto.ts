export class Status implements IStatus {
    // TODO: specify when docker environment is ready
    private _id: number;

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

}

export interface IStatus {
    // TODO: specify when docker environment is ready
    id: number;
}
