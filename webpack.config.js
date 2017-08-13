const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/index.js",
    target: "node",
    externals: [nodeExternals()],
    output: {
        filename: "server.js",
        path: __dirname + "/dist",
        publicPath: '/'
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.json$/, loader: 'json-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/views', to: 'views' }
        ]),
        new webpack.IgnorePlugin(/pg-native/, /\/pg\//)
    ],

    node: {
        fs: "empty",
        __dirname: true
    }
};