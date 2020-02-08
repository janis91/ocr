import '../../GlobalMocks.mock'
import { createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import StoreConfig, { SHOW_MODAL, HIDE_MODAL, SET_PROCESSING, SET_SELECTED_FILES, CLEAR_SELECTED_FILES, State, UPDATE_SELECTED_LANGUAGES, CLEAR_SELECTED_LANGUAGES, STOP_PROCESS_AND_RESET_MODAL_STATE, LOAD_FAVORITE_LANGUAGES } from '@a/store/Store'
import { cloneDeep } from 'lodash'
import { FileFixtures } from '../../fixtures/FileFixtures'
import { Util } from '@/common/Util'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'

jest.mock('@/common/Util')
jest.mock('@nextcloud/axios')
jest.mock('@nextcloud/router')
jest.mock('@a/services/NextcloudGuiApiService')

describe('Store', () => {
  let localVue: typeof Vue
  let store: Store<State>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    store = new Vuex.Store(cloneDeep(StoreConfig))
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('mutations on', () => {
    describe('showModal', () => {
      it('WHEN SHOW_MODAL is commited, THEN showModal is set to true.', () => {
        expect(store.state.showModal).toBeFalsy()

        store.commit(SHOW_MODAL)

        expect(store.state.showModal).toBeTruthy()
      })

      it('WHEN HIDE_MODAL is commited, THEN showModal is set to false.', () => {
        expect(store.state.showModal).toBeFalsy()

        store.commit(HIDE_MODAL)

        expect(store.state.showModal).toBeFalsy()
      })

      it('GIVEN SHOW_MODAL has been commited, WHEN HIDE_MODAL is commited, THEN showModal is set to false after all.', () => {
        expect(store.state.showModal).toBeFalsy()

        store.commit(SHOW_MODAL)

        expect(store.state.showModal).toBeTruthy()

        store.commit(HIDE_MODAL)

        expect(store.state.showModal).toBeFalsy()
      })
    })

    describe('processing', () => {
      it('WHEN SET_PROCESSING is commited, THEN processing is set to true.', () => {
        expect(store.state.processing).toBeFalsy()

        store.commit(SET_PROCESSING)

        expect(store.state.processing).toBeTruthy()
      })

      it('WHEN SET_FINISHED is commited, THEN processing is set to false.', () => {
        expect(store.state.processing).toBeFalsy()

        store.commit('SET_FINISHED')

        expect(store.state.processing).toBeFalsy()
      })

      it('GIVEN SET_PROCESSING has been commited, WHEN SET_FINISHED is commited, THEN processing is set to false after all.', () => {
        expect(store.state.processing).toBeFalsy()

        store.commit(SET_PROCESSING)

        expect(store.state.processing).toBeTruthy()

        store.commit('SET_FINISHED')

        expect(store.state.processing).toBeFalsy()
      })
    })

    describe('selectedFiles', () => {
      it('WHEN SET_SELECTED_FILES is commited with a single file in the array, THEN selectedFiles is set to that array.', () => {
        expect(store.state.selectedFiles).toEqual([])

        store.commit(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG] })

        expect(store.state.selectedFiles).toEqual([FileFixtures.PNG])
      })

      it('WHEN SET_SELECTED_FILES is commited with multiple files in the array, THEN selectedFiles is set to that array.', () => {
        expect(store.state.selectedFiles).toEqual([])

        store.commit(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG, FileFixtures.BMP] })

        expect(store.state.selectedFiles).toEqual([FileFixtures.PNG, FileFixtures.BMP])
      })

      it('GIVEN a file has been commited, WHEN SET_SELECTED_FILES is commited with an empty array, THEN selectedFiles is set to that empty array.', () => {
        expect(store.state.selectedFiles).toEqual([])

        store.commit(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG] })

        expect(store.state.selectedFiles).toEqual([FileFixtures.PNG])

        store.commit(SET_SELECTED_FILES, { selectedFiles: [] })

        expect(store.state.selectedFiles).toEqual([])
      })

      it('GIVEN a file has been commited, WHEN CLEAR_SELECTED_FILES is commited, THEN selectedFiles is set to an empty array.', () => {
        expect(store.state.selectedFiles).toEqual([])

        store.commit(SET_SELECTED_FILES, { selectedFiles: [FileFixtures.PNG] })

        expect(store.state.selectedFiles).toEqual([FileFixtures.PNG])

        store.commit(CLEAR_SELECTED_FILES)

        expect(store.state.selectedFiles).toEqual([])
      })
    })

    describe('favoriteLanguages', () => {
      it('WHEN SET_FAVORITE_LANGUAGES is commited with empty Map, THEN favoriteLanguages AND selectedLanguages are both set to that map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map() })

        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('WHEN SET_FAVORITE_LANGUAGES is commited with a Map with a language, THEN favoriteLanguages AND selectedLanguages are both set to that map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['deu', 'German']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))
      })

      it('WHEN SET_FAVORITE_LANGUAGES is commited with a Map with two languages, THEN favoriteLanguages AND selectedLanguages are both set to that map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['deu', 'German'], ['eng', 'English']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))
        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))
      })

      it('GIVEN a Map with two languages has been commited, WHEN SET_FAVORITE_LANGUAGES is commited with an empty Map, THEN favoriteLanguages AND selectedLanguages are both set to an empty map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['deu', 'German'], ['eng', 'English']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))
        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map() })

        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(store.state.selectedLanguages).toEqual(new Map())
      })
    })

    describe('selectedLanguages', () => {
      it('WHEN UPDATE_SELECTED_LANGUAGES is commited with a language option, THEN selectedLanguages is set to a map with that option.', () => {
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))
      })

      it('WHEN UPDATE_SELECTED_LANGUAGES is commited without language option, THEN selectedLanguages is set to an empty map.', () => {
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map() })

        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('WHEN CLEAR_SELECTED_LANGUAGES is commited, THEN selectedLanguages is set to an empty map.', () => {
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit(CLEAR_SELECTED_LANGUAGES)

        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('GIVEN a Map with a language has been commited, WHEN CLEAR_SELECTED_LANGUAGES is commited, THEN selectedLanguages is set to an empty map.', () => {
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))

        store.commit(CLEAR_SELECTED_LANGUAGES)

        expect(store.state.selectedLanguages).toEqual(new Map())
      })
    })
  })

  describe('getters', () => {
    describe('selectedOptions', () => {
      it('GIVEN a selected language has been commited, WHEN selectedOptions is called, THEN returns that language as option.', () => {
        (Util.mapToOptions as jest.Mock).mockReturnValueOnce(['deu'])
        expect(store.state.selectedLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })
        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))

        expect(store.getters.selectedOptions).toEqual(['deu'])
        expect(Util.mapToOptions).toHaveBeenCalledWith(new Map([['deu', 'German']]))
      })

      it('GIVEN initial state, WHEN selectedOptions is called, THEN returns that empty array.', () => {
        (Util.mapToOptions as jest.Mock).mockReturnValueOnce([])
        expect(store.state.selectedLanguages).toEqual(new Map())

        expect(store.getters.selectedOptions).toEqual([])
        expect(Util.mapToOptions).toHaveBeenCalledWith(new Map())
      })
    })
  })

  describe('actions', () => {
    describe('STOP_PROCESS_AND_RESET_MODAL_STATE', () => {
      it('GIVEN initial state, WHEN STOP_PROCESS_AND_RESET_MODAL_STATE is dispatched, THEN processing is set to false AND showModal is set to false AND selectedLanguages is set to favoriteLanguages.', () => {
        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.dispatch(STOP_PROCESS_AND_RESET_MODAL_STATE)

        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('GIVEN processing = false AND showModal = false AND selectedLanguages = Map("deu" => "German") AND favoriteLanguages is empty, WHEN STOP_PROCESS_AND_RESET_MODAL_STATE is dispatched, THEN processing is set to false AND showModal is set to false AND selectedLanguages is set to favoriteLanguages.', () => {
        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))

        store.dispatch(STOP_PROCESS_AND_RESET_MODAL_STATE)

        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('GIVEN processing = true AND showModal = true AND selectedLanguages = Map("deu" => "German") AND favoriteLanguages is empty, WHEN STOP_PROCESS_AND_RESET_MODAL_STATE is dispatched, THEN processing is set to false AND showModal is set to false AND selectedLanguages is set to favoriteLanguages.', () => {
        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })
        store.commit(SHOW_MODAL)
        store.commit(SET_PROCESSING)

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))
        expect(store.state.processing).toBeTruthy()
        expect(store.state.showModal).toBeTruthy()

        store.dispatch(STOP_PROCESS_AND_RESET_MODAL_STATE)

        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
      })

      it('GIVEN processing = true AND showModal = true AND selectedLanguages = Map("deu" => "German") AND favoriteLanguages = Map("eng" => "English"), WHEN STOP_PROCESS_AND_RESET_MODAL_STATE is dispatched, THEN processing is set to false AND showModal is set to false AND selectedLanguages is set to favoriteLanguages.', () => {
        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['eng', 'English']]) })
        store.commit(UPDATE_SELECTED_LANGUAGES, { selectedLanguages: new Map([['deu', 'German']]) })
        store.commit(SHOW_MODAL)
        store.commit(SET_PROCESSING)

        expect(store.state.favoriteLanguages).toEqual(new Map([['eng', 'English']]))
        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))
        expect(store.state.processing).toBeTruthy()
        expect(store.state.showModal).toBeTruthy()

        store.dispatch(STOP_PROCESS_AND_RESET_MODAL_STATE)

        expect(store.state.processing).toBeFalsy()
        expect(store.state.showModal).toBeFalsy()
        expect(store.state.selectedLanguages).toEqual(new Map([['eng', 'English']]))
      })
    })

    describe('LOAD_FAVORITE_LANGUAGES', () => {
      it('GIVEN initial state AND axios responds with a language = "deu", WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages AND selectedLanguages are set to corresponding value.', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German']]))
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German']]))
        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu'])
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN favoriteLanguages and selectedLanguages = Map("eng" => "English") AND axios responds with languages = ["deu", "spa"], WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages AND selectedLanguages are set to corresponding value.', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu', 'spa'] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German'], ['spa', 'Spanish']]))
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['eng', 'English']]) })
        expect(store.state.selectedLanguages).toEqual(new Map([['eng', 'English']]))
        expect(store.state.favoriteLanguages).toEqual(new Map([['eng', 'English']]))

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.selectedLanguages).toEqual(new Map([['deu', 'German'], ['spa', 'Spanish']]))
        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German'], ['spa', 'Spanish']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu', 'spa'])
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN initial state AND axios throws an Error, WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages AND selectedLanguages are left unchanged AND error is displayed.', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('test'));
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (NextcloudGuiApiService.displayError as jest.Mock).mockImplementationOnce(() => {})
        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.selectedLanguages).toEqual(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(Util.mapToCommonLanguages).not.toHaveBeenCalled()
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
        expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('An unexpected error occured during the load of your favorite languages. No language will be set instead.')
      })
    })
  })
})
