'use strict';

const compiler = require('./compiler');
const assert = require('assert');
const nodeEval = require('eval');
const KaitaiStream = require('kaitai-struct/KaitaiStream');
const realFs = require('fs');

const testHelper = (formatPath, testData, testCallback, options) => {
    options || (options = {});
    return compiler(formatPath, options)
        .then(stats => {
            const outFs = stats.compilation.compiler.outputFileSystem;
            return new Promise(function (resolve, reject) {
                outFs.readFile('./test/bundle.js', {encoding: 'utf8'}, function (err, contents) {
                    if (err) reject(err);
                    resolve(contents);
                });
            });
        })
        .then(bundleCode => {
            const structCls = nodeEval(bundleCode);
            console.log('structCls.name: ', structCls.name);
            return new structCls(new KaitaiStream(testData.buffer));
        })
        .then(testCallback);
};

describe('index.js', function () {
    it('loads hello_world.ksy in non-debug mode', () =>
        testHelper(
            './formats/hello_world.ksy',
            new Uint8Array([185]),
            struct => {
                assert.strictEqual(typeof struct._debug, 'undefined');
                assert.strictEqual(struct.one, 185);
            },
            { debug: false }
        )
    );
    it('loads hello_world.ksy in debug mode', () =>
        testHelper(
            './formats/hello_world.ksy',
            new Uint8Array([133]),
            struct => {
                assert.strictEqual(typeof struct.one, 'undefined');
                struct._read();
                assert.strictEqual(struct.one, 133);
                assert.strictEqual(typeof struct._debug, 'object');
                // NB: intentionally used deepEqual (not deepStrictEqual),
                // because we care only about the structure, not identity
                assert.deepEqual(struct._debug, {
                    one: {
                        start: 0,
                        ioOffset: 0,
                        end: 1,
                    }
                });
            },
            { debug: true }
        )
    );
    it('declares hello_world.ksy as a dependency of imports0.ksy', () =>
        compiler('./formats/imports0.ksy', { debug: false })
            .then(stats => {
                const modules = stats.compilation.modules;
                const mainSpec = modules.find(mod => mod.resource.endsWith('imports0.ksy'));
                assert.strictEqual(
                    mainSpec.fileDependencies.some(file => file.endsWith('hello_world.ksy')),
                    true,
                    'fileDependencies do not contain "hello_world.ksy"'
                );
            })
    );
    it('should load imports0.ksy in non-debug mode', () =>
        testHelper(
            './formats/imports0.ksy',
            new Uint8Array([185, 248]),
            struct => {
                assert.strictEqual(typeof struct._debug, 'undefined');
                assert.strictEqual(struct.two, 185);
                assert.strictEqual(struct.hw.one, 248);
                assert.strictEqual(struct.hwOne, 248);
            },
            { debug: false }
        )
    );
});