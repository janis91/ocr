import { Common } from '@/common/Common'

export class Util {
  public static mapToCommonLanguages(data: string[]): Map<string, string> {
    const langs = new Map()
    data.forEach(lang => {
      Common.AVAILABLE_LANGUAGES.has(lang) && langs.set(lang, Common.AVAILABLE_LANGUAGES.get(lang))
    })
    return langs
  }

  public static mapToOptions(langs: Map<string, string>): LanguageOption[] {
    return Array.from(langs, (entry) => ({ key: entry[0], label: entry[1] }))
  }

  public static mapOptionsToLanguages(options: LanguageOption[]): Map<string, string> {
    const map = new Map()
    options.forEach(({ key, label }) => map.set(key, label))
    return map
  }
}

export interface LanguageOption {
  key: string;
  label: string;
}
