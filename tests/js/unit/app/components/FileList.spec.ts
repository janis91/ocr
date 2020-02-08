import { mount, Wrapper } from '@vue/test-utils'
import FileList from '@a/components/FileList.vue'
import { FileFixtures } from '../../fixtures/FileFixtures'

describe('FileList.vue', () => {
  let wrapper: Wrapper<any>

  beforeEach(() => {
    wrapper = mount(FileList, {
      propsData: {
        files: []
      }
    })
  })

  it('GIVEN standard props, WHEN FileList is mounted, THEN matches snapshot with zero list items.', async () => {
    expect(wrapper.contains('li')).toBeFalsy()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN one file in list, WHEN FileList is mounted, THEN matches snapshot with one list item.', async () => {
    wrapper.setProps({ files: [FileFixtures.PNG] })

    await wrapper.vm.$nextTick()

    expect(wrapper.contains('li')).toBeTruthy()
    expect(wrapper.text()).toContain(FileFixtures.PNG.name)
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN five files in list, WHEN FileList is mounted, THEN matches snapshot with five list items.', async () => {
    wrapper.setProps({ files: FileFixtures.ALLOWED })

    await wrapper.vm.$nextTick()

    expect(wrapper.contains('li')).toBeTruthy()
    FileFixtures.ALLOWED.forEach(({ name }) => expect(wrapper.text()).toContain(name))
    expect(wrapper.element).toMatchSnapshot()
  })

  it('GIVEN six files in list, WHEN FileList is mounted, THEN matches snapshot with five list items plus "..." as last item.', async () => {
    wrapper.setProps({ files: [...FileFixtures.ALLOWED, FileFixtures.ADDITIONAL_PNG] })

    await wrapper.vm.$nextTick()

    expect(wrapper.contains('li')).toBeTruthy()
    FileFixtures.ALLOWED.forEach(({ name }) => expect(wrapper.text()).toContain(name))
    expect(wrapper.text()).not.toContain(FileFixtures.ADDITIONAL_PNG.name)
    expect(wrapper.text()).toContain('...')
    expect(wrapper.element).toMatchSnapshot()
  })
})
