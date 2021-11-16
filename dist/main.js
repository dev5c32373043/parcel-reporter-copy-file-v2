var $bEbag$parcelplugin = require("@parcel/plugin");
var $bEbag$fspromises = require("fs/promises");
var $bEbag$path = require("path");
var $bEbag$util = require("util");
var $bEbag$glob = require("glob");
var $bEbag$url = require("url");

var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequiree285"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequiree285"] = parcelRequire;
}

var $020997393b64a682$require$Reporter = $bEbag$parcelplugin.Reporter;
var $d47aab914a8f33a8$exports = {};
const $d47aab914a8f33a8$var$utils = {
};
$d47aab914a8f33a8$var$utils.await = (promise)=>promise.then((data)=>[
            null,
            data
        ]
    ).catch((err)=>[
            err
        ]
    )
;
$d47aab914a8f33a8$var$utils.isArray = Array.isArray;
$d47aab914a8f33a8$var$utils.isNumber = (obj)=>typeof obj === 'number' && Number.isFinite(obj)
;
$d47aab914a8f33a8$var$utils.isString = (str)=>typeof str === 'string'
;
$d47aab914a8f33a8$var$utils.isPlainObject = (obj)=>typeof obj === 'object' && obj !== null && obj.toString() === '[object Object]'
;
$d47aab914a8f33a8$var$utils.isEmpty = (obj)=>{
    if ($d47aab914a8f33a8$var$utils.isNumber(obj)) return false;
    if ($d47aab914a8f33a8$var$utils.isArray(obj)) return !obj.length;
    if ($d47aab914a8f33a8$var$utils.isPlainObject(obj)) return !Object.keys(obj).length;
    if ($d47aab914a8f33a8$var$utils.isString(obj)) return !obj.length;
    return true;
};
$d47aab914a8f33a8$var$utils.omit = (obj, _keys)=>{
    const newObj = {
    };
    const keys = $d47aab914a8f33a8$var$utils.isString(_keys) ? [
        _keys
    ] : _keys;
    if (!$d47aab914a8f33a8$var$utils.isPlainObject(obj) || !$d47aab914a8f33a8$var$utils.isArray(keys)) return newObj;
    Object.keys(obj).forEach((key)=>{
        if (keys.includes(key)) return;
        newObj[key] = obj[key];
    });
    return newObj;
};
$d47aab914a8f33a8$exports = $d47aab914a8f33a8$var$utils;


var $1eadae9b8f4519d0$exports = {};



var $1eadae9b8f4519d0$require$promisify = $bEbag$util.promisify;


/**
 * Parses required instructions for files copy.
 * @param {String} projectPath root directory of the project
 * @param {String[]} bundleTargets dist folders destination for bundle
 */ const $1eadae9b8f4519d0$var$parseSettings = async (projectPath, bundleTargets)=>{
    const packageJson = JSON.parse(await $bEbag$fspromises.readFile($bEbag$path.join(projectPath, 'package.json')));
    const { copyStaticFiles: copyStaticFiles  } = packageJson;
    const filesToCopy = [];
    if (!$d47aab914a8f33a8$exports.isArray(copyStaticFiles)) return filesToCopy;
    for (const itemToCopy of copyStaticFiles){
        let staticPaths;
        let distPaths;
        if ($d47aab914a8f33a8$exports.isString(itemToCopy)) {
            staticPaths = $bEbag$path.join(projectPath, itemToCopy);
            distPaths = bundleTargets;
        } else if ($d47aab914a8f33a8$exports.isPlainObject(itemToCopy)) {
            staticPaths = $bEbag$path.join(projectPath, itemToCopy.from);
            distPaths = $d47aab914a8f33a8$exports.isString(itemToCopy.to) ? [
                $bEbag$path.join(projectPath, itemToCopy.to)
            ] : bundleTargets;
        }
        if ($bEbag$glob.hasMagic(staticPaths)) {
            const globResults = await $1eadae9b8f4519d0$require$promisify($bEbag$glob)(staticPaths); // eslint-disable-line no-await-in-loop
            staticPaths = globResults.reduce((res, _path, aIdx, arr)=>{
                if (!arr.some((p)=>p !== _path && _path.includes(p)
                )) res.push({
                    path: _path,
                    keepDir: true
                });
                return res;
            }, []);
        } else if ($d47aab914a8f33a8$exports.isString(staticPaths)) staticPaths = [
            {
                path: staticPaths,
                keepDir: false
            }
        ];
        if (!$d47aab914a8f33a8$exports.isEmpty(staticPaths) && !$d47aab914a8f33a8$exports.isEmpty(distPaths)) filesToCopy.push({
            staticPaths: staticPaths,
            distPaths: distPaths
        });
    }
    return filesToCopy;
};
$1eadae9b8f4519d0$exports = $1eadae9b8f4519d0$var$parseSettings;


var $adedc125e9433cdc$exports = {};



var $adedc125e9433cdc$require$pathToFileURL = $bEbag$url.pathToFileURL;

/**
 * Copy of target directory/file into the specified directory.
 * @param {String} filePath directory of file path
 * @param {String} fromPath path where directory/file placed
 * @param {String} toPath destination path where to copy the directory/file
 * @param {String} fileName file basename
 */ const $adedc125e9433cdc$var$syncFn = async (filePath, fromPath, toPath, fileName)=>{
    let destPath = filePath.replace(fromPath, toPath);
    if (!fileName) {
        const [accessDestErr] = await $d47aab914a8f33a8$exports.await($bEbag$fspromises.access(destPath));
        if (accessDestErr) await $bEbag$fspromises.mkdir(destPath, {
            recursive: true
        });
        return;
    }
    if (fileName && $bEbag$path.posix.basename(destPath) !== fileName) destPath = $bEbag$path.posix.join(destPath, fileName);
    await $bEbag$fspromises.copyFile($adedc125e9433cdc$require$pathToFileURL(filePath), destPath);
};
/**
 * Recursively copies all folders & files into the specified directory.
 * @param {String} targetPath root directory to start from
 * @param {Object} options config that contain basic info to sync folders/files
 * @param {String} options.fromPath path where directory/file placed
 * @param {String} options.toPath destination path where to copy the directory/file
 * @param {Boolean} options.keepDir flag that helps determine when we should keep target folder
 * @param {Boolean} initCall flag that helps determine first call of the recursive function

 */ const $adedc125e9433cdc$var$recursiveSync = async (targetPath, options, initCall = true)=>{
    const mainStats = await $bEbag$fspromises.stat(targetPath);
    if (mainStats.isFile()) {
        await $adedc125e9433cdc$var$syncFn(targetPath, options.fromPath, options.toPath, $bEbag$path.posix.basename(targetPath));
        return;
    }
    if (initCall && options.keepDir) {
        const parentDir = $bEbag$path.posix.dirname(options.fromPath);
        await $adedc125e9433cdc$var$syncFn(targetPath, parentDir, options.toPath);
        const newOptions = {
            ...options,
            fromPath: parentDir
        };
        await $adedc125e9433cdc$var$recursiveSync(targetPath, newOptions, false);
        return;
    }
    const fileNames = await $bEbag$fspromises.readdir(targetPath);
    await Promise.all(fileNames.map(async (fileName)=>{
        const filePath = $bEbag$path.posix.join(targetPath, fileName);
        const stats = await $bEbag$fspromises.stat(filePath);
        if (stats.isDirectory()) {
            await $adedc125e9433cdc$var$syncFn(filePath, options.fromPath, options.toPath);
            await $adedc125e9433cdc$var$recursiveSync(filePath, options, false);
            return;
        }
        await $adedc125e9433cdc$var$syncFn(filePath, options.fromPath, options.toPath, fileName);
    }));
};
const $adedc125e9433cdc$var$copyFiles = async (_fromPath, _toPath, _options = {
})=>{
    const fromPath = $bEbag$path.posix.resolve(_fromPath);
    const toPath = $bEbag$path.posix.resolve(_toPath);
    const options = {
        ..._options,
        fromPath: fromPath,
        toPath: toPath
    };
    const [accessErr] = await $d47aab914a8f33a8$exports.await($bEbag$fspromises.access(toPath));
    if (accessErr) await $bEbag$fspromises.mkdir(toPath, {
        recursive: true
    });
    return $adedc125e9433cdc$var$recursiveSync(fromPath, options);
};
$adedc125e9433cdc$exports = $adedc125e9433cdc$var$copyFiles;


parcelRequire.register("66lvY", function(module, exports) {
module.exports = ()=>({
        queue: [],
        async exec (limit = 5) {
            const currentOps = this.queue.splice(0, limit);
            await Promise.all(currentOps.map((op)=>op()
            ));
            if (this.queue.length <= 0) return;
            await this.exec(limit);
        }
    })
;

});


const $020997393b64a682$var$opsLimiter = (parcelRequire("66lvY"))();
const $020997393b64a682$var$copyFileReporter = new $020997393b64a682$require$Reporter({
    async report ({ event: event , options: options  }) {
        if (event.type === 'buildSuccess') {
            // Get all dist dir from targets, we'll copy static files into them
            const bundles = event.bundleGraph.getBundles();
            const bundleTargets = Array.from(new Set(bundles.filter((b)=>b.target && b.target.distDir
            ).map((b)=>b.target.distDir
            )));
            const filesToCopy = await $1eadae9b8f4519d0$exports(options.projectRoot, bundleTargets);
            if (!$d47aab914a8f33a8$exports.isArray(filesToCopy)) return; // if no files to copy, there is nothing to do for us
            for (const fileToCopy of filesToCopy){
                const copyDistFn = ()=>Promise.all(fileToCopy.distPaths.map((distPath)=>Promise.all(fileToCopy.staticPaths.map((staticPath)=>$adedc125e9433cdc$exports(staticPath.path, distPath, $d47aab914a8f33a8$exports.omit(staticPath, 'path'))
                        ))
                    ))
                ;
                $020997393b64a682$var$opsLimiter.queue.push(copyDistFn);
            }
            await $020997393b64a682$var$opsLimiter.exec(); // executing operations by chunks
        }
    }
});
module.exports = $020997393b64a682$var$copyFileReporter;


//# sourceMappingURL=main.js.map
