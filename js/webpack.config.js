var path = require('path');

module.exports = {
    entry: {
        app: __dirname + '/src/app.ts'
    },
    output: {
        path: __dirname,
        filename: 'ocr.js',
        library: ['OCA', 'Ocr'],
        libraryTarget: 'umd',
    },
    module: {
        preLoaders: [
            {
                test: /\.ts$/,
                loader: 'tslint-loader'
            }
        ],
        loaders: [
            {
                test: /\.hbs$/,
                loader: "handlebars-loader?runtime=handlebars/runtime"
            },
            {
                test: /\.ts?$/,
                loader: 'ts',
            }
        ]
    },
    tslint: {
        tsConfigFile: 'tsconfig.app.json'
    },
    ts: {
        configFileName: 'tsconfig.app.json'
    },
    resolve: {
        modules: [path.resolve('./src')],
        extensions: ['', '.ts']
    },
    externals: [
        {
            underscore: { // UMD
                commonjs: 'underscore',
                commonjs2: 'underscore',
                amd: 'underscore',
                root: '_'
            }
        },
        {
            jquery: { // UMD
                commonjs: 'jQuery',
                commonjs2: 'jQuery',
                amd: 'jQuery',
                root: '$'
            }
        },
        {
            'handlebars/runtime': {
                root: 'Handlebars',
                amd: 'handlebars/runtime',
                commonjs2: 'handlebars/runtime',
                commonjs: 'handlebars/runtime'
            }
        }
    ]
};
