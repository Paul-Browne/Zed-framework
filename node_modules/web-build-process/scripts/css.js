const utility = require("./utility.js");
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cleanCSS = require('postcss-clean');

module.exports = function(source, inPath, outPath){
	postcss([
	    autoprefixer(),
	    cleanCSS()
	])
	.process(source, { from: inPath, to: outPath })
	.then(result => {
	    utility.writeOut(result.css, outPath);
	})
};