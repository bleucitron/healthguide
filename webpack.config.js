const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const WriteFilePlugin = require('write-file-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const buildPath = path.resolve(__dirname, 'dist');

const isProd = process.env.NODE_ENV === 'production';

const cssExtractor = new ExtractTextPlugin(isProd ? "style.[contenthash].css" : "style.css");

const config = {
    context: path.resolve(__dirname, "src"),
    entry: [
        './index.js',
        './styles/style.scss',
        './favicon.ico',
    ],
    output: {
        path: buildPath,
        filename: isProd ? "bundle.[chunkhash].js" : "bundle.js"
    },
    plugins: [
        cssExtractor,
        new CleanWebpackPlugin(buildPath),
        new HtmlWebpackPlugin({
            template: './index.html'
        }),
        // new WriteFilePlugin({
        //     test: /\.js$/
        // })
    ],
    module: {
        rules: [
            {
                test: path.join(__dirname, "src", "index.html"),
                use: [{
                    loader: "html-loader",
                    options: {
                        interpolate: true,
                        attrs: ["img:src"]
                    }
                }]
            },
            {
                test: /\.html$/,
                exclude: /index\.html/,
                use: {
                    loader: "html-loader",
                    options: {
                        interpolate: true,
                        attrs: ["img:src", "video:src", 'source:src']
                    }
                }
            },
            {
                test: path.join(__dirname, "src", "styles", "style.scss"),
                use: cssExtractor.extract({
                    use: [
                        "css-loader",
                        "sass-loader"
                    ]
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }]
            },
            {
                test: /\.(png|svg|jpg|gif|mp4|ico)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]'
                    }
                }]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                targets: {
                                    browsers: ["Firefox >= 38.4.0"]
                                },
                                //"exclude": ["transform-regenerator"],
                                useBuiltIns: 'entry',
                            }]
                        ]
                    }
                },
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            }
        ]
    }
};

if (isProd) {
    config.plugins.push(
        new DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                ecma: 6
            }
        })
    );
} else {
    config.devtool = 'source-map';
    config.devServer = {
        contentBase: buildPath,
        watchContentBase: true
    }
}

module.exports = config;