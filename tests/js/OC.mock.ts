Object.defineProperty(window, 'OC', {
  writable: true,
  value: {
    Notification: {
      showHtml: jest.fn((...args: any[]) => {
        if (args[1] === undefined || args[1].timeout !== 10 || args[1].type !== 'error') throw new Error('showHtml was not called with expected arguments.')
      })
    },
    PERMISSION_UPDATE: 2
  }
})
