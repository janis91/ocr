export class FileFixtures {
    public static WRONG_MIME: OCAFile = {
      etag: '12asefw4t23r23sgfw',
      id: 2,
      mimetype: 'application/octet-stream',
      mtime: new Date().getTime(),
      name: 'file2.str',
      path: '/',
      permissions: 27,
      size: 1234
    };

    public static PNG: OCAFile = {
      etag: '12asefw4t23r23sgfw',
      id: 3,
      mimetype: 'image/png',
      mtime: new Date().getTime(),
      name: 'file3.png',
      path: '/',
      permissions: 27,
      size: 1234
    };

    public static JPG: OCAFile = {
      etag: '12asefw4t23r23sgfw',
      id: 3,
      mimetype: 'image/jpeg',
      mtime: new Date().getTime(),
      name: 'file3.jpg',
      path: '/',
      permissions: 27,
      size: 1234
    };

      public static BMP: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 3,
        mimetype: 'image/bmp',
        mtime: new Date().getTime(),
        name: 'file3.bmp',
        path: '/',
        permissions: 27,
        size: 1234
      };

      public static TIFF: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 3,
        mimetype: 'image/tiff',
        mtime: new Date().getTime(),
        name: 'file3.tiff',
        path: '/',
        permissions: 27,
        size: 1234
      };

      public static PORTABLE_BMP: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 3,
        mimetype: 'image/x-portable-bitmap',
        mtime: new Date().getTime(),
        name: 'file3.bmpx',
        path: '/',
        permissions: 27,
        size: 1234
      };

      public static ADDITIONAL_PNG: OCAFile = {
        etag: '12asefw4t23r23sgfw',
        id: 3,
        mimetype: 'image/png',
        mtime: new Date().getTime(),
        name: 'additional.png',
        path: '/',
        permissions: 27,
        size: 1234
      };

      public static ALLOWED = [FileFixtures.PNG, FileFixtures.JPG, FileFixtures.BMP, FileFixtures.TIFF, FileFixtures.PORTABLE_BMP]
}
