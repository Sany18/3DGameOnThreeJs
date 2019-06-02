// Imports
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin')
require("babel-register");
// Webpack Configuration
const config = {
  // Entry
  entry: './src/game.js',
  // Output
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'game.js',
  },
  // Loaders
  module: {
    rules : [
      // JavaScript/JSX Files
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      // CSS Files
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      }
    ]
  },
  // Plugins
  // plugins: [
  //   new htmlWebpackPlugin({
  //     template: './src/index.html',
  //     filename: 'index.html',
  //     hash: true
  //   })
  // ],
  mode: 'development',
};
// Exports
module.exports = config;
