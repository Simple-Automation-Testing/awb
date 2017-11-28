const path = require('path')

module.exports = {
  entry: path.resolve('./test-app/index.js'),
  output: {
    path: path.resolve('./'),
    filename: "bundle.js"
  },
  devServer: {
    port: 9090,
    historyApiFallback: true
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
        }
      }
    ]
  }
}