import '../../GlobalMocks.mock'
import { OcaService } from '@a/services/OcaService'
import { OcaError } from '@a/error/OcaError'

describe('OcaService', () => {
  let cut: OcaService

  beforeEach(() => {
    cut = new OcaService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('registerFileActions()', () => {
    it('WHEN registerFileActions is called with a handler function, THEN registerAction is called with expected properties and the handler function.', () => {
      const handler = () => 'test';
      (OCA.Files.fileActions.registerAction as jest.Mock).mockReturnValueOnce(undefined)

      cut.registerFileActions(handler)

      expect(OCA.Files.fileActions.registerAction).toHaveBeenCalledWith({
        actionHandler: handler,
        altText: 'OCR',
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        mime: 'image',
        name: 'Ocr',
        order: 100,
        permissions: 2
      })
    })
  })

  describe('registerCheckBoxEvents()', () => {
    it('WHEN registerCheckBoxEvents is called with a handler function, THEN registers the checkbox events with the handler function.', () => {
      const handler = () => 'test';
      (OCA.Files.App.fileList.$fileList.on as jest.Mock).mockReturnValueOnce(undefined)
      const click = { click: jest.fn() };
      (OCA.Files.App.fileList.$el.find as jest.Mock).mockReturnValueOnce(click)

      cut.registerCheckBoxEvents(handler)

      expect(OCA.Files.App.fileList.$fileList.on).toHaveBeenCalledWith('change', 'td.selection>.selectCheckBox', handler)
      expect(OCA.Files.App.fileList.$el.find).toHaveBeenCalledWith('.select-all')
      expect(click.click).toHaveBeenCalledWith(handler)
    })
  })

  describe('registerMultiSelectMenuItem()', () => {
    it('GIVEN no item has been registered yet, WHEN registerMultiSelectMenuItem is called with a handler function, THEN registers a new multi select menu item with the handler function.', () => {
      const handler = () => 'test';
      (OCA.Files.App.fileList.fileMultiSelectMenu.render as jest.Mock).mockReturnValueOnce(undefined)

      cut.registerMultiSelectMenuItem(handler)

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([{
        action: handler,
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        name: 'ocr'
      }])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).toHaveBeenCalledWith(OCA.Files.App.fileList.multiSelectMenuItems)
    })

    it('GIVEN ocr menu item has not been registered yet, WHEN registerMultiSelectMenuItem is called with a handler function, THEN registers a new multi select menu item with the handler function.', () => {
      const existingItem = {
        action: () => 'cool',
        displayName: 'DELETE',
        iconClass: 'icon-delete',
        name: 'delete'
      }
      OCA.Files.App.fileList.multiSelectMenuItems.push(existingItem)
      const handler = () => 'test';
      (OCA.Files.App.fileList.fileMultiSelectMenu.render as jest.Mock).mockReturnValueOnce(undefined)

      cut.registerMultiSelectMenuItem(handler)

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([existingItem, {
        action: handler,
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        name: 'ocr'
      }])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).toHaveBeenCalledWith(OCA.Files.App.fileList.multiSelectMenuItems)
    })

    it('GIVEN ocr menu item has been registered already, WHEN registerMultiSelectMenuItem is called with a handler function, THEN registers no new multi select menu item.', () => {
      const existingItem = {
        action: () => 'already registered',
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        name: 'ocr'
      }
      OCA.Files.App.fileList.multiSelectMenuItems.push(existingItem)
      const handler = () => 'test'

      cut.registerMultiSelectMenuItem(handler)

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([existingItem])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).not.toHaveBeenCalled()
    })
  })

  describe('unregisterMultiSelectMenuItem()', () => {
    it('GIVEN no item has been registered yet, WHEN unregisterMultiSelectMenuItem is called, THEN returns.', () => {
      cut.unregisterMultiSelectMenuItem()

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).not.toHaveBeenCalled()
    })

    it('GIVEN ocr menu item has not been registered yet, WHEN unregisterMultiSelectMenuItem is called, THEN returns.', () => {
      const existingItem = {
        action: () => 'cool',
        displayName: 'DELETE',
        iconClass: 'icon-delete',
        name: 'delete'
      }
      OCA.Files.App.fileList.multiSelectMenuItems.push(existingItem)

      cut.unregisterMultiSelectMenuItem()

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([existingItem])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).not.toHaveBeenCalled()
    })

    it('GIVEN ocr menu item has been registered, WHEN unregisterMultiSelectMenuItem is called, THEN deletes multi select menu item from items and calls render.', () => {
      const existingItem = {
        action: () => 'already registered',
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        name: 'ocr'
      }
      OCA.Files.App.fileList.multiSelectMenuItems.push(existingItem);
      (OCA.Files.App.fileList.fileMultiSelectMenu.render as jest.Mock).mockReturnValueOnce(undefined)

      cut.unregisterMultiSelectMenuItem()

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).toHaveBeenCalledWith(OCA.Files.App.fileList.multiSelectMenuItems)
    })

    it('GIVEN ocr menu item has been registered in addition to another one, WHEN unregisterMultiSelectMenuItem is called, THEN deletes multi select menu item from items and calls render.', () => {
      const existingItem = {
        action: () => 'already registered',
        displayName: 'OCR',
        iconClass: 'icon-ocr',
        name: 'ocr'
      }
      const otherItem = {
        action: () => 'cool',
        displayName: 'DELETE',
        iconClass: 'icon-delete',
        name: 'delete'
      }
      OCA.Files.App.fileList.multiSelectMenuItems.push(existingItem, otherItem);
      (OCA.Files.App.fileList.fileMultiSelectMenu.render as jest.Mock).mockReturnValueOnce(undefined)

      cut.unregisterMultiSelectMenuItem()

      expect(OCA.Files.App.fileList.multiSelectMenuItems).toEqual([otherItem])
      expect(OCA.Files.App.fileList.fileMultiSelectMenu.render).toHaveBeenCalledWith(OCA.Files.App.fileList.multiSelectMenuItems)
    })
  })

  describe('getCurrentDirectory()', () => {
    it('GIVEN current dir = "/", WHEN getCurrentDirectory is called, THEN returns "/"', () => {
      (OCA.Files.App.fileList.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/')

      const result = cut.getCurrentDirectory()

      expect(result).toEqual('/')
    })

    it('GIVEN current dir = "/test", WHEN getCurrentDirectory is called, THEN returns "/test/"', () => {
      (OCA.Files.App.fileList.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/test')

      const result = cut.getCurrentDirectory()

      expect(result).toEqual('/test/')
    })

    it('GIVEN current dir = "/test/", WHEN getCurrentDirectory is called, THEN returns "/test/"', () => {
      (OCA.Files.App.fileList.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/test/')

      const result = cut.getCurrentDirectory()

      expect(result).toEqual('/test/')
    })
  })

  describe('putFileContents()', () => {
    it('GIVEN successful put AND addAndFetch, WHEN putFileContents is called with path = "/test.pdf" AND valid body, THEN resolves.', async () => {
      const jqPromise = { done: (cb: () => void) => { cb(); return jqPromise }, fail: (cb: () => void) => jqPromise };
      (OCA.Files.App.fileList.filesClient.putFileContents as jest.Mock).mockReturnValueOnce(jqPromise);
      (OCA.Files.App.fileList.addAndFetchFileInfo as jest.Mock).mockReturnValueOnce(jqPromise)
      const body = new Uint8Array()

      await cut.putFileContents('/test.pdf', body)

      expect(OCA.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/test.pdf', body, { contentType: 'application/pdf', overwrite: true })
      expect(OCA.Files.App.fileList.addAndFetchFileInfo).toHaveBeenCalledWith('/test.pdf', '', { scrollTo: true })
    })

    it('GIVEN successful put AND unsuccessful addAndFetch, WHEN putFileContents is called with path = "/test.pdf" AND valid body, THEN rejects.', async () => {
      const e = new Error('test')
      const successJqPromise = { done: (cb: () => void) => { cb(); return successJqPromise }, fail: (cb: () => void) => successJqPromise }
      const failingJqPromise = { done: (cb: () => void) => failingJqPromise, fail: (cb: (e: Error) => void) => { cb(e); return failingJqPromise } };
      (OCA.Files.App.fileList.filesClient.putFileContents as jest.Mock).mockReturnValueOnce(successJqPromise);
      (OCA.Files.App.fileList.addAndFetchFileInfo as jest.Mock).mockReturnValueOnce(failingJqPromise)
      const body = new Uint8Array()

      const promise = cut.putFileContents('/test.pdf', body)

      await expect(promise).rejects.toThrow(new OcaError('An unexpected error occured during the upload of the processed file.', e))
      expect(OCA.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/test.pdf', body, { contentType: 'application/pdf', overwrite: true })
      expect(OCA.Files.App.fileList.addAndFetchFileInfo).toHaveBeenCalledWith('/test.pdf', '', { scrollTo: true })
    })

    it('GIVEN unsuccessful put, WHEN putFileContents is called with path = "/test.pdf" AND valid body, THEN rejects.', async () => {
      const e = new Error('test')
      const failingJqPromise = { done: (cb: () => void) => failingJqPromise, fail: (cb: (e: Error) => void) => { cb(e); return failingJqPromise } };
      (OCA.Files.App.fileList.filesClient.putFileContents as jest.Mock).mockReturnValueOnce(failingJqPromise)
      const body = new Uint8Array()

      const promise = cut.putFileContents('/test.pdf', body)

      await expect(promise).rejects.toThrow(new OcaError('An unexpected error occured during the upload of the processed file.', e))
      expect(OCA.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/test.pdf', body, { contentType: 'application/pdf', overwrite: true })
      expect(OCA.Files.App.fileList.addAndFetchFileInfo).not.toHaveBeenCalled()
    })

    it('GIVEN unsuccessful put that rejects with 412, WHEN putFileContents is called with path = "/test.pdf" AND valid body, THEN rejects with special message.', async () => {
      const e = 412
      const failingJqPromise = { done: (cb: () => void) => failingJqPromise, fail: (cb: (e: number) => void) => { cb(e); return failingJqPromise } };
      (OCA.Files.App.fileList.filesClient.putFileContents as jest.Mock).mockReturnValueOnce(failingJqPromise)
      const body = new Uint8Array()

      const promise = cut.putFileContents('/test.pdf', body)

      await expect(promise).rejects.toThrow(new OcaError('Target file already exists: /test.pdf', e))
      expect(OCA.Files.App.fileList.filesClient.putFileContents).toHaveBeenCalledWith('/test.pdf', body, { contentType: 'application/pdf', overwrite: true })
      expect(OCA.Files.App.fileList.addAndFetchFileInfo).not.toHaveBeenCalled()
    })
  })

  describe('deleteFile()', () => {
    it('GIVEN successful remove, WHEN deleteFile is called with filename = "test.pdf", THEN resolves and removes file.', async () => {
      const successJqPromise = { done: (cb: () => void) => { cb(); return successJqPromise }, fail: (cb: () => void) => successJqPromise };
      (OCA.Files.App.fileList.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/');
      (OCA.Files.App.fileList.filesClient.remove as jest.Mock).mockReturnValueOnce(successJqPromise);
      (OCA.Files.App.fileList.remove as jest.Mock).mockImplementationOnce(() => {})

      await cut.deleteFile('test.pdf')

      expect(OCA.Files.App.fileList.getCurrentDirectory).toHaveBeenCalled()
      expect(OCA.Files.App.fileList.filesClient.remove).toHaveBeenCalledWith('/test.pdf')
      expect(OCA.Files.App.fileList.remove).toHaveBeenCalledWith('test.pdf')
    })

    it('GIVEN unsuccessful remove, WHEN deleteFile is called with filename = "test.pdf", THEN rejects.', async () => {
      const e = new Error('test')
      const failingJqPromise = { done: (cb: () => void) => failingJqPromise, fail: (cb: (e: Error) => void) => { cb(e); return failingJqPromise } };
      (OCA.Files.App.fileList.getCurrentDirectory as jest.Mock).mockReturnValueOnce('/');
      (OCA.Files.App.fileList.filesClient.remove as jest.Mock).mockReturnValueOnce(failingJqPromise)

      const promise = cut.deleteFile('test.pdf')

      await expect(promise).rejects.toThrow(new OcaError('An unexpected error occured during the deletion of the original file.', e))
      expect(OCA.Files.App.fileList.getCurrentDirectory).toHaveBeenCalled()
      expect(OCA.Files.App.fileList.filesClient.remove).toHaveBeenCalledWith('/test.pdf')
      expect(OCA.Files.App.fileList.remove).not.toHaveBeenCalled()
    })
  })
})
