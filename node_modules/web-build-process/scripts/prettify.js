const prettier = require("prettier");
const mime = require('mime-types');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');


const utility = require('./utility.js');

module.exports = function(path){
	var parser;
	if (mime.lookup(path) === 'text/html') {
	    parser = "html";
	} else if (mime.lookup(path) === 'text/css' || mime.lookup(path) === 'text/x-scss' || mime.lookup(path) === 'text/x-sass' || mime.lookup(path) === 'text/less') {
	    parser = "css";
	} else if (mime.lookup(path) === 'application/javascript') {
	    parser = "babel";
	} else if (mime.lookup(path) === 'application/json') {
	    parser = "json";
	}
	// only prettify for valid file types
	if(parser){
		var contents = fs.readFileSync(path, 'utf8');
		var checker = prettier.check(contents, {parser: parser});
		// only prettify when needed
		if(!checker){
			fs.writeFileSync(path, prettier.format(contents, {parser: parser }) );
			utility.consoleTimestampedMessage(chalk.magenta("prettified: ") + path);
		}
	}
}