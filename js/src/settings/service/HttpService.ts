import { OC } from '../../global-oc-types';
import { AxiosResponse, AxiosInstance } from 'axios';
import { Configuration } from '../configuration/Configuration';

export class HttpService {

    private static API_URL_LANGUAGES: string = '/api/personal/languages';

    constructor(private oc: OC, private axios: AxiosInstance) { }

    public fetchFavoriteLanguages: () => Promise<string[]> = async () => {
        const url = this.oc.generateUrl(this.oc.appswebroots.ocr + HttpService.API_URL_LANGUAGES);
        return (await this.axios.get<any, AxiosResponse<string[]>>(url)).data;
    }

    public postFavoriteLanguages: (languages: string[]) => Promise<string[]> = async (languages) => {
        const url = this.oc.generateUrl(this.oc.appswebroots.ocr + HttpService.API_URL_LANGUAGES);
        const data = { favoriteLanguages: JSON.stringify(languages) };
        try {
            const response = await this.axios.post<{ favoriteLanguages: string }, AxiosResponse<string[]>>(url, data, {
                headers: {
                    'requesttoken': this.oc.requestToken,
                },
            });
            return response.data;
        } catch (e) {
            if (e.response.status === 400) {
                throw new Error(Configuration.TRANSLATION_ERROR_WRONG_INPUT);
            } else {
                throw new Error(Configuration.TRANSLATION_UNEXPECTED_ERROR_SAVE);
            }
        }
    }
}
