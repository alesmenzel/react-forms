const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-forms.js',
    library: 'reactForms',
    libraryTarget: 'umd',
    publicPath: '/dist/'
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }]
  },
  devtool: 'source-map',
  resolve: {
    modules: [path.resolve(__dirname, "src"), 'node_modules']
  },
  externals: ['react', 'prop-types']
}
