import { Configuration } from '@a/configuration/Configuration'

export class Util {
  public static filterFilesWithMimeTypes(files: OCAFile[] | undefined): OCAFile[] {
    if (files === undefined) { return [] }
    return files.filter(file => Configuration.ALLOWED_MIMETYPES.indexOf(file.mimetype) !== -1)
  }
}
