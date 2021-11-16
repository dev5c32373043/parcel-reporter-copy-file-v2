const assert = require('assert');

const basePath = `${process.cwd()}/test/fixtures`;
const parseSettings = require('../../src/parseSettings');

describe('Parse settings', () => {
  it('should properly parse all settings from package.json', async () => {
    const expectedResult = [
      { staticPaths: [{ path: `${basePath}/files/file1.txt`, keepDir: false }], distPaths: [`${basePath}/results`] },
      { staticPaths: [{ path: `${basePath}/files/embed/file2.txt`, keepDir: true }], distPaths: [`${basePath}/results`] },
      { staticPaths: [{ path: `${basePath}/files/file1.txt`, keepDir: false }], distPaths: [`${basePath}/results1`] },
      {
        staticPaths: [
          { path: `${basePath}/files/embed/embed2`, keepDir: true },
          { path: `${basePath}/files/embed/file2.txt`, keepDir: true },
        ],
        distPaths: [`${basePath}/results2`],
      },
      {
        staticPaths: [
          { path: `${basePath}/files/embed`, keepDir: true },
          { path: `${basePath}/files/file1.txt`, keepDir: true },
        ],
        distPaths: [`${basePath}/results3`],
      },
    ];

    const settings = await parseSettings(basePath, [`${basePath}/results`]);
    assert.deepEqual(settings, expectedResult);
  });
});
