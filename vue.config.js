module.exports = {
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',
  configureWebpack: {
    externals: {
    // 'vue': 'Vue',
    // 'vue-router': 'VueRouter',
    // 'axios': 'axios',
    // 'web3':'  Web3'
    }
  },
  chainWebpack: config => {
    config.optimization
      .minimizer('terser')
      .tap(args => {
        Object.assign(args[0].terserOptions.compress, { // 生产模式 console.log 去除
          // warnings: false , // 默认 false
          // drop_console:  ,
          // drop_debugger: true, // 默认也是true 
          pure_funcs: ['console.log']
        })
        return args
      })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10000 }))
  }
}
