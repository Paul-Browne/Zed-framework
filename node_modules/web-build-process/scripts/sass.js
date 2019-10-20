const utility = require("./utility.js");
const cssFunc = require("./css.js");
const sass = require('node-sass');

module.exports = function(inPath, outPath){
	sass.render({
	    file: inPath,
	}, function(err, result) {
	    if (err) {
	        console.error(err);
	    } else {
	        cssFunc(result.css, inPath, outPath.replace(/\/s(a|c)ss/, "/css").replace(/\.s(a|c)ss/, ".css"));
	    }
	});
};