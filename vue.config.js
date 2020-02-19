var path = require('path')

module.exports = {
  filenameHashing: false,

  pages: {
    app: {
      entry: 'src/app/main.ts',
      chunks: ['chunk-common', 'chunk-app-vendors', 'app']
    },
    settings: {
      entry: 'src/settings/main.ts',
      chunks: ['chunk-common', 'chunk-settings-vendors', 'settings']
    }
  },

  configureWebpack: (config) => {
    config.devtool = 'source-map'
  },

  chainWebpack: config => {
    Object.keys(module.exports.pages).forEach(page => config.plugins
      .delete(`html-${page}`)
      .delete(`preload-${page}`)
      .delete(`prefetch-${page}`))
    config.resolve.alias.set('@a', path.resolve(__dirname, 'src/app'))
    config.resolve.alias.set('@s', path.resolve(__dirname, 'src/settings'))
    // https://github.com/vuejs/vue-cli/issues/2381#issuecomment-425038367
    const IS_VENDOR = /[\\/]node_modules[\\/]/
    config.optimization.splitChunks({
      cacheGroups: {
        app: {
          name: 'chunk-app-vendors',
          priority: -11,
          chunks: chunk => chunk.name === 'app',
          test: IS_VENDOR,
          enforce: true
        },
        settings: {
          name: 'chunk-settings-vendors',
          priority: -11,
          chunks: chunk => chunk.name === 'settings',
          test: IS_VENDOR,
          enforce: true
        },
        common: {
          name: 'chunk-common',
          priority: -20,
          chunks: 'initial',
          minChunks: 2,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    })
  },

  css: {
    extract: true,
    loaderOptions: {
      css: {
        url: false
      }
    }
  }
}
