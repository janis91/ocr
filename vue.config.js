var path = require('path')

module.exports = {
  filenameHashing: false,

  pages: {
    app: {
      entry: 'src/app/main.ts'
    },
    settings: {
      entry: 'src/settings/main.ts'
    }
  },

  chainWebpack: config => {
    Object.keys(module.exports.pages).forEach(page => config.plugins
      .delete(`html-${page}`)
      .delete(`preload-${page}`)
      .delete(`prefetch-${page}`))
  }
}
