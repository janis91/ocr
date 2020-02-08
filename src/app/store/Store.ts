import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { AxiosResponse } from 'axios'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'
import { Translations } from '@a/configuration/Translations'
import { Util } from '@/common/Util'
import { StoreOptions } from 'vuex'

export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'
export const LOAD_FAVORITE_LANGUAGES = 'LOAD_FAVORITE_LANGUAGES'
const SET_FAVORITE_LANGUAGES = 'SET_FAVORITE_LANGUAGES'
export const UPDATE_SELECTED_LANGUAGES = 'UPDATE_SELECTED_LANGUAGES'
export const CLEAR_SELECTED_LANGUAGES = 'CLEAR_SELECTED_LANGUAGES'
export const SET_PROCESSING = 'SET_PROCESSING'
const SET_FINISHED = 'SET_FINISHED'
export const STOP_PROCESS_AND_RESET_MODAL_STATE = 'STOP_PROCESS_AND_RESET_MODAL_STATE'
export const SET_SELECTED_FILES = 'SET_SELECTED_FILES'
export const CLEAR_SELECTED_FILES = 'CLEAR_SELECTED_FILES'

export interface State {
  selectedFiles: OCAFile[];
  favoriteLanguages: Map<string, string>;
  showModal: boolean;
  selectedLanguages: Map<string, string>;
  processing: boolean;
}

export default {
  strict: true,
  state: {
    selectedFiles: [] as OCAFile[],
    favoriteLanguages: new Map<string, string>(),
    showModal: false as boolean,
    selectedLanguages: new Map<string, string>(),
    processing: false as boolean
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
    [SET_PROCESSING](state) {
      state.processing = true
    },
    [SET_FINISHED](state) {
      state.processing = false
    },
    [SET_SELECTED_FILES](state, payload: {selectedFiles: OCAFile[]}) {
      state.selectedFiles = payload.selectedFiles
    },
    [CLEAR_SELECTED_FILES](state) {
      state.selectedFiles = []
    },
    [SET_FAVORITE_LANGUAGES](state, payload: { favoriteLanguages: Map<string, string> }) {
      state.favoriteLanguages = payload.favoriteLanguages
      state.selectedLanguages = payload.favoriteLanguages
    },
    [UPDATE_SELECTED_LANGUAGES](state, payload: { selectedLanguages: Map<string, string> }) {
      state.selectedLanguages = payload.selectedLanguages
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
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Unexpected error while loading favorite languages', e)
        NextcloudGuiApiService.displayError(Translations.TRANSLATION_UNEXPECTED_ERROR_LOAD_FAVORITE_LANGUAGES)
      }
    },
    [STOP_PROCESS_AND_RESET_MODAL_STATE]({ commit, state }) {
      commit(SET_FINISHED)
      commit(HIDE_MODAL)
      commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: state.favoriteLanguages })
    }
  }
} as StoreOptions<State>
