const fs = require("fs");
const path = require("path");

/**
 * Grab all the files from a specific directory
 * @param {Path} dir Directory for grabbing files
 * @param {Array} fileTypes List of file extentions to look for
 * @param {RegExp} ignore Files to ignore
 * @returns Array
 */
module.exports = (dir, fileTypes = [".js"], ignore = new RegExp("^-")) => {
    const filesToReturn = [];
    function walkDir(currentPath) {
        const files = fs.readdirSync(currentPath).filter(file_path => !ignore.test(file_path));
        for (const i in files) {
            const curFile = path.join(currentPath, files[i]);
            if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                filesToReturn.push(curFile.replace(dir, ""));
            }
            else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    }

    walkDir(dir);
    return filesToReturn;
};
