import '../../GlobalMocks.mock'
import { createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import StoreConfig, { State, SET_FAVORITE_LANGUAGES, CLEAR_FAVORITE_LANGUAGES, LOAD_FAVORITE_LANGUAGES, SAVE_FAVORITE_LANGUAGES } from '@s/store/Store'
import { cloneDeep } from 'lodash'
import { Util } from '@/common/Util'
import { generateUrl } from '@nextcloud/router'
import axios from '@nextcloud/axios'
import { NextcloudGuiApiService } from '@s/services/NextcloudGuiApiService'

jest.mock('@/common/Util')
jest.mock('@nextcloud/axios')
jest.mock('@nextcloud/router')
jest.mock('@s/services/NextcloudGuiApiService')

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
    describe('loading', () => {
      it('WHEN SET_STATUS_LOAD is commited, THEN loading is set to true.', () => {
        expect(store.state.loading).toBeTruthy()

        store.commit('SET_STATUS_LOAD')

        expect(store.state.loading).toBeTruthy()
      })

      it('WHEN SET_STATUS_READY is commited, THEN loading is set to false.', () => {
        expect(store.state.loading).toBeTruthy()

        store.commit('SET_STATUS_READY')

        expect(store.state.loading).toBeFalsy()
      })

      it('GIVEN SET_STATUS_LOAD has been commited, WHEN HIDE_MODAL is commited, THEN loading is set to true after all.', () => {
        expect(store.state.loading).toBeTruthy()

        store.commit('SET_STATUS_READY')

        expect(store.state.loading).toBeFalsy()

        store.commit('SET_STATUS_LOAD')

        expect(store.state.loading).toBeTruthy()
      })
    })

    describe('favoriteLanguages', () => {
      it('WHEN SET_FAVORITE_LANGUAGES is commited with favoriteLanguages = Map("deu" => "German"), THEN favoriteLanguages is set to this map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['deu', 'German']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
      })

      it('WHEN SET_FAVORITE_LANGUAGES is commited with favoriteLanguages = Map("deu" => "German", "eng" => "English"), THEN favoriteLanguages is set to this map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['deu', 'German'], ['eng', 'English']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German'], ['eng', 'English']]))
      })

      it('GIVEN favoriteLanguages = Map("deu" => "German"), WHEN SET_FAVORITE_LANGUAGES is commited with favoriteLanguages = Map(), THEN favoriteLanguages is set to this map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['deu', 'German']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map() })

        expect(store.state.favoriteLanguages).toEqual(new Map())
      })

      it('GIVEN favoriteLanguages = Map("deu" => "German"), WHEN CLEAR_FAVORITE_LANGUAGES is commited, THEN favoriteLanguages is set to an empty map.', () => {
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['deu', 'German']]) })

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))

        store.commit(CLEAR_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map())
      })
    })
  })

  describe('getters', () => {
    describe('selectedOptions', () => {
      it('GIVEN a favorite language has been commited, WHEN selectedOptions is called, THEN returns that language as option.', () => {
        (Util.mapToOptions as jest.Mock).mockReturnValueOnce(['deu'])
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['deu', 'German']]) })
        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))

        expect(store.getters.selectedOptions).toEqual(['deu'])
        expect(Util.mapToOptions).toHaveBeenCalledWith(new Map([['deu', 'German']]))
      })

      it('GIVEN initial state, WHEN selectedOptions is called, THEN returns that empty array.', () => {
        (Util.mapToOptions as jest.Mock).mockReturnValueOnce([])
        expect(store.state.favoriteLanguages).toEqual(new Map())

        expect(store.getters.selectedOptions).toEqual([])
        expect(Util.mapToOptions).toHaveBeenCalledWith(new Map())
      })
    })
  })

  describe('actions on', () => {
    describe('LOAD_FAVORITE_LANGUAGES', () => {
      it('GIVEN initial state AND axios responds with a language = "deu", WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are set to corresponding value.', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German']]))
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu'])
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN favoriteLanguages and selectedLanguages = Map("eng" => "English") AND axios responds with languages = ["deu", "spa"], WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are set to corresponding value.', async () => {
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu', 'spa'] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German'], ['spa', 'Spanish']]))
        expect(store.state.favoriteLanguages).toEqual(new Map())

        store.commit('SET_FAVORITE_LANGUAGES', { favoriteLanguages: new Map([['eng', 'English']]) })
        expect(store.state.favoriteLanguages).toEqual(new Map([['eng', 'English']]))

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German'], ['spa', 'Spanish']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu', 'spa'])
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN initial state AND axios throws an Error, WHEN LOAD_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are left unchanged AND error is displayed.', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('test'));
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (NextcloudGuiApiService.displayError as jest.Mock).mockImplementationOnce(() => {})
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(LOAD_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(Util.mapToCommonLanguages).not.toHaveBeenCalled()
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
        expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('An unexpected error occured during load of your favorite languages. Please try again.')
      })
    })

    describe('SAVE_FAVORITE_LANGUAGES', () => {
      it('GIVEN initial state AND axios responds without an empty array, WHEN SAVE_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are set to corresponding value.', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: [] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map())
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(SAVE_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map())
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith([])
        expect(axios.post).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages', { favoriteLanguages: '[]' })
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN SET_FAVORITE_LANGUAGES has been commited with Map("eng" => "English") AND axios responds without another language (just test this effect here), WHEN SAVE_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are set to corresponding value.', async () => {
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
        (generateUrl as jest.Mock).mockReturnValueOnce('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German']]))

        store.commit(SET_FAVORITE_LANGUAGES, { favoriteLanguages: new Map([['eng', 'English']]) })
        expect(store.state.favoriteLanguages).toEqual(new Map([['eng', 'English']]))

        await store.dispatch(SAVE_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu'])
        expect(axios.post).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages', { favoriteLanguages: '["eng"]' })
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
      })

      it('GIVEN initial state AND axios responds with an error 400 to post AND with "deu" to get, WHEN SAVE_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are loaded again and set correctly AND displays error message.', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 400 } });
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
        (generateUrl as jest.Mock).mockReturnValue('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German']]));
        (NextcloudGuiApiService.displayError as jest.Mock).mockImplementationOnce(() => {})
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(SAVE_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu'])
        expect(axios.post).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages', { favoriteLanguages: '[]' })
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
        expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('An error occured during save of your favorite languages. Please check your input.')
      })

      it('GIVEN initial state AND axios responds with an error 500 to post AND with "deu" to get, WHEN SAVE_FAVORITE_LANGUAGES is dispatched, THEN favoriteLanguages are loaded again and set correctly AND displays error message.', async () => {
        (axios.post as jest.Mock).mockRejectedValueOnce({ response: { status: 500 } });
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
        (generateUrl as jest.Mock).mockReturnValue('http://test.com/apps/ocr/api/personal/languages');
        (Util.mapToCommonLanguages as jest.Mock).mockReturnValueOnce(new Map([['deu', 'German']]));
        (NextcloudGuiApiService.displayError as jest.Mock).mockImplementationOnce(() => {})
        expect(store.state.favoriteLanguages).toEqual(new Map())

        await store.dispatch(SAVE_FAVORITE_LANGUAGES)

        expect(store.state.favoriteLanguages).toEqual(new Map([['deu', 'German']]))
        expect(Util.mapToCommonLanguages).toHaveBeenCalledWith(['deu'])
        expect(axios.post).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages', { favoriteLanguages: '[]' })
        expect(axios.get).toHaveBeenCalledWith('http://test.com/apps/ocr/api/personal/languages')
        expect(generateUrl).toHaveBeenCalledWith('/apps/ocr/api/personal/languages')
        expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('An unexpected error occured during save of your favorite languages. Please try again.')
      })
    })
  })
})
