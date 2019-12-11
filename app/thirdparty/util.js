const { app } = require('electron');
const path = require('path');
const fs = require('fs');

try {
  // https://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify
  if (!('toJSON' in Error.prototype)) {
    Object.defineProperty(Error.prototype, 'toJSON', {
      value: function () {
        var alt = {};
        Object.getOwnPropertyNames(this).forEach(function (key) {
          alt[key] = this[key];
        }, this);
        return alt;
      },
      configurable: true,
      writable: true
    });
  }
} catch (err) {
  console.warn('ThirdPartyNode util toJSON error:', err);
}

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