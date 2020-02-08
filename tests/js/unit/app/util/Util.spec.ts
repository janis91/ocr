import { Util } from '@a/util/Util'
import { FileFixtures } from '../../fixtures/FileFixtures'

describe('App Util', () => {
  describe('filterFilesWithMimeTypes()', () => {
    it('WHEN filterFilesWithMimeTypes is called with undefined, THEN return empty array.', () => {
      const result = Util.filterFilesWithMimeTypes(undefined)

      expect(result).toEqual([])
    })

    it('WHEN filterFilesWithMimeTypes is called with valid file array, THEN return all files in array.', () => {
      const result = Util.filterFilesWithMimeTypes(FileFixtures.ALLOWED)

      expect(result).toEqual(FileFixtures.ALLOWED)
    })

    it('WHEN filterFilesWithMimeTypes is called with file array that contains a wrong mimetype, THEN return only valid files in array.', () => {
      const result = Util.filterFilesWithMimeTypes([...FileFixtures.ALLOWED, FileFixtures.WRONG_MIME])

      expect(result).toEqual(FileFixtures.ALLOWED)
    })

    it('WHEN filterFilesWithMimeTypes is called with empty array, THEN return empty array.', () => {
      const result = Util.filterFilesWithMimeTypes([])

      expect(result).toEqual([])
    })

    it('WHEN filterFilesWithMimeTypes is called with array contianing only wrong mimetype, THEN return empty array.', () => {
      const result = Util.filterFilesWithMimeTypes([FileFixtures.WRONG_MIME])

      expect(result).toEqual([])
    })
  })
})
