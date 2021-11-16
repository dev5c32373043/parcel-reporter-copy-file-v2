const fs = require('fs/promises');
const path = require('path');
const { pathToFileURL } = require('url');

const utils = require('./utils');

/**
 * Copy of target directory/file into the specified directory.
 * @param {String} filePath directory of file path
 * @param {String} fromPath path where directory/file placed
 * @param {String} toPath destination path where to copy the directory/file
 * @param {String} fileName file basename
 */

const syncFn = async (filePath, fromPath, toPath, fileName) => {
  let destPath = filePath.replace(fromPath, toPath);

  if (!fileName) {
    const [accessDestErr] = await utils.await(fs.access(destPath));

    if (accessDestErr) {
      await fs.mkdir(destPath, { recursive: true });
    }

    return;
  }

  if (fileName && path.posix.basename(destPath) !== fileName) { // adding filename into path when only dir provided
    destPath = path.posix.join(destPath, fileName);
  }

  await fs.copyFile(pathToFileURL(filePath), destPath);
};

/**
 * Recursively copies all folders & files into the specified directory.
 * @param {String} targetPath root directory to start from
 * @param {Object} options config that contain basic info to sync folders/files
 * @param {String} options.fromPath path where directory/file placed
 * @param {String} options.toPath destination path where to copy the directory/file
 * @param {Boolean} options.keepDir flag that helps determine when we should keep target folder
 * @param {Boolean} initCall flag that helps determine first call of the recursive function

 */

const recursiveSync = async (targetPath, options, initCall = true) => {
  const mainStats = await fs.stat(targetPath);

  if (mainStats.isFile()) { // if a single file provided
    await syncFn(targetPath, options.fromPath, options.toPath, path.posix.basename(targetPath));
    return;
  }

  if (initCall && options.keepDir) { // we should keep dir in this case
    const parentDir = path.posix.dirname(options.fromPath);
    await syncFn(targetPath, parentDir, options.toPath);
    const newOptions = { ...options, fromPath: parentDir };
    await recursiveSync(targetPath, newOptions, false);
    return;
  }

  const fileNames = await fs.readdir(targetPath);

  await Promise.all(fileNames.map(async fileName => { // syncing all files/directories inside target dir
    const filePath = path.posix.join(targetPath, fileName);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      await syncFn(filePath, options.fromPath, options.toPath);
      await recursiveSync(filePath, options, false);
      return;
    }

    await syncFn(filePath, options.fromPath, options.toPath, fileName);
  }));
};

const copyFiles = async (_fromPath, _toPath, _options = {}) => {
  const fromPath = path.posix.resolve(_fromPath);
  const toPath = path.posix.resolve(_toPath);
  const options = { ..._options, fromPath, toPath };

  const [accessErr] = await utils.await(fs.access(toPath));
  if (accessErr) { // creating destination folder
    await fs.mkdir(toPath, { recursive: true });
  }

  return recursiveSync(fromPath, options);
};

module.exports = copyFiles;
