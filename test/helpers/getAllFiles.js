const fs = require('fs/promises');
const path = require('path');

const getAllFiles = async dirPath => {
  const allFiles = [];
  const dirFiles = await fs.readdir(dirPath);

  for (const file of dirFiles) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);

    if (stats.isDirectory()) {
      const files = await getAllFiles(filePath);
      allFiles.push(...files);
      continue;
    }

    allFiles.push(filePath);
  }

  return allFiles;
}

module.exports = getAllFiles;
