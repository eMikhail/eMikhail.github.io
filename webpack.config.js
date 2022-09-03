const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const srcPath = path.resolve(__dirname, './src');
const srcFontsPath = path.resolve(srcPath, 'assets/fonts');
const srcFaviconsPath = path.resolve(srcPath, 'assets/img/favicons');
const srcIconsPath = path.resolve(srcPath, 'assets/img/icons');
const srcImagesPath = path.resolve(srcPath, 'assets/img/images');
const srcStylesPath = path.resolve(srcPath, 'styles');

const destPath = path.resolve(__dirname, './public');
const destFaviconsPath = 'assets/img/favicons/[name][ext]';
const destIconsPath = 'assets/img/icons/[name].[hash][ext]';
const destFontsPath = 'assets/fonts/[name].[hash][ext]';

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    devServer: {
        static: 'public',
        compress: true,
        port: 3000,
        open: true,
        hot: true,
    },
    stats: 'errors-only',
    entry: [path.resolve(srcPath, 'index.html'), path.resolve(srcStylesPath, 'main.scss')],
    output: {
            path: destPath,
            publicPath: 'https://emikhail.github.io/',
        },
    module: {
        rules: [
            // rule for HTML files
            {
                include: srcPath,
                test: /\.html$/i,
                use: {
                    loader: 'html-loader',
                },
            },
            // rule for Sass(SCSS) files
            {
                test: /\.s[ac]ss$/i,
                include: srcStylesPath,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            // rule for favicon files
            {
                test: /\.(png|ico|svg)$/i,
                include: srcFaviconsPath,
                type: 'asset/resource',
                generator: {
                    filename: destFaviconsPath,
                },
            },
            // rule for icon files
            {
                test: /\.(svg)$/i,
                include: srcIconsPath,
                type: 'asset/resource',
                generator: {
                    filename: destIconsPath,
                },
            },
            // rule for font files
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/i,
                include: srcFontsPath,
                type: 'asset/resource',
                generator: {
                    filename: destFontsPath,
                },
            },
        ],
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin()], // it minifies css and optimize it with cssnano
    },
    plugins: [
        new CaseSensitivePathsPlugin(), // it fixes bugs between OS in caseSensitivePaths (since Windows isn't CaseSensitive but Linux is)
        new FriendlyErrorsWebpackPlugin(), // it provides user-friendly errors from webpack
        new HtmlWebpackPlugin({
            template: path.resolve(srcPath, 'index.html'),
        }),
        new MiniCssExtractPlugin({
            // it extracts css-code from js into splitted file
            filename: 'styles/[name].[hash].css',
        }),
        new CleanWebpackPlugin(),
        new webpack.ProgressPlugin(), // it shows progress of building
    ],
};
