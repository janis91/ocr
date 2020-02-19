import '../GlobalMocks.mock'
import { shallowMount, Wrapper, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import App from '@s/App.vue'
import { MultiSelectEvents } from '@/common/components/MultiSelectEvents'
import { State, CLEAR_FAVORITE_LANGUAGES, SET_FAVORITE_LANGUAGES, SAVE_FAVORITE_LANGUAGES, LOAD_FAVORITE_LANGUAGES } from '@s/store/Store'

describe('App.vue', () => {
  let wrapper: Wrapper<any>
  let localVue: typeof Vue
  let actions: any
  let getters: any
  let mutations: any
  let state: Partial<State>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    state = {
      loading: false
    }
    mutations = {
      [CLEAR_FAVORITE_LANGUAGES]: jest.fn(),
      [SET_FAVORITE_LANGUAGES]: jest.fn()
    }
    actions = {
      [SAVE_FAVORITE_LANGUAGES]: jest.fn(),
      [LOAD_FAVORITE_LANGUAGES]: jest.fn()
    }
    getters = {
      selectedOptions: () => [{ key: 'deu', label: 'German' }]
    }
    const store = new Vuex.Store({
      strict: true,
      state,
      actions,
      getters,
      mutations
    })
    wrapper = shallowMount(App, { store, localVue })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('GIVEN standard state, WHEN App is mounted, THEN matches snapshot with button to trigger save and without loading state.', async () => {
    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1)
    expect(wrapper.contains('multi-select-stub')).toBeTruthy()
    expect(wrapper.contains('button')).toBeTruthy()
    expect(wrapper.find('button').attributes().disabled).toBeFalsy()
    expect(wrapper.find('multi-select-stub').attributes().disabled).toBeFalsy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN state with loading = true, WHEN App is mounted, THEN matches snapshot with button to trigger save and in loading state.', async () => {
    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1);
    (actions[LOAD_FAVORITE_LANGUAGES] as jest.Mock).mockClear()
    state.loading = true
    const store = new Vuex.Store({
      strict: true,
      state,
      actions,
      getters,
      mutations
    })
    wrapper = shallowMount(App, { store, localVue })

    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1)
    expect(wrapper.contains('multi-select-stub')).toBeTruthy()
    expect(wrapper.contains('button')).toBeTruthy()
    expect(wrapper.find('button').attributes().disabled).toBeTruthy()
    expect(wrapper.find('multi-select-stub').attributes().disabled).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN standard state, WHEN App is mounted AND multi-select @update-langs emits Map(), THEN correpsonding store mutation is commited.', async () => {
    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1)
    wrapper.find('multi-select-stub').vm.$emit(MultiSelectEvents.UPDATE_LANGS, new Map())

    await wrapper.vm.$nextTick()

    expect(mutations[SET_FAVORITE_LANGUAGES]).toHaveBeenCalledWith(state, { favoriteLanguages: new Map() })
  })

  it('GIVEN standard state, WHEN App is mounted AND multi-select @clear-all emits, THEN correpsonding store mutation is commited.', async () => {
    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1)
    wrapper.find('multi-select-stub').vm.$emit(MultiSelectEvents.CLEAR_ALL)

    await wrapper.vm.$nextTick()

    expect(mutations[CLEAR_FAVORITE_LANGUAGES]).toHaveBeenCalledWith(state, undefined)
  })

  it('GIVEN standard state, WHEN App is mounted AND save button is clicked, THEN correpsonding store action is dispatched.', async () => {
    expect(actions[LOAD_FAVORITE_LANGUAGES]).toHaveBeenCalledTimes(1)
    wrapper.find('button').trigger('click')

    await wrapper.vm.$nextTick()

    expect(actions[SAVE_FAVORITE_LANGUAGES]).toHaveBeenCalled()
  })
})
