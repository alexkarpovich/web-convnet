var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    "vendor": "./app/vendor",
    "app": "./app/boot"
  },
  output: {
    path: __dirname,
    filename: "./dist/[name].bundle.js"
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.ts/,
        loaders: ['ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!less')
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?.*$|$)/,
        loader: 'file'
      },
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"./dist/vendor.bundle.js"),
    new ExtractTextPlugin('./dist/style.css'),
  ]
}
