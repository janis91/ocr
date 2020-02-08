Object.defineProperty(window, 't', {
  writable: true,
  value: jest.fn((...args: any[]) => {
    if (args[0] !== 'ocr') throw new Error('Translation function was called with the wrong app specifier.')
    return args[1]
  })
})

Object.defineProperty(window, 'n', {
  writable: true,
  value: jest.fn((...args: any[]) => {
    if (args[0] !== 'ocr') throw new Error('Translation function was called with the wrong app specifier.')
    if (args[3] === 1) return args[1]
    return args[2]
  })
})
