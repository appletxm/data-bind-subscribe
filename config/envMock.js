module.exports = {
  host: '127.0.0.1',
  port: 8089,
  get publicPath() {
    return 'http://' + this.host + ':' + this.port + '/dist/'
  },
  distPath: '../dist/',
  sourcePath: '../src/',
  rfucenterApi: '',
  rfExpressApi: '',
  js: [
    'assets/js-libs/vue.min.js',
    'assets/js-libs/vuex.min.js',
    'assets/js-libs/vue-router.min.js',
    'assets/js-libs/moment.min.js',
    'assets/js-libs/city-data.min.js',
    'assets/js-libs/lodash.min.js',
    'assets/js-libs/mint-ui.min.js'
  ]
}
