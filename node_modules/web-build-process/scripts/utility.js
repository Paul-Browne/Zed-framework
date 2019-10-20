const chalk = require('chalk');
const pathJS = require('path');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

function humanReadableFilesize(path){
	if(fs.statSync(path).size > 999999){
		return (fs.statSync(path).size / 1000000).toFixed(1) + " Mb";
	}else if (fs.statSync(path).size > 999) {
		return (fs.statSync(path).size / 1000).toFixed(0) + " Kb";
	}else {
		return fs.statSync(path).size + " bytes";
	}
}

function consoleTimestampedMessage(message){
	var now = new Date();
	console.log(chalk.gray(('0'+now.getHours()).slice(-2) + ":" + ('0'+now.getMinutes()).slice(-2) + ":" + ('0'+now.getSeconds()).slice(-2)) + " " + message);
}

module.exports = {
	consoleTimestampedMessage: function(message){
		consoleTimestampedMessage(message);
	},
	humanReadableFilesize: function(path){
		return humanReadableFilesize(path);
	},
	writeOut: function(output, outPath){
		mkdirp(pathJS.dirname(outPath), function(err) {
	        if (err) {
	            console.error(err);
	        } else {
	            fs.writeFile(outPath, output, function(err) {
	                if (err) {
	                    console.error(err);
	                } else {
	                    consoleTimestampedMessage(chalk.green("built: ") + outPath + " " + chalk.yellow(humanReadableFilesize(outPath)));
	                }
	            });
	        }
	    });
	}
};