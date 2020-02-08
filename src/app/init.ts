import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { App } from '@a/App.ts'
import View from '@a/App.vue'
import StoreConfig from '@a/store/Store'

Vue.use(Vuex)
Vue.prototype.t = t
Vue.prototype.n = n
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

const OcrView = document.createElement('div')
OcrView.id = 'ocr-view'
document.body.appendChild(OcrView)

// Init OcrService
let initCounter = 0
const interval = setInterval(() => {
  if (typeof t === 'function' && typeof n === 'function' && typeof OC?.Notification?.showHtml === 'function' &&
            typeof OCA?.Files?.App?.fileList?.getCurrentDirectory === 'function' &&
            typeof OCA?.Files?.App?.fileList?.filesClient?.putFileContents === 'function') {
    const store = new Store(StoreConfig)
    Object.assign(OCA, {
      Ocr: {
        app: new App(),
        view: new Vue({
          el: '#ocr-view',
          name: 'OcrView',
          render: h => h(View),
          store
        }),
        store
      }
    })
    OCA.Ocr.app.init()
    clearInterval(interval)
  } else if (initCounter === 50) {
    // eslint-disable-next-line no-console
    console.error('OCR could not be initialized. Some of the required resources (OC, OCA, etc.) did not load in time.')
    clearInterval(interval)
  }
  initCounter++
}, 100)
