const packageOperations = require('./releasePackageOperations')
const tagOperations = require('./releaseTagOperations')
const version = process.argv ? (process.argv)[2] : ''
const ora = require('ora')
const chalk = require('chalk')
const spinner = ora('Releasing version: ' + version)

spinner.start()

packageOperations.updateVersion(version)
  .then((res) => {
    // console.info('#####', file)
    if (res === true) {
      return tagOperations.createTag(version)
    }
  })
  .then((res) => {
    if (res === true) {
      spinner.stop()
    }
  })
  .catch((err) => {
    console.info(chalk.red(err))
    spinner.stop()
  })

  // tagOperations.createTag(version).then((res) => {
  //   spinner.stop()
  // }).catch((err) => {
  //   console.info(chalk.red(err))
  //   spinner.stop()
  // })
