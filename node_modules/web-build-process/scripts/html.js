const utility = require("./utility.js");
const minify = require('html-minifier').minify;

module.exports = function(source, outPath){
	source = minify(source, {
	    removeAttributeQuotes: false,
	    collapseWhitespace: true,
	    minifyCSS: true,
	    minifyJS: true,
	    removeComments: true,
	    decodeEntities: true
	});
	utility.writeOut(source, outPath);
};