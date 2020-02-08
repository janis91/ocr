import '../GlobalMocks.mock'
import { shallowMount, Wrapper, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import App from '@a/App.vue'
import { State, HIDE_MODAL } from '@a/store/Store'
import { FileFixtures } from '../fixtures/FileFixtures'

describe('MultiSelect', () => {
  let wrapper: Wrapper<any>
  let localVue: typeof Vue
  let mutations: any
  let state: Partial<State>

  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
    state = {
      processing: false,
      selectedFiles: [FileFixtures.PNG],
      showModal: true
    }
    mutations = {
      [HIDE_MODAL]: jest.fn()
    }
    const store = new Vuex.Store({
      strict: true,
      state,
      mutations
    })
    wrapper = shallowMount(App, { store, localVue })
  })

  it('GIVEN standard state, WHEN snapshot is taken, THEN matches snapshot (modal).', async () => {
    expect(wrapper.vm.canClose).toBeTruthy()
    expect(wrapper.vm.show).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN state with showModal = false, WHEN snapshot is taken, THEN matches snapshot (no modal).', async () => {
    state.showModal = false
    const store = new Vuex.Store({
      strict: true,
      state,
      mutations
    })
    wrapper = shallowMount(App, { store, localVue })

    expect(wrapper.vm.canClose).toBeTruthy()
    expect(wrapper.vm.show).toBeFalsy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN standard state, WHEN modal emits @close, THEN triggers corresponding mutation.', async () => {
    wrapper.find('modal-stub').vm.$emit('close')

    await wrapper.vm.$nextTick()

    expect(mutations[HIDE_MODAL]).toHaveBeenCalled()
  })
})
