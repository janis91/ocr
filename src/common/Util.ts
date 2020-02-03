import { Common } from '@/common/Common'

export class Util {
  public static mapToCommonLanguages(data: string[]): Map<string, string> {
    const favoriteLanguages = new Map()
    data.forEach(lang => {
      Common.AVAILABLE_LANGUAGES.has(lang) && favoriteLanguages.set(lang, Common.AVAILABLE_LANGUAGES.get(lang))
    })
    return favoriteLanguages
  }

  public static mapToOptions(languages: Map<string, string>): LanguageOption[] {
    return Array.from(languages, (entry) => ({ key: entry[0], label: entry[1] }))
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
