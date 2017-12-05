var path = require('path'),
  fs = require('fs'),
  serverProxy = require('./serverProxy'),
  isMock = false,
  serverRouter,
  env = require('../config/env')

function getMockFile (reqPath, res) {
  reqPath = reqPath.replace('/api', '')
  reqPath = path.join(__dirname, '../mock' + reqPath)

  console.info('[req info mock]', reqPath)

  fs.readFile(reqPath, function (err, result) {
    var result = JSON.parse(String(result))
    if (err) {
      res.send(err)
    }else {
      res.set('content-type', 'application/json')
      res.send(result)
    }
    res.end()
  })
}

function getProxyConfig (req) {
  // rfucenterApi: '', // http://10.60.65.181:6080 
  // rfExpressApi: '', // http://10.60.65.181:8080
  // env['development']['rfucenterApi']
  var rfExpressApi = {
    host: '10.60.65.181',
    port: '8080'
  }
  var rfucenterApi = {
    host: '10.60.65.181',
    port: '6080 '
  }

  if (('/rf_express').indexOf(req.baseUrl) >= 0) {
    return rfExpressApi
  }else {
    return rfucenterApi
  }
}

function assignRouter (req, res, next) {
  var reqPath = req.originalUrl

  if (process.env.NODE_ENV === 'mock') {
    isMock = true
    console.log('mock reqPath', reqPath)
    getMockFile(reqPath + '.json', res)
  }else if (process.env.NODE_ENV === 'development') {
    // serverProxy.doProxy(getProxyConfig(req), req, res)
  }
  if (next) {
    next()
  }
}

serverRouter = {
  '*': function (req, res, next) {
    console.info('[req info]', req.path, req.baseUrl, req.params)
    next()
  },

  '/rf_express': assignRouter,

  '/rfucenter': assignRouter,

  '/kdn': assignRouter,

  '/': function (req, res, compiler, next) {
    // TODO compiler.outputPath is equal to the webpack publickPath
    var filename = path.join(compiler.outputPath, 'index.html')
    // console.info('####', compiler.outputPath, path.join(compiler.outputPath, 'index.html'))

    compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        res.send(err)
      }else {
        res.set('content-type', 'text/html')
        res.send(result)
      }
      res.end()

      if (next) {
        next()
      }
    })
  }
}

module.exports = serverRouter
