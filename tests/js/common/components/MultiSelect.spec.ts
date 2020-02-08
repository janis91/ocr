import '../../GlobalMocks.mock'
import { mount, Wrapper } from '@vue/test-utils'
import MultiSelect from '@/common/components/MultiSelect.vue'
import { Multiselect } from 'vue-multiselect'

describe('MultiSelect', () => {
  let wrapper: Wrapper<any>

  beforeEach(() => {
    wrapper = mount(MultiSelect, {
      propsData: {
        selectedLanguages: [{ key: 'deu', label: 'German' }],
        disabled: false
      }
    })
  })

  it('GIVEN standard props, WHEN snapshot is taken, THEN matches snapshot.', async () => {
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN selectedLanguages has been set to empty array AND disabled is set, WHEN snapshot is taken, THEN matches snapshot without clear-all option and without selected language AND disabled input.', async () => {
    wrapper.setProps({ selectedLanguages: [], disabled: true })

    await wrapper.vm.$nextTick()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN standard prosp, WHEN Multiselect is emitting empty array as input event, THEN emits new selected language array (empty).', async () => {
    wrapper.find(Multiselect).vm.$emit('input', [])

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['update-langs']).toBeTruthy()
    expect(wrapper.emitted()['update-langs'].length).toBe(1)
    expect(wrapper.emitted()['update-langs'][0][0]).toEqual(new Map())
  })

  it('GIVEN standard prosp, WHEN clear all option is clicked, THEN emits clear event.', async () => {
    wrapper.find('.multiselect__clear').trigger('click')

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['clear-all']).toBeTruthy()
    expect(wrapper.emitted()['clear-all'].length).toBe(1)
  })
})
