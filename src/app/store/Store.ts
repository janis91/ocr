import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { AxiosResponse } from 'axios'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'
import { Translations } from '@a/configuration/Translations'
import { Util, LanguageOption } from '@/common/Util'

Vue.use(Vuex)

export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'
export const LOAD_FAVORITE_LANGUAGES = 'LOAD_FAVORITE_LANGUAGES'
const SET_FAVORITE_LANGUAGES = 'SET_FAVORITE_LANGUAGES'
export const UPDATE_SELECTED_LANGUAGES = 'UPDATE_SELECTED_LANGUAGES'
export const CLEAR_SELECTED_LANGUAGES = 'CLEAR_SELECTED_LANGUAGES'

export default new Store({
  strict: true,
  state: {
    selectedFiles: [] as OCAFile[],
    favoriteLanguages: new Map<string, string>(),
    showModal: false as boolean,
    selectedLanguages: new Map<string, string>()
  },
  getters: {
    selectedOptions(state) {
      return Util.mapToOptions(state.selectedLanguages)
    }
  },
  mutations: {
    [SHOW_MODAL](state) {
      state.showModal = true
    },
    [HIDE_MODAL](state) {
      state.showModal = false
    },
    [SET_FAVORITE_LANGUAGES](state, payload: {favoriteLanguages: Map<string, string>}) {
      state.favoriteLanguages = payload.favoriteLanguages
      state.selectedLanguages = payload.favoriteLanguages
    },
    [UPDATE_SELECTED_LANGUAGES](state, payload: { selectedLanguages: LanguageOption[] }) {
      state.selectedLanguages = Util.mapOptionsToLanguages(payload.selectedLanguages)
    },
    [CLEAR_SELECTED_LANGUAGES](state) {
      state.selectedLanguages = new Map()
    }
  },
  actions: {
    async [LOAD_FAVORITE_LANGUAGES]({ commit }) {
      try {
        const { data } = await axios.get<any, AxiosResponse<string[]>>(generateUrl('/apps/ocr/api/personal/languages'))
        const favoriteLanguages = Util.mapToCommonLanguages(data)
        commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages })
        commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: favoriteLanguages })
      } catch (e) {
        NextcloudGuiApiService.displayError(Translations.TRANSLATION_UNEXPECTED_ERROR_LOAD_FAVORITE_LANGUAGES)
      }
    }
  }
})
// TODO: process finished: reset selectedLanguages to favoriteLanguages
