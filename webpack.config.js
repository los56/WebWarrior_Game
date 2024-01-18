const path = require('path');
const dotenv = require('dotenv-webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'wwgame.bundle.js'
    },
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist')
        },
        compress: true,
        port: 1234
    },
    resolve: {
        fallback: {
            os: require.resolve('os-browserify/browser'),
            path: require.resolve('path-browserify'),
            crypto: require.resolve('crypto-browserify'),
            buffer: require.resolve('buffer/'),
            stream: require.resolve('stream-browserify')
        }
    },
    plugins: [
        new dotenv({path: `.env`})
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: ['file-loader']
            }
        ]
    }
};