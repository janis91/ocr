import '../../GlobalMocks.mock'
import { NextcloudGuiApiService as cut } from '@a/services/NextcloudGuiApiService'

describe('NextcloudGuiApiService', () => {
  describe('displayError()', () => {
    it('GIVEN the message = "message", WHEN displayError is called, THEN returns nothing and displays the error message.', () => {
      cut.displayError('message')

      expect((OC.Notification.showHtml as jest.Mock)).toHaveBeenCalledWith('<div>OCR: message</div>', { timeout: 10, type: 'error' })
    })
  })
})
