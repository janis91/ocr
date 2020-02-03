import Vue from 'vue'
import View from '@s/App.vue'
import store from '@s/store/Store'

export class App {
    private view: Vue;

    constructor() {
      this.view = new Vue({
        el: '#ocr-view',
        name: 'OcrView',
        render: h => h(View),
        store
      })
      // eslint-disable-next-line no-console
      console.log('OCA.Ocr initialized')
    }
}
