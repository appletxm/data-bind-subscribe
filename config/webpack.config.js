var path = require('path')

module.exports = function () {
  return {
    entry: {
      index: path.resolve('./src/index.js')
    },
    output: {
      filename: '[name].js',
      path: path.resolve('./dist')
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [path.join(__dirname, '..', 'src'), path.join(__dirname, '..', 'test')]
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {}
    },
    plugins: []
  }
}
