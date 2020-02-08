import '../GlobalMocks.mock'
import { Util } from '@/common/Util'

describe('Common Util', () => {
  describe('mapToCommonLanguages()', () => {
    it('WHEN mapToCommonLanguages is called with an array of valid language keys, THEN returns a Map of corresponding languages.', () => {
      const result = Util.mapToCommonLanguages(['deu', 'eng', 'ita_old'])

      expect(result).toEqual(new Map([['deu', 'German'], ['eng', 'English'], ['ita_old', 'Italian (Old)']]))
    })

    it('WHEN mapToCommonLanguages is called with an empty array, THEN returns an empty Map.', () => {
      const result = Util.mapToCommonLanguages([])

      expect(result).toEqual(new Map())
    })

    it('WHEN mapToCommonLanguages is called with an array of invalid language keys, THEN returns an empty Map.', () => {
      const result = Util.mapToCommonLanguages(['does_not_fit', 'does_not_fit_either'])

      expect(result).toEqual(new Map())
    })

    it('WHEN mapToCommonLanguages is called with an array of valid language keys AND invalid language keys, THEN returns a Map of corresponding valid languages.', () => {
      const result = Util.mapToCommonLanguages(['deu', 'eng', 'ita_old', 'does_not_fit', 'does_not_fit_either'])

      expect(result).toEqual(new Map([['deu', 'German'], ['eng', 'English'], ['ita_old', 'Italian (Old)']]))
    })
  })

  describe('mapToOptions()', () => {
    it('WHEN mapToOptions is called with empty Map, THEN returns empty array.', () => {
      const result = Util.mapToOptions(new Map())

      expect(result).toEqual([])
    })

    it('WHEN mapToOptions is called with Map("deu" => "German"), THEN returns array with corresponding LanguageOption.', () => {
      const result = Util.mapToOptions(new Map([['deu', 'German']]))

      expect(result).toEqual([{ key: 'deu', label: 'German' }])
    })

    it('WHEN mapToOptions is called with Map("deu" => "German", "eng" => "English"), THEN returns array with corresponding LanguageOptions.', () => {
      const result = Util.mapToOptions(new Map([['deu', 'German'], ['eng', 'English']]))

      expect(result).toEqual([{ key: 'deu', label: 'German' }, { key: 'eng', label: 'English' }])
    })
  })

  describe('mapOptionsToLanguages()', () => {
    it('WHEN mapOptionsToLanguages is called with [{ key: "deu", label: "German" }, { key: "eng", label: "English" }], THEN returns corresponding Map representation.', () => {
      const result = Util.mapOptionsToLanguages([{ key: 'deu', label: 'German' }, { key: 'eng', label: 'English' }])

      expect(result).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))
    })

    it('WHEN mapOptionsToLanguages is called with empty array, THEN returns corresponding empty Map.', () => {
      const result = Util.mapOptionsToLanguages([])

      expect(result).toEqual(new Map())
    })

    it('WHEN mapOptionsToLanguages is called with [{ key: "deu", label: "German" }], THEN returns corresponding Map representation.', () => {
      const result = Util.mapOptionsToLanguages([{ key: 'deu', label: 'German' }])

      expect(result).toEqual(new Map([['deu', 'German']]))
    })
  })
})
