import Vue from 'vue'
import App from './App.vue'
import { getRequestToken } from '@nextcloud/auth'
import { generateFilePath } from '@nextcloud/router'
import { OcrService } from './services/OcrService'

Vue.config.productionTip = false

/* eslint-disable camelcase */
declare var __webpack_nonce__: string
__webpack_nonce__ = btoa(getRequestToken()!)
/* eslint-enable camelcase */

// Correct the root of the app for chunk loading
// OC.linkTo matches the apps folders
// OC.generateUrl ensure the index.php (or not)
// We do not want the index.php since we're loading files
// eslint-disable-next-line
__webpack_public_path__ = generateFilePath('ocr', '', 'js/')

// Init OcrService
if (OCA) {
  Object.assign(OCA, { Ocr: new OcrService() })
}

// Create ocr view.
const OcrView = document.createElement('div')
OcrView.id = 'ocr-view'
document.body.appendChild(OcrView)

export default new Vue({
  el: '#ocr-view',
  // When debugging the page, it's easier to find which app
  // is which. Especially when there is multiple apps
  // roots mounted o the same page!
  // eslint-disable-next-line vue/match-component-file-name
  name: 'OcrView',
  render: h => h(App)
})
