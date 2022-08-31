var fs = require('fs');
var path = require('path');

/**
 * Grab all the files from a specific directory
 * @param {Path} dir Directory for grabbing files
 * @param {Array} fileTypes List of file extentions to look for
 * @param {RegExp} ignore Files to ignore
 * @returns Array
 */
module.exports = (dir, fileTypes = ['.js'], ignore = new RegExp('^-')) => {
	var filesToReturn = [];
	function walkDir(currentPath) {
		var files = fs.readdirSync(currentPath).filter(path => !ignore.test(path));
		for (var i in files) {
			var curFile = path.join(currentPath, files[i]);      
			if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
				filesToReturn.push(curFile.replace(dir, ''));
			} else if (fs.statSync(curFile).isDirectory()) {
				walkDir(curFile);
			}
		}
	};
	walkDir(dir);
	return filesToReturn; 
}
