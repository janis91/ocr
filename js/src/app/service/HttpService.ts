import { OC } from '../../global-oc-types';
import { AxiosResponse, AxiosInstance } from 'axios';

export class HttpService {

    private static API_URL_LANGUAGES: string = '/api/personal/languages';

    constructor(private oc: OC, private axios: AxiosInstance) { }

    public fetchFavoriteLanguages: () => Promise<string[]> = async () => {
        const url = this.oc.generateUrl(this.oc.appswebroots.ocr + HttpService.API_URL_LANGUAGES);
        return (await this.axios.get<any, AxiosResponse<string[]>>(url)).data;
    }
}
