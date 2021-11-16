[![CircleCI](https://circleci.com/gh/dev5c32373043/parcel-reporter-copy-file-v2/tree/main.svg?style=svg)](https://circleci.com/gh/dev5c32373043/parcel-reporter-copy-file-v2/tree/main)

# parcel-reporter-copy-file-v2

Reporter to copy static files for Parcel V2 (**buildSuccess** event)

## Install

Using npm:
```shell
npm install -D parcel-reporter-copy-file-v2
```
Using yarn:
```shell
yarn add -D parcel-reporter-copy-file-v2
```
Using bower:
```shell
bower install -D parcel-reporter-copy-file-v2
```

## Configuration

First of all, add a new reporter in the Parcel config.

*.parcelrc*
```json
{
  "extends": ["@parcel/config-default"],
  "reporters":  ["parcel-reporter-copy-file-v2"]
}
```
Then define config to copy static files in the package.json of the project

*package.json*
```json
{
  ...
  "copyStaticFiles": [
    "files/file1.txt",
    "files/embed/*.txt",
    { "from": "files/file1.txt", "to": "results1" },
    { "from": "files/embed/*", "to": "results2" },
    { "from": "files/**/*", "to": "results3" }
  ]
}
```

#### from
Type: `String`  
Required: `true`  
Glob or relative path from where we copy files (root path taked from Parcel **projectRoot** config key)

#### to
Type: `String|Array<String>`  
Default: Parcel dist folders configuration
Output relative path (root path taked from Parcel **projectRoot** config key)


## Requirements
* [Node.js][node] 10.12.0+
* [Parcel][parcel] 2.0.0+


[node]: https://nodejs.org/
[parcel]: https://parceljs.org/

## Contributing
Any contribution is highly appreciated.

## Licensing
The code in this project is licensed under [MIT](/LICENSE) license.