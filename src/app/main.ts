import Vue from 'vue'
import { getRequestToken } from '@nextcloud/auth'
import { generateFilePath } from '@nextcloud/router'
import { App } from '@a/App'

Vue.config.productionTip = false

/* eslint-disable camelcase */
__webpack_nonce__ = btoa(getRequestToken()!)
// Correct the root of the app for chunk loading
__webpack_public_path__ = generateFilePath('ocr', '', '')
/* eslint-enable camelcase */

Vue.prototype.t = t
Vue.prototype.n = n
Vue.prototype.OC = OC
Vue.prototype.OCA = OCA

// Init OcrService
let initCounter = 0
const interval = setInterval(() => {
  if (typeof t === 'function' && typeof n === 'function' && typeof OC?.Notification?.showHtml === 'function' &&
            typeof OCA?.Files?.App?.fileList?.getCurrentDirectory === 'function' &&
            typeof OCA?.Files?.App?.fileList?.filesClient?.putFileContents === 'function') {
    Object.assign(OCA, { Ocr: new App() })
    clearInterval(interval)
  } else if (initCounter === 50) {
    // eslint-disable-next-line no-console
    console.error('OCR could not be initialized. Some of the required resources (OC, OCA, etc.) did not load in time.')
    clearInterval(interval)
  }
  initCounter++
}, 100)
