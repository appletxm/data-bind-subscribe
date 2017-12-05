/*
**
rfucenter 10.60.65.181:6080
rf_express 10.60.65.181:8080
**
*/
module.exports = {
  host: '127.0.0.1',
  port: 8089,
  rfucenterApi: '', // http://10.60.65.181:6080
  rfExpressApi: '', // http://10.60.65.181:8080
  get publicPath() {
    return 'http://' + this.host + ':' + this.port + '/dist/'
  },
  distPath: '../dist/',
  sourcePath: '../src/',
  js: [
    'assets/js-libs/es6-promise.min.js',
    'assets/js-libs/polyfill.min.js',
    'assets/js-libs/vue.min.js',
    'assets/js-libs/vuex.min.js',
    'assets/js-libs/vue-router.min.js',
    'assets/js-libs/moment.min.js',
    'assets/js-libs/city-data.js',
    'assets/js-libs/lodash.min.js',
    'assets/js-libs/mint-ui.min.js'
  ]
}
