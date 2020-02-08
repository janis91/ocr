import Vue from 'vue'
import { getRequestToken } from '@nextcloud/auth'
import { generateFilePath } from '@nextcloud/router'

Vue.config.productionTip = false

/* eslint-disable camelcase */
__webpack_nonce__ = btoa(getRequestToken()!)
// Correct the root of the app for chunk loading
__webpack_public_path__ = generateFilePath('ocr', '', '')
/* eslint-enable camelcase */

// eslint-disable-next-line import/first
import '@s/init'
