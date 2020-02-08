import '../GlobalMocks.mock'
import axios from '@nextcloud/axios'
import { FileFixtures } from '../fixtures/FileFixtures'

// eslint-disable-next-line import/first
import '@a/init'

jest.mock('@nextcloud/axios')
jest.mock('@nextcloud/router')

let actionHandler: (...args: any[]) => void;

(axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] });
(OCA.Files.fileActions.registerAction as jest.Mock).mockImplementationOnce((obj: any) => {
  actionHandler = obj.actionHandler
});
(OCA.Files.App.fileList.$fileList.on as jest.Mock).mockReturnValueOnce(undefined)
const click = { click: jest.fn() };
(OCA.Files.App.fileList.$el.find as jest.Mock).mockReturnValueOnce(click)

describe('initialization', () => {
  it('GIVEN mocked OCA and OC functions, WHEN init is imported, THEN app, view and store are correctly setup.', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(document.getElementById('ocr-view')).toBeDefined()
    expect(OCA.Ocr.app).toBeDefined()
    expect(OCA.Ocr.store).toBeDefined()
    expect(OCA.Ocr.view).toBeDefined()
    expect(OCA.Ocr.store.state.showModal).toBeFalsy()

    const context = { fileInfoModel: { attributes: FileFixtures.PNG } }
    actionHandler(null, context)

    expect(OCA.Ocr.store.state.showModal).toBeTruthy()
  })
})
