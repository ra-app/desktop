const fs = require('fs');
const { getPath, exists } = require('./util');
const { sendOutboxFile } = require('./sending');

function getWatchEventDetails(base, eventType, filename) {
  const data = { fullPath: getPath(base, filename), created: false };
  // if (eventType === 'rename') data.created = exists(data.fullPath);
  data.created = exists(data.fullPath);
  return data;
}

// function inboxHandler(eventType, filename) {
//   try {
//     const { fullPath, created } = getWatchEventDetails('inbox', eventType, filename);
//     console.log('inboxHandler', eventType, filename, fullPath, created);
//   } catch (err) {
//     console.warn('thirdPartyNode inboxHandler Error:', err.message || err, eventType, filename);
//   }
// }

function outboxHandler(eventType, filename) {
  try {
    const { fullPath, created } = getWatchEventDetails('outbox', eventType, filename);
    // console.log('outboxHandler', eventType, filename, fullPath, created);
    if (created) sendOutboxFile(fullPath, filename);
  } catch (err) {
    console.warn('thirdPartyNode outboxHandler Error:', err.message || err, eventType, filename);
  }
}

// function localHandler(eventType, filename) {
//   try {
//     const { fullPath, created } = getWatchEventDetails('discovery/local', eventType, filename);
//     console.log('localHandler', eventType, filename, fullPath, created);
//   } catch (err) {
//     console.warn('thirdPartyNode localHandler Error:', err.message || err, eventType, filename);
//   }
// }

function ensureDirectoryStructure() {
  const folders = [
    '',
    'inbox',
    'outbox',
    'discovery',
    'discovery/local',
    'discovery/remote',
  ];
  for (const folder of folders) {
    try {
      const path = getPath(folder);
      // console.log('thirdPartyNode ensureDirectoryStructure:', folder, path);
      fs.mkdirSync(path, { recursive: true });
    } catch (err) {
      // console.warn('thirdPartyNode ensureDirectoryStructure mkdirSync Error:', err.message || err);
    }
  }
}

function createDirectoryWatchers() {
  const opts = { recursive: false };
  // fs.watch(getPath('inbox'), opts, inboxHandler);
  fs.watch(getPath('outbox'), opts, outboxHandler);
  // fs.watch(getPath('discovery/local'), opts, localHandler);
  // fs.watch(getPath('discovery'), fileHandler);
  // fs.watch(getPath('discovery/remote'), fileHandler);
  // fs.watch(getPath(''), fileHandler);
}

async function handleExistingOutboxFiles() {
  return new Promise((resolve) => {
    fs.readdir(getPath('outbox'), async (err, files) => {
      if (err) resolve(); // Ignore error
      for (let file of files) {
        await sendOutboxFile(getPath('outbox', file), file);
      }
      resolve();
    })
  });
}

module.exports = {
  ensureDirectoryStructure,
  createDirectoryWatchers,
  handleExistingOutboxFiles,
};