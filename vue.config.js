var path = require('path')

module.exports = {
  publicPath: '/js/',
  filenameHashing: false,

  pages: {
    app: {
      entry: 'src/app/main.ts'
    },
    settings: {
      entry: 'src/settings/main.ts'
    }
  },

  configureWebpack: {
    output: {
      library: ['OCA', 'Ocr'],
      libraryTarget: 'umd'
    }
  },

  chainWebpack: config => {
    Object.keys(module.exports.pages).forEach(page => config.plugins
      .delete(`html-${page}`)
      .delete(`preload-${page}`)
      .delete(`prefetch-${page}`))
  }
}
// TODO: test coverage
