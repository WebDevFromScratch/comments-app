import webpack      from 'webpack';
import path         from 'path';

import appConfig    from '../config/server.app';


export default {
  // Defining entry points for webpack dev server
  entry: {
    app: [
      `webpack-dev-server/client?http://lvh.me:${appConfig.devPort}`,
      'webpack/hot/only-dev-server',
      './build/bundles/app.js'
    ],
    vendor: ['react', 'react-router']
  },

  // Defining output for webpack dev server
  output: {
    path      : path.join(process.cwd(), 'public', 'assets'),
    filename  : '[name].js',
    publicPath: `http://lvh.me:${appConfig.devPort}/assets`
  },

  resolve: {
    alias: {
      'app'   : path.join(process.cwd(), 'app'),
      'config': path.join(process.cwd(), 'config'),
      'public': path.join(process.cwd(), 'public')
    },
    extensions: ['', '.js', '.jsx']
  },

  // Source maps are slow, eval is fast
  devtool : '#eval',
  debug   : true,
  progress: true,
  node    : {
    fs: 'empty'
  },

  plugins: [
    // Enabling dev server
    new webpack.HotModuleReplacementPlugin(),

    // Don't update if there was error
    new webpack.NoErrorsPlugin(),

    new webpack.optimize.CommonsChunkPlugin({
      name     : 'vendor',
      chunks   : ['app'],
      filename : 'vendor.js',
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      __CLIENT__   : true,
      __SERVER__   : false,
      __DEV__      : true,
      __DEVTOOLS__ : true,
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    })
  ],

  module: {
    noParse: /\.min\.js$/,
    loaders: [
      // Notice `react-hot` loader, required for React components hot reloading
      { test  : /\.jsx?$/, loaders: ['react-hot', 'babel?stage=0'],  exclude: /node_modules/ },
      {
        test  : /\.styl$/,
        loader: 'style!css!autoprefixer?{browsers:["last 2 version"], cascade:false}!stylus'
      },
      {
        test  : /\.css$/,
        loader: 'style!css!autoprefixer?{browsers:["last 2 version"], cascade:false}'
      }
    ]
  }
}
