const utility = require("./utility.js");
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const chalk = require('chalk');
const jimp = require('jimp');
const sizeOf = require('image-size');

function reformatOutputDirectory(dirOut, width) {
    return dirOut.replace("images", "images/" + width);
}

function imageMaker(obj) {
    if (obj.width && sizeOf(obj.dirIn).width >= obj.width) {
        jimp.read(obj.dirIn, (err, file) => {
            if (err) {
                console.log(err);
            } else {
                file.resize(obj.width, jimp.AUTO).quality(obj.quality).write(reformatOutputDirectory(obj.dirOut, obj.width), function(){
                	// TODO only 'compress' images if the filesize will be less than the original
                	// console.log(fs.statSync(obj.dirIn).size);
                	// console.log(fs.statSync(reformatOutputDirectory(obj.dirOut, obj.width)).size);
                	utility.consoleTimestampedMessage(chalk.green("built: ") + reformatOutputDirectory(obj.dirOut, obj.width) + " " + chalk.yellow(utility.humanReadableFilesize(reformatOutputDirectory(obj.dirOut, obj.width))) );
                });
            }
        });
    } else if (!obj.width) {
        jimp.read(obj.dirIn, (err, file) => {
            if (err) {
                console.log(err);
            } else {
                file.quality(obj.quality).write(obj.dirOut, function(){
                	utility.consoleTimestampedMessage(chalk.green("built: ") + obj.dirOut + " " + chalk.yellow(utility.humanReadableFilesize(obj.dirOut)));
                });
            }
        });
    }
}

module.exports = function(inDirectory, outDirectory){
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 40,
	    quality: 0
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 400,
	    quality: 75
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 800,
	    quality: 75
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 1200,
	    quality: 75
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 1600,
	    quality: 75
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    width: 2000,
	    quality: 75
	});
	imageMaker({
	    dirIn: inDirectory,
	    dirOut: outDirectory,
	    quality: 75
	});
}