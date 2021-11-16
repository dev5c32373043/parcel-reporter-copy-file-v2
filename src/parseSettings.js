const fs = require('fs/promises');
const path = require('path');

const { promisify } = require('util');

const glob = require('glob');

const utils = require('./utils');

/**
 * Parses required instructions for files copy.
 * @param {String} projectPath root directory of the project
 * @param {String[]} bundleTargets dist folders destination for bundle
 */

const parseSettings = async (projectPath, bundleTargets) => {
  const packageJson = JSON.parse(await fs.readFile(path.join(projectPath, 'package.json')));
  const { copyStaticFiles } = packageJson;

  const filesToCopy = [];

  if (!utils.isArray(copyStaticFiles)) return filesToCopy;

  for (const itemToCopy of copyStaticFiles) {
    let staticPaths; let distPaths;

    if (utils.isString(itemToCopy)) {
      staticPaths = path.join(projectPath, itemToCopy);
      distPaths = bundleTargets;
    } else if (utils.isPlainObject(itemToCopy)) {
      staticPaths = path.join(projectPath, itemToCopy.from);
      distPaths = utils.isString(itemToCopy.to) ? [path.join(projectPath, itemToCopy.to)] : bundleTargets;
    }

    if (glob.hasMagic(staticPaths)) {
      const globResults = await promisify(glob)(staticPaths); // eslint-disable-line no-await-in-loop
      staticPaths = globResults.reduce((res, _path, aIdx, arr) => { // excluding files when whole dir matched to prevent dups
        if (!arr.some(p => (p !== _path && _path.includes(p)))) {
          res.push({ path: _path, keepDir: true });
        }

        return res;
      }, []);
    } else if (utils.isString(staticPaths)) {
      staticPaths = [{ path: staticPaths, keepDir: false }];
    }

    if (!utils.isEmpty(staticPaths) && !utils.isEmpty(distPaths)) {
      filesToCopy.push({ staticPaths, distPaths });
    }
  }

  return filesToCopy;
};

module.exports = parseSettings;
