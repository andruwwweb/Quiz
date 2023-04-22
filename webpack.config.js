const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        filename: `./${filename('js')}`,
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        allowedHosts: 'all',
        historyApiFallback: true,
        static: {
            directory: path.join(__dirname, 'dist'),
          },
        open: true,
        compress: true,
        hot: true,
        port: 3000,
    },

    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html',
            chunks: ['index'],
            minify: {
                collapseWhitespace: true,
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: `./css/${filename('css')}`
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff|woff2)$/,
                use: {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'onest/'
                  }
                }
            },
            {
                test: /\.(png|jpeg|jpg|svg)$/i,
                loader: 'file-loader',
                options: {
                  name: "[name].[ext]",
                  outputPath: "assets/",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                loader: 'file-loader',
                options: {
                  outputPath: 'fonts',
                },
            },
        ]
    }



}