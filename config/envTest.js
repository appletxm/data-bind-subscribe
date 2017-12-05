/*
**
rfucenter express.test.rfgmc.com
rf_express express.test.rfgmc.com
*/
module.exports = {
  host: '127.0.0.1',
  port: 8089,
  get publicPath() {
    return 'http://' + this.host + ':' + this.port + '/dist/'
  },
  rfucenterApi: 'http://express.test.rfgmc.com', // '../../'
  rfExpressApi: 'http://express.test.rfgmc.com', // '../../'
  publicPath: '',
  distPath: '../dist/',
  sourcePath: '../src/',
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
