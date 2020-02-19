import '../../GlobalMocks.mock'
import { mount, Wrapper } from '@vue/test-utils'
import Check from '@a/components/Check.vue'

describe('Check.vue', () => {
  let wrapper: Wrapper<any>

  beforeEach(() => {
    wrapper = mount(Check, {
      propsData: {
        disabled: false,
        filesCount: 1,
        value: false
      }
    })
  })

  it('GIVEN file count 1 and value = false, WHEN mounted, THEN displays text for single file.', async () => {
    expect(wrapper.text()).toContain('Delete original file (image)')
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBeFalsy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN file count 2, WHEN mounted, THEN displays text for multiple files.', async () => {
    wrapper.setProps({ filesCount: 2 })

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Delete original files (images)')
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN standard props, WHEN mounted AND checked AND unchecked, THEN displays text for single file and emits events.', async () => {
    wrapper.find('input').setChecked(true)

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input.length).toBe(1)
    expect(wrapper.emitted().input[0][0]).toBeTruthy()

    wrapper.find('input').setChecked(false)

    await wrapper.vm.$nextTick()

    expect(wrapper.emitted().input).toBeTruthy()
    expect(wrapper.emitted().input.length).toBe(2)
    expect(wrapper.emitted().input[1][0]).toBeFalsy()
  })

  it('GIVEN standard props, WHEN mounted AND checked AND unchecked, THEN displays text for single file and emits events.', async () => {
    wrapper = mount(Check, {
      propsData: {
        disabled: false,
        filesCount: 1,
        value: true
      }
    })

    expect((wrapper.find('input').element as HTMLInputElement).checked).toBeTruthy()
  })
})
