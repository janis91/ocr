import '../../GlobalMocks.mock'
import { mount, Wrapper } from '@vue/test-utils'
import Hint from '@/common/components/Hint.vue'

describe('Hint.vue', () => {
  let wrapper: Wrapper<any>

  beforeEach(() => {
    wrapper = mount(Hint, {
      propsData: {
        hint: 'Test Hint.'
      }
    })
  })

  it('WHEN Hint is mounted, THEN matches snapshot with test text.', async () => {
    expect(wrapper.text()).toContain('Test Hint.')
    expect(wrapper.element).toMatchSnapshot()
  })
})
