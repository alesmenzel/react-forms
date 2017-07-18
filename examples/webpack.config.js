require('dotenv').config()
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cssNext = require('postcss-cssnext')
const modulesValues = require('postcss-modules-values')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = process.env.NODE_ENV === 'development'

/*
 Extracts CSS into separate bundle
 */
const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css',
  allChunks: true,
  disable: isDevelopment // in development attach CSS to head
})

// React-toolbox custom variables
const reactToolboxVariables = {}

module.exports = {
	/*
	 Entry
	 */
  entry: (() => {
    if (isProduction) {
      return {
        vendor: ['react', 'react-dom', 'lodash', 'moment', 'redux', 'react-redux', 'react-router-dom', 'axios'],
        app: './src/app/index.js'
      }
    }

    return {
      vendor: ['react', 'react-dom', 'lodash'],
      app: [
				// activate HMR for React
        'react-hot-loader/patch',
				// connects to the server to receive notifications when the bundle rebuilds
        'webpack-hot-middleware/client',
				// entry point
        './src/app/index.js'
      ]
    }
  })(),

	/*
	 Output
	 */
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },

	/*
	 Loaders
	 */
  module: {
    rules: [
			/*
			 Compile javascript files with JSX syntax
			 */
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },

			/*
			 Images
			 */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        exclude: [path.resolve(__dirname, 'src/app/styles/images')],
        options: {
					/*
					 URL loader
					 */
          limit: 10000, // loads images smaller than ${limit} bits (10000 b = 1.25 kB) as DataUrl

					/*
					 File loader
					 */
          name: 'images/[sha512:hash:base64:7].[ext]' // returns hashed name (7 chars of base64)
        }
      },

			/*
			 Images without renaming to hash - used for email templates, favicon
			 */
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader',
        include: [path.resolve(__dirname, 'src/app/styles/images')],
        options: {
          name: 'images/[name].[ext]'
        }
      },

			/*
			 Load CSS Modules - Default CSS is considered as a module
			 */
      {
        test: /\.(scss|sass|css)$/,
        exclude: [path.resolve(__dirname, 'src/app/styles')], // Exclude global styles
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
								// sourceMap: true, // TODO Breaks image paths
                modules: true,
                importLoaders: 1,
								// naming of module classes
                localIdentName: (() => {
                  if (isProduction) {
                    return '[hash:base64:5]'
                  }

                  return '[path][name]__[local]'
                })(),
                minimize: isProduction
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: () => [
                  cssNext({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables
                      }
                    }
                  }),
                  modulesValues
                ],
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },

			/*
			 Global scoped CSS - Allow to import global CSS rules
			 Those must be placed in the styles/global directory
			 */
      {
        test: /\.(scss|sass|css)$/,
        include: [path.resolve(__dirname, 'src/app/styles/global')],
        use: extractSass.extract({
          fallback: {
            loader: 'style-loader',
            options: {
							// inserts global CSS at the top of <head> (which allows override in custom CSS)
              insertAt: 'top'
            }
          },
          use: [
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                sourceMap: true,
                minimize: isProduction
              }
            },
            {
              loader: 'postcss-loader', // auto-prexifing
              options: {
                indent: 'postcss',
                plugins: () => [
                  cssNext({
                    features: {
                      customProperties: {
                        variables: reactToolboxVariables
                      }
                    }
                  }),
                  modulesValues
                ],
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
              options: {
                sourceMap: true
              }
            }
          ]
        })
      },

			/*
			 Fonts
			 */
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },

			/*
			 Loads any files as static and does not rename them - useful for email images
			 */
      {
        test: /\.*$/,
        include: [path.resolve(__dirname, 'src/app/styles/static')],
        loader: 'file-loader',
        options: {
          name: 'static/[name].[ext]'
        }
      }
    ]
  },

	/*
	 Resolve - Defaults to resolving extensions for .js and .json
	 */
  resolve: {
    modules: [
      path.resolve(__dirname, 'src/app'), // Resolving from ./src/app directory
      'node_modules'
    ]
  },

	/*
	 Source Maps
	 Eval: https://github.com/gaearon/react-hot-loader/tree/master/docs#source-maps
	 */
  devtool: 'source-maps',

	/*
	 Stats - Verbosity
	 */
  stats: {
    assets: true,
    version: true,
    timings: true,

		// disable
    colors: false,
    hash: false,
    chunks: false,
    chunkModules: false,
    children: false
  },

	/*
	 Plugins
	 */
  plugins: (() => {
    if (isProduction) {
      return [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': "'production'"
        }),
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true,
          beautify: false,
          comments: false
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          filename: 'vendor.bundle.js',
          minChunks: Infinity
        }),
				// extract CSS into separate file(s)
        extractSass
      ]
    }

    return [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': "'development'"
      }),
			// enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
			// split into vendor and app
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor.bundle.js',
        minChunks: Infinity
      }),
			// prints more readable module names in the browser console on HMR updates
      new webpack.NamedModulesPlugin(),
			// skip the asset emit in case any errors are detected during the build stage
      new webpack.NoEmitOnErrorsPlugin(),
			// extract CSS into separate file(s)
      extractSass
    ]
  })(),

	/* Polyfills */
  node: {
    dns: 'empty',
    net: 'empty'
  }
}
