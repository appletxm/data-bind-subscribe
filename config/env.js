const envDev = require('./envDevelopment')
const envProd = require('./envProduction')
const envMock = require('./envMock')
const envTest = require('./envTest')

module.exports = {
  development: envDev,
  production: envProd,
  test: envTest,
  mock: envMock
}

/*
  notice
  express.test.rfgmc.com
  /10.60.32.120/data/express/apache-tomcat-8080/webapps/(html,server interface)  root/12345678
*/
