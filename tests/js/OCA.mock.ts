Object.defineProperty(window, 'OCA', {
  writable: true,
  value: {
    Files: {
      App: {
        fileList: {
          $fileList: {
            on: jest.fn(() => { throw new Error('Mock behavior not defined') })
          },
          $el: {
            find: jest.fn(() => { throw new Error('Mock behavior not defined') })
          },
          multiSelectMenuItems: [],
          fileMultiSelectMenu: {
            render: jest.fn(() => { throw new Error('Mock behavior not defined') })
          },
          getCurrentDirectory: jest.fn(() => { throw new Error('Mock behavior not defined') }),
          addAndFetchFileInfo: jest.fn(() => { throw new Error('Mock behavior not defined') }),
          filesClient: {
            putFileContents: jest.fn(() => { throw new Error('Mock behavior not defined') }),
            remove: jest.fn(() => { throw new Error('Mock behavior not defined') })
          },
          remove: jest.fn(() => { throw new Error('Mock behavior not defined') }),
          getDownloadUrl: jest.fn(() => { throw new Error('Mock behavior not defined') }),
          getSelectedFiles: jest.fn(() => { throw new Error('Mock behavior not defined') })
        }
      },
      fileActions: {
        registerAction: jest.fn(() => { throw new Error('Mock behavior not defined') })
      }
    }
  }
})

beforeEach(() => {
  OCA.Files.App.fileList.multiSelectMenuItems = []
})
