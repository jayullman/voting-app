var path = require('path');
var webpack = require('webpack');

var config = {
  entry: './client/index.js',
  output: {
    filename: 'app.js',
    path: path.join(__dirname, '/public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'eslint-loader',
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/public'
  },
  devtool: 'eval-source-map',
  plugins: []
}

if (process.env.NODE_ENV === 'production') {
  delete config.devtool;
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  );
}

module.exports = config;