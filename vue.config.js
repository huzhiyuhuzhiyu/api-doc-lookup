'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const define = require('./src/utils/define.js')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '' // page title

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 3000 npm run dev OR npm run dev --port = 3000
const port = process.env.port || process.env.npm_config_port || 3000 // dev port

const isDev = process.env.NODE_ENV === 'development'

const plugins = [
  new MonacoWebpackPlugin({
    // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
    languages: ['javascript', 'css', 'html', 'typescript', 'json', 'java', 'sql']
  })
]
if (!isDev) {
  plugins.push(new TerserPlugin({
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: false,
        pure_funcs: ['console.log'] // 移除console
      }
    },
    sourceMap: false
  }), new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.(js|css)$/, // 匹配文件名
    threshold: 10240, // 对超过10k的数据压缩
    deleteOriginalAssets: false, // 不删除源文件
    minRatio: 0.8 // 压缩比
  }))
}
// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    // 接口转发
    proxy: {
      '/dev': {
        target: define.APIURl,
        changeOrigin: true,
        pathRewrite: {
          '^/dev': ''
        }
      }
    }
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    // icon: favicon,
    resolve: {
      alias: {
        '@': resolve('src'),
        'static': resolve('static') // 增加这一行代码
      }
    },
    plugins
    // devtool: process.env.NODE_ENV !== 'production' ? 'source-map' : undefined
  },
  css: {
    sourceMap: isDev
  },
  chainWebpack(config) {
    config.externals({
      // 'monaco-editor': 'monaco-editor',
      'echarts': 'echarts',
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT'
    })
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [{
      rel: 'preload',
      // to ignore runtime.js
      // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
      fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
      include: 'initial'
    }])

    config.plugin('define').tap((definitions) => {
      const date0bj = new Date()
      const build_at = `${date0bj.toLocaleDateString()} ${date0bj.toLocaleTimeString()}`
      definitions[0]['process.env']['VERSION'] = JSON.stringify(require('./package.json').version)

      definitions[0]['process.env']['BUID_AT'] = JSON.stringify(build_at)
      return definitions
    })
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
          // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
        }
      )
  }
}
