const { app } = require('electron');
const path = require('path');
const fs = require('fs');

function randomID() {
  return Math.floor(Math.random() * 9999) + '_' + Date.now();
}

function getPath(...relativePath) {
  return path.join(app ? app.getPath('userData') : __dirname, 'third_party', ...relativePath);
}

function exists(fullPath) {
  try {
    return fs.existsSync(fullPath);
  } catch (err) {
    console.warn('thirdPartyNode exists Error:', err.message || err, fullPath);
    return false;
  }
}

function deleteFile(fullPath) {
  try {
    return fs.unlinkSync(fullPath);
  } catch (err) {
    console.warn('thirdPartyNode deleteFile Error:', err.message || err, fullPath);
    return false;
  }
}

function getExtension(path) {
  const n = path.split('.');
  return n[n.length - 1];
}

module.exports = {
  randomID,
  getPath,
  exists,
  deleteFile,
  getExtension,
};