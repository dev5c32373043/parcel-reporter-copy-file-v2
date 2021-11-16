import {Reporter as $9rHNX$Reporter} from "@parcel/plugin";
import {readFile as $9rHNX$readFile, access as $9rHNX$access, mkdir as $9rHNX$mkdir, copyFile as $9rHNX$copyFile, stat as $9rHNX$stat, readdir as $9rHNX$readdir} from "fs/promises";
import {join as $9rHNX$join, posix as $9rHNX$posix} from "path";
import {promisify as $9rHNX$promisify} from "util";
import * as $9rHNX$glob from "glob";
import {pathToFileURL as $9rHNX$pathToFileURL} from "url";

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
var $c86c7cf07722d0a1$exports = {};

var $c86c7cf07722d0a1$require$Reporter = $9rHNX$Reporter;
var $ee1123b3052bd385$exports = {};
const $ee1123b3052bd385$var$utils = {
};
$ee1123b3052bd385$var$utils.await = (promise)=>promise.then((data)=>[
            null,
            data
        ]
    ).catch((err)=>[
            err
        ]
    )
;
$ee1123b3052bd385$var$utils.isArray = Array.isArray;
$ee1123b3052bd385$var$utils.isNumber = (obj)=>typeof obj === 'number' && Number.isFinite(obj)
;
$ee1123b3052bd385$var$utils.isString = (str)=>typeof str === 'string'
;
$ee1123b3052bd385$var$utils.isPlainObject = (obj)=>typeof obj === 'object' && obj !== null && obj.toString() === '[object Object]'
;
$ee1123b3052bd385$var$utils.isEmpty = (obj)=>{
    if ($ee1123b3052bd385$var$utils.isNumber(obj)) return false;
    if ($ee1123b3052bd385$var$utils.isArray(obj)) return !obj.length;
    if ($ee1123b3052bd385$var$utils.isPlainObject(obj)) return !Object.keys(obj).length;
    if ($ee1123b3052bd385$var$utils.isString(obj)) return !obj.length;
    return true;
};
$ee1123b3052bd385$var$utils.omit = (obj, _keys)=>{
    const newObj = {
    };
    const keys = $ee1123b3052bd385$var$utils.isString(_keys) ? [
        _keys
    ] : _keys;
    if (!$ee1123b3052bd385$var$utils.isPlainObject(obj) || !$ee1123b3052bd385$var$utils.isArray(keys)) return newObj;
    Object.keys(obj).forEach((key)=>{
        if (keys.includes(key)) return;
        newObj[key] = obj[key];
    });
    return newObj;
};
$ee1123b3052bd385$exports = $ee1123b3052bd385$var$utils;


var $15f15dd5f2e5e0b8$exports = {};



var $15f15dd5f2e5e0b8$require$promisify = $9rHNX$promisify;


/**
 * Parses required instructions for files copy.
 * @param {String} projectPath root directory of the project
 * @param {String[]} bundleTargets dist folders destination for bundle
 */ const $15f15dd5f2e5e0b8$var$parseSettings = async (projectPath, bundleTargets)=>{
    const packageJson = JSON.parse(await $9rHNX$readFile($9rHNX$join(projectPath, 'package.json')));
    const { copyStaticFiles: copyStaticFiles  } = packageJson;
    const filesToCopy = [];
    if (!$ee1123b3052bd385$exports.isArray(copyStaticFiles)) return filesToCopy;
    for (const itemToCopy of copyStaticFiles){
        let staticPaths;
        let distPaths;
        if ($ee1123b3052bd385$exports.isString(itemToCopy)) {
            staticPaths = $9rHNX$join(projectPath, itemToCopy);
            distPaths = bundleTargets;
        } else if ($ee1123b3052bd385$exports.isPlainObject(itemToCopy)) {
            staticPaths = $9rHNX$join(projectPath, itemToCopy.from);
            distPaths = $ee1123b3052bd385$exports.isString(itemToCopy.to) ? [
                $9rHNX$join(projectPath, itemToCopy.to)
            ] : bundleTargets;
        }
        if ($9rHNX$glob.hasMagic(staticPaths)) {
            const globResults = await $15f15dd5f2e5e0b8$require$promisify($9rHNX$glob)(staticPaths); // eslint-disable-line no-await-in-loop
            staticPaths = globResults.reduce((res, _path, aIdx, arr)=>{
                if (!arr.some((p)=>p !== _path && _path.includes(p)
                )) res.push({
                    path: _path,
                    keepDir: true
                });
                return res;
            }, []);
        } else if ($ee1123b3052bd385$exports.isString(staticPaths)) staticPaths = [
            {
                path: staticPaths,
                keepDir: false
            }
        ];
        if (!$ee1123b3052bd385$exports.isEmpty(staticPaths) && !$ee1123b3052bd385$exports.isEmpty(distPaths)) filesToCopy.push({
            staticPaths: staticPaths,
            distPaths: distPaths
        });
    }
    return filesToCopy;
};
$15f15dd5f2e5e0b8$exports = $15f15dd5f2e5e0b8$var$parseSettings;


var $2898fffb5a569f43$exports = {};



var $2898fffb5a569f43$require$pathToFileURL = $9rHNX$pathToFileURL;

/**
 * Copy of target directory/file into the specified directory.
 * @param {String} filePath directory of file path
 * @param {String} fromPath path where directory/file placed
 * @param {String} toPath destination path where to copy the directory/file
 * @param {String} fileName file basename
 */ const $2898fffb5a569f43$var$syncFn = async (filePath, fromPath, toPath, fileName)=>{
    let destPath = filePath.replace(fromPath, toPath);
    if (!fileName) {
        const [accessDestErr] = await $ee1123b3052bd385$exports.await($9rHNX$access(destPath));
        if (accessDestErr) await $9rHNX$mkdir(destPath, {
            recursive: true
        });
        return;
    }
    if (fileName && $9rHNX$posix.basename(destPath) !== fileName) destPath = $9rHNX$posix.join(destPath, fileName);
    await $9rHNX$copyFile($2898fffb5a569f43$require$pathToFileURL(filePath), destPath);
};
/**
 * Recursively copies all folders & files into the specified directory.
 * @param {String} targetPath root directory to start from
 * @param {Object} options config that contain basic info to sync folders/files
 * @param {String} options.fromPath path where directory/file placed
 * @param {String} options.toPath destination path where to copy the directory/file
 * @param {Boolean} options.keepDir flag that helps determine when we should keep target folder
 * @param {Boolean} initCall flag that helps determine first call of the recursive function

 */ const $2898fffb5a569f43$var$recursiveSync = async (targetPath, options, initCall = true)=>{
    const mainStats = await $9rHNX$stat(targetPath);
    if (mainStats.isFile()) {
        await $2898fffb5a569f43$var$syncFn(targetPath, options.fromPath, options.toPath, $9rHNX$posix.basename(targetPath));
        return;
    }
    if (initCall && options.keepDir) {
        const parentDir = $9rHNX$posix.dirname(options.fromPath);
        await $2898fffb5a569f43$var$syncFn(targetPath, parentDir, options.toPath);
        const newOptions = {
            ...options,
            fromPath: parentDir
        };
        await $2898fffb5a569f43$var$recursiveSync(targetPath, newOptions, false);
        return;
    }
    const fileNames = await $9rHNX$readdir(targetPath);
    await Promise.all(fileNames.map(async (fileName)=>{
        const filePath = $9rHNX$posix.join(targetPath, fileName);
        const stats = await $9rHNX$stat(filePath);
        if (stats.isDirectory()) {
            await $2898fffb5a569f43$var$syncFn(filePath, options.fromPath, options.toPath);
            await $2898fffb5a569f43$var$recursiveSync(filePath, options, false);
            return;
        }
        await $2898fffb5a569f43$var$syncFn(filePath, options.fromPath, options.toPath, fileName);
    }));
};
const $2898fffb5a569f43$var$copyFiles = async (_fromPath, _toPath, _options = {
})=>{
    const fromPath = $9rHNX$posix.resolve(_fromPath);
    const toPath = $9rHNX$posix.resolve(_toPath);
    const options = {
        ..._options,
        fromPath: fromPath,
        toPath: toPath
    };
    const [accessErr] = await $ee1123b3052bd385$exports.await($9rHNX$access(toPath));
    if (accessErr) await $9rHNX$mkdir(toPath, {
        recursive: true
    });
    return $2898fffb5a569f43$var$recursiveSync(fromPath, options);
};
$2898fffb5a569f43$exports = $2898fffb5a569f43$var$copyFiles;


parcelRequire.register("1ezWj", function(module, exports) {
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


const $c86c7cf07722d0a1$var$opsLimiter = (parcelRequire("1ezWj"))();
const $c86c7cf07722d0a1$var$copyFileReporter = new $c86c7cf07722d0a1$require$Reporter({
    async report ({ event: event , options: options  }) {
        if (event.type === 'buildSuccess') {
            // Get all dist dir from targets, we'll copy static files into them
            const bundles = event.bundleGraph.getBundles();
            const bundleTargets = Array.from(new Set(bundles.filter((b)=>b.target && b.target.distDir
            ).map((b)=>b.target.distDir
            )));
            const filesToCopy = await $15f15dd5f2e5e0b8$exports(options.projectRoot, bundleTargets);
            if (!$ee1123b3052bd385$exports.isArray(filesToCopy)) return; // if no files to copy, there is nothing to do for us
            for (const fileToCopy of filesToCopy){
                const copyDistFn = ()=>Promise.all(fileToCopy.distPaths.map((distPath)=>Promise.all(fileToCopy.staticPaths.map((staticPath)=>$2898fffb5a569f43$exports(staticPath.path, distPath, $ee1123b3052bd385$exports.omit(staticPath, 'path'))
                        ))
                    ))
                ;
                $c86c7cf07722d0a1$var$opsLimiter.queue.push(copyDistFn);
            }
            await $c86c7cf07722d0a1$var$opsLimiter.exec(); // executing operations by chunks
        }
    }
});
$c86c7cf07722d0a1$exports = $c86c7cf07722d0a1$var$copyFileReporter;


export {$c86c7cf07722d0a1$exports as default};
//# sourceMappingURL=module.js.map
