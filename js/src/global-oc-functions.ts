export interface ISingleTranslation {
    (appName: string, translationString: string): string;
}

export interface IMultiTranslation {
    (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number): string;
}
