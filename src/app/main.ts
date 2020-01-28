import Vue from 'vue'
import App from './App.vue'
import { getRequestToken } from '@nextcloud/auth'
import { translate, translatePlural } from '@nextcloud/l10n'

Vue.config.productionTip = false

/* eslint-disable camelcase */
declare var __webpack_nonce__: string
__webpack_nonce__ = btoa(getRequestToken()!)
/* eslint-enable camelcase */

Vue.prototype.t = translate
Vue.prototype.n = translatePlural

// TODO: initialize events for OCA Files.
// TODO: do the rest in the app.
export const $app = new Vue({
  render: h => h(App)
}).$mount('#app')
