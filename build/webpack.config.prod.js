import webpack        from 'webpack';
import Extract        from 'extract-text-webpack-plugin';
import Gzip           from 'compression-webpack-plugin';
import Manifest       from 'webpack-manifest-plugin';
import ChunkManifest  from 'chunk-manifest-webpack-plugin';
import path           from 'path';


export default {
  // Defining entry point
  entry: {
    // Bundle's entry points
    app: './build/bundles/app.js',

    // List of vendor's modules
    // To extract them to separate chunk
    vendor: ['react', 'react-router']

  },

  // Defining output params
  output: {
    path         : './public/assets',
    filename     : '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js'
  },

  // Defining resolver params
  // On the server we use NODE_PATH=.
  // On the client we use resolve.alias
  resolve: {
    alias: {
      'app'   : path.join(process.cwd(), 'app'),
      'config': path.join(process.cwd(), 'config'),
      'public': path.join(process.cwd(), 'public')
    },
    extensions: ['', '.js', '.jsx']
  },

  devtool : false,
  debug   : false,
  progress: true,
  node    : {
    fs: 'empty'
  },

  plugins: [
    // Extracting css
    new Extract('[name]-[chunkhash].css'),

    // Extracting vendor libs to separate chunk
    new webpack.optimize.CommonsChunkPlugin({
      name     : 'vendor',
      chunks   : ['app'],
      filename : 'vendor-[chunkhash].js',
      minChunks: Infinity
    }),

    // Defining some globals
    new webpack.DefinePlugin({
      __CLIENT__   : true,
      __SERVER__   : false,
      __DEV__      : false,
      __DEVTOOLS__ : false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    // Avoiding modules duplication
    new webpack.optimize.DedupePlugin(),

    // Extracting chunks filenames to json file
    // Required to resolve assets filenames with hashes on server
    // See `getAsset` helper in `app/libs/getAsset.js`
    new Manifest(),

    // Extracting chunks internal ids to json file
    // Required to keep vendor's chunkhash unchanged
    new ChunkManifest({
      filename        : 'chunk-manifest.json',
      manifestVariable: '__CHUNKS__'
    }),

    // Also required to keep vendor's chunkhash unchanged
    new webpack.optimize.OccurenceOrderPlugin(),

    // Minifying js assets
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        'warnings'     : false,
        'drop_debugger': true,
        'drop_console' : true,
        'pure_funcs'   : ['console.log']
      }
    }),

    // Gzipping assets
    new Gzip({
      asset    : '{file}.gz',
      algorithm: 'gzip',
      regExp   : /\.js$|\.css$/
    })
  ],

  // Defining loaders
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      { test  : /\.jsx?$/, loader: 'babel?stage=0',  exclude: /node_modules/ },
      {
        test  : /\.styl$/,
        loader: Extract.extract('style', 'css!autoprefixer?{browsers:["last 2 version"], cascade:false}!stylus')
      },
      {
        test  : /\.css$/,
        loader: Extract.extract('style', 'css!autoprefixer?{browsers:["last 2 version"], cascade:false}')
      }
    ]
  }
}
