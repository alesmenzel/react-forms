const path = require('path');
const webpack = require('webpack');

const env = process.env.NODE_ENV;

const config = {
  mode: env || 'development',
  entry: ['./src/index.js'],
  output: {
    // path: path.resolve(__dirname, 'dist'),
    // filename: 'react-forms.js',
    library: 'ReactForms',
    libraryTarget: 'umd',
    // publicPath: '/dist/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
  ],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  externals: ['react', 'prop-types'],
};

if (env === 'development') {
  config.devtool = 'source-map';
}

module.exports = config;
