import { OC } from '../../global-oc-types';
import { AxiosResponse, AxiosInstance } from 'axios';
import { Configuration } from '../configuration/Configuration';

export class HttpService {

    private static API_URL_LANGUAGES: string = '/apps/ocr/api/personal/languages';

    constructor(private oc: OC, private axios: AxiosInstance) { }

    public fetchFavoriteLanguages: () => Promise<string[]> = async () => {
        const url = this.generateAppUrl();
        return (await this.axios.get<any, AxiosResponse<string[]>>(url)).data;
    }

    public postFavoriteLanguages: (languages: string[]) => Promise<string[]> = async (languages) => {
        const url = this.generateAppUrl();
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

    private generateAppUrl: () => string = () => {
        return this.oc.generateUrl(HttpService.API_URL_LANGUAGES);
    }
}
