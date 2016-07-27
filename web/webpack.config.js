var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {

    entry: {
        app: './src/boot.ts',
        vendor: './src/vendor.ts'
    },
    output: {
        path: './dist',
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'ts'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!less')
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|woff|woff2|ttf)(\?.*$|$)/,
                loader: 'file'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor']
        }),
        new HtmlWebpackPlugin({template: './src/index.html'}),
        new ExtractTextPlugin('style.css')
    ],
    devServer: {
        historyApiFallback: true
    }
};