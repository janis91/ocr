import '../GlobalMocks.mock'
import axios from '@nextcloud/axios'

const OcrView = document.createElement('div')
OcrView.id = 'ocr-view'
document.body.appendChild(OcrView)

// eslint-disable-next-line import/first
import '@s/init'

jest.mock('@nextcloud/axios')
jest.mock('@nextcloud/router');

(axios.get as jest.Mock).mockResolvedValueOnce({ data: ['deu'] })

describe('initialization', () => {
  it('GIVEN mocked OCA and OC functions, WHEN init is imported, THEN view and store are correctly setup.', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(document.getElementById('ocr-view')).toBeDefined()
    expect(OCA.Ocr.store).toBeDefined()
    expect(OCA.Ocr.view).toBeDefined()
    expect(document.getElementsByTagName('button').item(0)).toBeDefined()
    expect(document.documentElement.innerHTML).toContain('German')
  })
})
