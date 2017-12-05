var webpack = require('webpack'),
  path = require('path'),
  webpackConfig = require('../config/webpack.config'),
  ora = require('ora'),
  rm = require('rimraf'),
  path = require('path'),
  chalk = require('chalk'),
  spinner

spinner = ora('building for production...')
spinner.start()
rm(path.resolve('./dist/'), function (err) {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    spinner.stop()
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      "  Opening index.html over file:// won't work.\n"
    ))
  })
})
