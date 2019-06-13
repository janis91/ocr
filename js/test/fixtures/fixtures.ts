import { OCAFile, OCSingleTranslation, OCMultiTranslation } from '../../src/global-oc-types';

type globalAny = { t: jasmine.Spy<OCSingleTranslation>; n: jasmine.Spy<OCMultiTranslation>; };
declare var global: any;
export const globalAny: any = global;
globalAny.t = jasmine.createSpy('t');
globalAny.n = jasmine.createSpy('n');

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
