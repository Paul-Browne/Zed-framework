const utility = require("./utility.js");
const cssFunc = require("./css.js");
const less = require('less');

module.exports = function(source, inPath, outPath){
	less.render(source, function(err, result) {
	    if (err) {
	        console.error(err);
	    } else {
	        cssFunc(result.css, inPath, outPath.replace("/less", "/css").replace(".less", ".css"));
	    }
	})
};