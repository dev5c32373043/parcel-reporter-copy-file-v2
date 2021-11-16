const assert = require('assert');

const fs = require('fs/promises');

const copyFiles = require('../../src/copyFiles');

const cleanResultsFolder = require('../helpers/cleanResultsFolder');
const getAllFiles = require('../helpers/getAllFiles');

const rootPath = `${process.cwd()}/test`;

describe('Copy files', () => {
  beforeEach(async () => {
    await cleanResultsFolder();
  });

  const distPath = `${rootPath}/results`;

  it('should copy file into dist folder when file1.txt chosen', async () => {
    await copyFiles(`${rootPath}/fixtures/files/file1.txt`, distPath);
    await assert.doesNotReject(fs.access(`${rootPath}/results/file1.txt`));
    const files = await getAllFiles(distPath);
    assert.equal(files.length, 1);
  });

  it('should copy files into dist folder when files/embed/* chosen', async () => {
    await copyFiles(`${rootPath}/fixtures/files/embed/`, distPath);
    await assert.doesNotReject(fs.access(`${rootPath}/results/file2.txt`));
    await assert.doesNotReject(fs.access(`${rootPath}/results/embed2/file3.txt`));
    const files = await getAllFiles(distPath);
    assert.equal(files.length, 2);
  });

  it('should copy files into dist folder when files/**/* chosen', async () => {
    await copyFiles(`${rootPath}/fixtures/files`, distPath);
    await assert.doesNotReject(fs.access(`${rootPath}/results/file1.txt`));
    await assert.doesNotReject(fs.access(`${rootPath}/results/embed/file2.txt`));
    await assert.doesNotReject(fs.access(`${rootPath}/results/embed/embed2/file3.txt`));
    const files = await getAllFiles(distPath);
    assert.equal(files.length, 3);
  });

  it('should keep folder when glob path provided', async () => {
    await copyFiles(`${rootPath}/fixtures/files/embed/embed2`, distPath, { keepDir: true });
    await assert.doesNotReject(fs.access(`${rootPath}/results/embed2/file3.txt`));
    const files = await getAllFiles(distPath);
    assert.equal(files.length, 1);
  });
});
