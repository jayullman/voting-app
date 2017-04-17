var path = require('path');

module.exports = {
  entry: './index.js',
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
  }
}
