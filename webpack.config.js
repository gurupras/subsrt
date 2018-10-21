const path = require('path')

module.exports = {
  entry: './lib/subsrt.js',
  mode: 'production',
  devtool: 'source-map',
  output: {
    library: 'subsrt',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    filename: path.join('bundle.js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
