import '../../GlobalMocks.mock'
import { mount, Wrapper } from '@vue/test-utils'
import Loading from '@a/components/Loading.vue'

describe('Loading.vue', () => {
  let wrapper: Wrapper<any>

  beforeEach(() => {
    wrapper = mount(Loading, {
      propsData: {
        filesQueued: 1,
        successfullyProcessed: 0
      }
    })
  })

  it('GIVEN standard props, WHEN Loading is mounted, THEN matches snapshot with translation for files queued and processed.', async () => {
    expect(wrapper.contains('span.icon-loading')).toBeTruthy()
    expect(wrapper.element).toMatchSnapshot()
  })
})
