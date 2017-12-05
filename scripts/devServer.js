var express = require('express')
var webpack = require('webpack')
var path = require('path')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var envConfig = require('../config/env')
var webpackConfig = require('../config/webpack.config')
var serverRouter = require('./serverRouter')
var open = require('open')
var app = express()
var compiler = webpack(webpackConfig)
var host = envConfig['development']['host']
var port = envConfig['development']['port']

process.env.NODE_ENV = process.argv && process.argv.length >= 2 ? (process.argv)[2] : 'development'

// compiler.watch({
//   aggregateTimeout: 300,
//   poll: 1000
// }, function (error, status) {})

// console.info( process.argv, process.env.NODE_ENV)
// console.info(compiler.outputPath, path.join(compiler.outputPath, 'index.html'))
// attach to the compiler & the server
app.use(webpackDevMiddleware(compiler, {
  // public path should be the same with webpack config
  publicPath: webpackConfig.output.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname + '/../dist'))

app.use('*', serverRouter['*'])

app.use('/rf_express', function (req, res) {
  serverRouter['/rf_express'](req, res)
})

app.use('/rfucenter', function (req, res) {
  serverRouter['/rfucenter'](req, res)
})

app.use('/kdn', function (req, res) {
  serverRouter['/kdn'](req, res)
})

app.use('/', function (req, res) {
  serverRouter['/'](req, res, compiler)
})

// app.get('/', function(req, res) {
//     //TODO compiler.outputPath is equal to the webpack publickPath
//     var filename = path.join(compiler.outputPath,'index.html')
//     //console.info('####', compiler.outputPath, path.join(compiler.outputPath, 'index.html'))
//     console.info('[req info]', req.params)

//     compiler.outputFileSystem.readFile(filename, function(err, result){
//         if (err) {
//             res.send(err)
//         }else{
//             res.set('content-type','text/html')
//             res.send(result)
//         }
//         res.end()
//     })
// })

// TODO why in windows the port must to be 8088, and in mac you can define anyother port
// sometimes the npm start cli will get the "event: 160 erro" in windows you need to run the cli in the ternimal "rm -rf node_modules && npm cache clean --force && npm install" or the port still works need to end them
app.listen(port, host, function (arg) {
  var url = 'http://' + host + ':' + port

  console.info('dev server started at: ', url)

// setTimeout(function () {
//   var openUrl = url
//   open(openUrl, 'chrome')
// }, 3000)
})
