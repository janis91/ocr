export interface ISingleTranslation {
    (appName: string, translationString: string, options?: { [param: string]: string }): string;
}

export interface IMultiTranslation {
    (appName: string, singleTranslationString: string, multipleTranslationString: string, count: number, options?: { [param: string]: string }): string;
}
