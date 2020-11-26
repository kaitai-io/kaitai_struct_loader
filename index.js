'use strict';

var KaitaiStructCompiler = require("kaitai-struct-compiler");
var loaderUtils = require("loader-utils");
var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');

// this function is called from webpack and 'this' refers
// to https://webpack.js.org/api/loaders/#the-loader-context
module.exports = function (source) {
	const options = loaderUtils.getOptions(this) || {};
	const debug = options.hasOwnProperty('debug') ? options.debug : this.debug;

	if (this.cacheable) this.cacheable();
	var callback = this.async();

	var structure;
	try {
		structure = yaml.safeLoad(source);
	} catch (error) {
		callback(new Error(error));
		return;
	}

	const moduleDir = this.context;

	var yamlImporter = {
		importYaml: (name, mode) => {
			const filePath = path.join(moduleDir, name + ".ksy");
			this.addDependency(filePath);

			const ksyStr = fs.readFileSync(filePath, "utf8");
			const ksyObj = yaml.safeLoad(ksyStr);
			return Promise.resolve(ksyObj);
		}
	};

	var compiler = new KaitaiStructCompiler();
	compiler.compile("javascript", structure, yamlImporter, debug).then(function (code) {
		callback(null, Object.values(code).join('\n'), null);
	}).catch(function (error) {
		callback(new Error(error), null);
	});
};
