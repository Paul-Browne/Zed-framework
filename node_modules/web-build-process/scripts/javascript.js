const utility = require("./utility.js");
const uglifyJS = require("uglify-js");
const path = require("path");
const babel = require("@babel/core");

module.exports = function(source, outPath){
	var filename = path.basename(outPath);
	var transform = babel.transformSync(source, { filename }).code;
	var result = uglifyJS.minify(transform);
	utility.writeOut(result.code, outPath);
};