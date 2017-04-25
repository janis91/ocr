
export class File implements IFile {

    private _id: number;
    private _mimetype: string;

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get mimetype(): string {
        return this._mimetype;
    }

    public set mimetype(value: string) {
        this._mimetype = value;
    }
}

export interface IFile extends IReducedFile {
    mimetype: string;
}

export interface IReducedFile {
    id: number;
}
