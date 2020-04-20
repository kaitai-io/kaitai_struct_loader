var KaitaiStructCompiler = require("kaitai-struct-compiler");
var loaderUtils = require("loader-utils");
var yaml = require('js-yaml');

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

	var compiler = new KaitaiStructCompiler();

	compiler.compile("javascript", structure, null, debug).then(function (code) {
		callback(null, Object.values(code).join('\n'), null);
	}).catch(function (error) {
		callback(new Error(error), null);
	});
};
