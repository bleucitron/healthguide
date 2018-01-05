const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const cssExtractor = new ExtractTextPlugin("style.css");
const indexHtmlExtractor = new ExtractTextPlugin("index.html");

module.exports = {
    entry: [
        path.join(__dirname, 'src/index.js'),
        path.join(__dirname, 'src/style.scss'),
        path.join(__dirname, 'src/index.html')
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        watchContentBase: true
    },
    plugins: [cssExtractor, indexHtmlExtractor],
    module: {
        rules: [
            {
                test: path.join(__dirname, "src", "index.html"),
                use: indexHtmlExtractor.extract([
                {
                    loader: "html-loader",
                    options: {
                        interpolate: true,
                        attrs: ["img:src"]
                    }
                }])
            },
            {
                test: path.join(__dirname, "src", "style.scss"),
                use: cssExtractor.extract({
                    use: [
                        "css-loader",
                        "sass-loader"
                    ]
                })
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    }
};