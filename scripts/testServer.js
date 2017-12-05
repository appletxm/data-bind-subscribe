var express = require('express')
var app = express()
var serverConfig = (require('../config/env'))['development']['api']

console.info('serverConfig:', serverConfig)

// app.use('/api', function (req, res) {
//   res.set('content-type', 'text/html')
//   res.send(result)
// })

app.get('/api/*', function (req, res) {
  // TODO compiler.outputPath is equal to the webpack publickPath
  var obj = {
    'data': {
      'resultList': [],
      'pageNo': '1',
      'pageSize': '10',
      'pages': '2',
      'totalCount': '15'
    },
    'retmsg': '数据查找成功'
  }

  console.info('[test server req info]', req.path, req.params)
  res.set('content-type', 'application/json')
  res.send(JSON.stringify(obj))
})

app.listen(serverConfig['port'], serverConfig['host'], function (arg) {
  var url = 'http://' + serverConfig['host'] + ':' + serverConfig['port']
  console.info('dev server started at: ', url)
})
