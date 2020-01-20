import { OCAFile } from '../../src/global-oc-types';

export const windowAny: any = window;
windowAny.t = jasmine.createSpy('t');
windowAny.n = jasmine.createSpy('n');
windowAny.Choices = jasmine.createSpy('Choices');

export class FilesFixtures {
    public static PDF: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 1,
        mimetype: 'application/pdf',
        mtime: new Date().getTime(),
        name: 'file1.pdf',
        path: '/',
        permissions: 27,
        size: 1234,
    };

    public static WRONG_MIME: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 2,
        mimetype: 'application/octet-stream',
        mtime: new Date().getTime(),
        name: 'file2.str',
        path: '/',
        permissions: 27,
        size: 1234,
    };

    public static PNG: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 3,
        mimetype: 'image/png',
        mtime: new Date().getTime(),
        name: 'file3.png',
        path: '/',
        permissions: 27,
        size: 1234,
    };

    public static PDF_UNUSUAL: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 1,
        mimetype: 'application/pdf',
        mtime: new Date().getTime(),
        name: 'file4.cool.PDF',
        path: '/',
        permissions: 27,
        size: 1234,
    };
}

export class OCAFileActionsContextFixture {
    public static CONTEXT_FOR_PNG = {
        dir: FilesFixtures.PNG.path,
        fileActions: {
            clear: jasmine.createSpy('clear'),
            registerAction: jasmine.createSpy('registerAction'),
            registerDefaultActions: jasmine.createSpy('registerDefaultActions'),
        },
        fileInfoModel: {
            attributes: FilesFixtures.PNG,
        },
    };
}

export class JqPromiseMock {
    constructor(private error?: number) { }
    public done = (cb: () => void) => {
        if (!this.error) {
            cb();
        }
        return this;
    }
    public fail = (cb: (e: any) => void) => {
        if (this.error) {
            cb(this.error);
        }
        return this;
    }
}
