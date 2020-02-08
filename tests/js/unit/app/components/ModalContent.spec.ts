import '../../GlobalMocks.mock'
import { shallowMount, Wrapper, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import ModalContent from '@a/components/ModalContent.vue'
import { MultiSelectEvents } from '@/common/components/MultiSelectEvents'
import { FileFixtures } from '../../fixtures/FileFixtures'
import { STOP_PROCESS_AND_RESET_MODAL_STATE, State, UPDATE_SELECTED_LANGUAGES, CLEAR_SELECTED_LANGUAGES, SET_PROCESSING } from '@a/store/Store'
import { NextcloudGuiApiService } from '@a/services/NextcloudGuiApiService'
import { TesseractError } from '@a/error/TesseractError'

jest.mock('@a/services/NextcloudGuiApiService')

describe('ModalContent.vue', () => {
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
      processing: false,
      selectedFiles: [FileFixtures.PNG]
    }
    mutations = {
      [UPDATE_SELECTED_LANGUAGES]: jest.fn(),
      [CLEAR_SELECTED_LANGUAGES]: jest.fn(),
      [SET_PROCESSING]: jest.fn()
    }
    actions = {
      [STOP_PROCESS_AND_RESET_MODAL_STATE]: jest.fn()
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
    wrapper = shallowMount(ModalContent, { store, localVue });
    (OCA.Ocr as any) = {
      app: {
        process: jest.fn(() => { throw new Error('Mock behavior not defined') })
      }
    }
  })

  it('GIVEN standard state, WHEN ModalContent is mounted, THEN matches snapshot with button to trigger process and without loading indicator.', async () => {
    expect(wrapper.contains('button')).toBeTruthy()
    expect(wrapper.contains('loading')).toBeFalsy()
    expect(wrapper.find('check-stub').attributes()['disabled']).toBeFalsy()
    expect(wrapper.find('multi-select-stub').attributes()['disabled']).toBeFalsy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN state with processing = true, WHEN ModalContent is mounted, THEN matches snapshot with loading indicator instead of button.', async () => {
    state.processing = true
    const store = new Vuex.Store({
      strict: true,
      state,
      actions,
      getters,
      mutations
    })
    wrapper = shallowMount(ModalContent, { store, localVue })
    expect(wrapper.contains('button')).toBeFalsy()
    expect(wrapper.contains('loading-stub')).toBeTruthy()
    expect(wrapper.find('check-stub').attributes()['disabled']).toBeTruthy()
    expect(wrapper.find('multi-select-stub').attributes()['disabled']).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN standard state, WHEN ModalContent is mounted AND check-stub @input emits true, THEN replace is set to true.', async () => {
    expect(wrapper.vm.replace).toBeFalsy()
    wrapper.find('check-stub').vm.$emit('input', true)

    await wrapper.vm.$nextTick()

    expect(wrapper.vm.replace).toBeTruthy()
  })

  it('GIVEN standard state, WHEN ModalContent is mounted AND multi-select @update-langs emits Map(), THEN correpsonding store mutation is commited.', async () => {
    wrapper.find('multi-select-stub').vm.$emit(MultiSelectEvents.UPDATE_LANGS, new Map())

    await wrapper.vm.$nextTick()

    expect(mutations[UPDATE_SELECTED_LANGUAGES]).toHaveBeenCalledWith(state, { selectedLanguages: new Map() })
  })

  it('GIVEN standard state, WHEN ModalContent is mounted AND multi-select @clear-all emits, THEN correpsonding store mutation is commited.', async () => {
    wrapper.find('multi-select-stub').vm.$emit(MultiSelectEvents.CLEAR_ALL)

    await wrapper.vm.$nextTick()

    expect(mutations[CLEAR_SELECTED_LANGUAGES]).toHaveBeenCalledWith(state, undefined)
  })

  it('GIVEN standard state AND ocr process resolves, WHEN ModalContent is mounted AND button is clicked, THEN corresponding actions and process is triggered.', async () => {
    (OCA.Ocr.app.process as jest.Mock).mockImplementationOnce(() => Promise.resolve())
    wrapper.vm.replace = true
    expect(wrapper.vm.successfullyProcessed).toBe(0)

    wrapper.find('button').trigger('click')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(mutations[SET_PROCESSING]).toHaveBeenCalled()
    expect(actions[STOP_PROCESS_AND_RESET_MODAL_STATE]).toHaveBeenCalled()
    expect(wrapper.vm.successfullyProcessed).toBe(0)
    expect(wrapper.vm.replace).toBeFalsy()
    expect(OCA.Ocr.app.process).toHaveBeenCalledWith(FileFixtures.PNG, ['deu'], true)
  })

  it('GIVEN standard state AND ocr process rejects, WHEN ModalContent is mounted AND button is clicked, THEN corresponding actions are triggered and displays error.', async () => {
    (OCA.Ocr.app.process as jest.Mock).mockImplementationOnce(() => Promise.reject(new TesseractError('test')));
    (NextcloudGuiApiService.displayError as jest.Mock).mockImplementationOnce(() => {})
    wrapper.vm.replace = false
    wrapper.vm.successfullyProcessed = 1

    wrapper.find('button').trigger('click')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(mutations[SET_PROCESSING]).toHaveBeenCalled()
    expect(actions[STOP_PROCESS_AND_RESET_MODAL_STATE]).toHaveBeenCalled()
    expect(wrapper.vm.successfullyProcessed).toBe(0)
    expect(wrapper.vm.replace).toBeFalsy()
    expect(OCA.Ocr.app.process).toHaveBeenCalledWith(FileFixtures.PNG, ['deu'], false)
    expect(NextcloudGuiApiService.displayError).toHaveBeenCalledWith('OCR processing failed: test')
  })
})
