import { HttpService } from '../service/HttpService';
import { View } from '../view/View';
import { Configuration } from '../configuration/Configuration';

/**
 * Nextcloud - OCR
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Janis Koehr <janiskoehr@icloud.com>
 * @copyright Janis Koehr 2019
 */
export class Controller {

    private favoriteLanguages: string[];

    constructor(private view: View, private httpService: HttpService, private document: Document) { }

    /**
     * Initializes the Controller / the frontend of ocr settings.
     */
    public init: () => Promise<void> = async () => {
        try {
            this.favoriteLanguages = await this.httpService.fetchFavoriteLanguages();
        } catch (e) {
            throw new Error(Configuration.TRANSLATION_UNEXPECTED_ERROR_LOAD);
        }
        this.view.hideLoad();
        this.view.init(this.favoriteLanguages);
        this.registerEvents();
    }

    /**
     * Registers all events that should be initiallized
     */
    public registerEvents: () => void = () => {
        this.document.getElementById('ocrLanguagesSave').addEventListener('click', this.clickToSaveHandler);
    }

    /**
     * On click handler for saving favorite languages
     */
    public clickToSaveHandler: () => Promise<void> = async () => {
        const favLangs = this.view.getSelectValues();
        this.view.disableSelect();
        try {
            await this.httpService.postFavoriteLanguages(favLangs);
            this.favoriteLanguages = favLangs;
        } catch (e) {
            this.view.displayError(e.message);
        }
        this.view.enableSelect();
        this.view.setSelectValues(this.favoriteLanguages);
    }
}
