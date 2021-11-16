const { Reporter } = require('@parcel/plugin');

const utils = require('./utils');
const parseSettings = require('./parseSettings');
const copyFiles = require('./copyFiles');
const opsLimiter = require('./opsLimiter')();

const copyFileReporter = new Reporter({
  async report({ event, options }) {
    if (event.type === 'buildSuccess') {
      // Get all dist dir from targets, we'll copy static files into them
      const bundles = event.bundleGraph.getBundles();

      const bundleTargets = Array.from(new Set(
        bundles.filter(b => b.target && b.target.distDir).map(b => b.target.distDir),
      ));

      const filesToCopy = await parseSettings(options.projectRoot, bundleTargets);

      if (!utils.isArray(filesToCopy)) return; // if no files to copy, there is nothing to do for us

      for (const fileToCopy of filesToCopy) { // dividing copy files operations by groups
        const copyDistFn = () => Promise.all(
          fileToCopy.distPaths.map(distPath => (
            Promise.all(
              fileToCopy.staticPaths.map(staticPath => (
                copyFiles(staticPath.path, distPath, utils.omit(staticPath, 'path'))
              )),
            )
          )),
        );

        opsLimiter.queue.push(copyDistFn);
      }

      await opsLimiter.exec(); // executing operations by chunks
    }
  },
});

module.exports = copyFileReporter;
