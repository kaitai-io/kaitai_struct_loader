'use strict';

const path = require('path');
const webpack = require('webpack');
const memfs = require('memfs');

module.exports = function (fixture, options) {
    options || (options = {});
    const compiler = webpack({
        target: 'node',
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [{
                test: /\.ksy$/,
                use: {
                    loader: path.resolve(__dirname, '../index.js'),
                    options,
                }
            }]
        },
        externals: {
            'iconv-lite': 'require("iconv-lite")',
        },
    });

    compiler.outputFileSystem = memfs.createFsFromVolume(new memfs.Volume());
    compiler.outputFileSystem.join = path.join.bind(path);

    return new Promise(function (resolve, reject) {
        compiler.run(function (err, stats) {
            if (err) reject(err);
            if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

            resolve(stats);
        });
    });
};