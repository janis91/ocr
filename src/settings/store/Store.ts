import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { AxiosResponse } from 'axios'
import { NextcloudGuiApiService } from '@s/services/NextcloudGuiApiService'
import { Translations } from '@s/configuration/Translations'
import { Util, LanguageOption } from '@/common/Util'

Vue.use(Vuex)

export const SAVE_FAVORITE_LANGUAGES = 'SAVE_FAVORITE_LANGUAGES'
export const LOAD_FAVORITE_LANGUAGES = 'LOAD_FAVORITE_LANGUAGES'
export const SET_FAVORITE_LANGUAGES = 'SET_FAVORITE_LANGUAGES'
export const CLEAR_FAVORITE_LANGUAGES = 'CLEAR_FAVORITE_LANGUAGES'
const SET_STATUS_LOAD = 'SET_STATUS_LOAD'
const SET_STATUS_READY = 'SET_STATUS_READY'

export default new Store({
  strict: true,
  state: {
    favoriteLanguages: new Map<string, string>(),
    loading: true as boolean
  },
  mutations: {
    [SET_FAVORITE_LANGUAGES](state, payload: {favoriteLanguages: Map<string, string>}) {
      state.favoriteLanguages = payload.favoriteLanguages
    },
    [SET_STATUS_LOAD](state) {
      state.loading = true
    },
    [SET_STATUS_READY](state) {
      state.loading = false
    },
    [CLEAR_FAVORITE_LANGUAGES](state) {
      state.favoriteLanguages = new Map()
    }
  },
  getters: {
    selectedOptions(state): LanguageOption[] {
      return Util.mapToOptions(state.favoriteLanguages)
    }
  },
  actions: {
    async [LOAD_FAVORITE_LANGUAGES]({ commit }) {
      try {
        commit(SET_STATUS_LOAD)
        const { data } = await axios.get<any, AxiosResponse<string[]>>(generateUrl('/apps/ocr/api/personal/languages'))
        const favoriteLanguages = Util.mapToCommonLanguages(data)
        commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages })
        commit(SET_STATUS_READY)
      } catch (e) {
        NextcloudGuiApiService.displayError(Translations.TRANSLATION_UNEXPECTED_ERROR_LOAD)
        commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map() })
        commit(SET_STATUS_READY)
      }
    },
    async [SAVE_FAVORITE_LANGUAGES]({ commit, dispatch, state }) {
      try {
        commit(SET_STATUS_LOAD)
        const dataToTransfer = { favoriteLanguages: JSON.stringify(Array.from(state.favoriteLanguages.keys())) }
        const { data } = await axios.post<{ favoriteLanguages: string }, AxiosResponse<string[]>>(generateUrl('/apps/ocr/api/personal/languages'), dataToTransfer)
        const favoriteLanguages = Util.mapToCommonLanguages(data)
        commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages })
        commit(SET_STATUS_READY)
      } catch (e) {
        if (e.response.status === 400) {
          NextcloudGuiApiService.displayError(Translations.TRANSLATION_ERROR_WRONG_INPUT)
        } else {
          NextcloudGuiApiService.displayError(Translations.TRANSLATION_UNEXPECTED_ERROR_SAVE)
        }
        await dispatch(LOAD_FAVORITE_LANGUAGES)
      }
    }
  }
})
