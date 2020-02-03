import Vue from 'vue'
import View from '@a/App.vue'
import store, { LOAD_FAVORITE_LANGUAGES } from '@a/store/Store'
import { TesseractService } from '@a/services/TesseractService'

export class App {
  private tesseractService: TesseractService;
  private view: Vue;

  constructor() {
    this.updateFavoriteLanguages()
    this.tesseractService = new TesseractService()
    const OcrView = document.createElement('div')
    OcrView.id = 'ocr-view'
    document.body.appendChild(OcrView)

    this.view = new Vue({
      el: '#ocr-view',
      name: 'OcrView',
      render: h => h(View),
      store
    })
    // eslint-disable-next-line no-console
    console.log('OCA.Ocr initialized')
  }

  public updateFavoriteLanguages = () => {
    store.dispatch(LOAD_FAVORITE_LANGUAGES)
  }
}
