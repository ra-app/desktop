
const { app } = require('electron');

const { ipcMain } = require('electron');

const path = require('path');
const fs = require('fs');
const parseStringPromise = require('xml2js').parseStringPromise;

function getPath(...relativePath) {
  // return path.join(__dirname, 'third_party', ...relativePath);
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
      console.log('thirdPartyNode ensureDirectoryStructure:', folder, path);
      fs.mkdirSync(path, { recursive: true });
    } catch (err) {
      // console.warn('thirdPartyNode ensureDirectoryStructure mkdirSync Error:', err.message || err);
    }
  }
}

function getWatchEventDetails(base, eventType, filename) {
  const data = { fullPath: getPath(base, filename), created: false };
  // if (eventType === 'rename') data.created = exists(data.fullPath);
  data.created = exists(data.fullPath);
  return data;
}

function inboxHandler(eventType, filename) {
  try {
    const { fullPath, created } = getWatchEventDetails('inbox', eventType, filename);
    console.log('inboxHandler', eventType, filename, fullPath, created);
  } catch (err) {
    console.warn('thirdPartyNode inboxHandler Error:', err.message || err, base, eventType, filename);
  }
}

async function extractInfoFromXML(xmlContent) {
  const parsed = await parseStringPromise(xmlContent, { strict: false, normalizeTags: true, trim: true, normalize: true });
  // console.log('PARSED', JSON.stringify(parsed));
  if (!parsed) { throw new Error('Parsed was null!'); }
  return { destination: parsed.destination }
}

const fileLocks = {};
async function sendOutboxFile(fullPath, filename) {
  try {
    if (filename.indexOf('.xml') === -1 && filename.indexOf('.json') === -1) return;

    if (fileLocks[fullPath]) {
      console.log('sendOutboxFile - Already handling', filename);
      return;
    }

    fileLocks[fullPath] = true;
    const content = fs.readFileSync(fullPath);

    let destination;

    if (filename.indexOf('.xml') !== -1) {
      const info = await extractInfoFromXML(content);
      destination = info.destination;
    } else if (filename.indexOf('.json') !== -1) {
      const info = JSON.parse(content);
      destination = info.destination;
    } else {
      throw new Error('Invalid file extension!');
    }

    if (!destination) { throw new Error('Missing destination!'); }

    const response = await thirdIPC('outbox_file', destination, { content, filename });
    console.log('thirdPartyNode sendOutboxFile', fullPath, destination, content.toString(), response);
    if (response && response.success) {
      deleteFile(fullPath);
    }
  } catch (err) {
    console.warn('thirdPartyNode sendOutboxFile Error:', err.message || err, fullPath);
  }
  fileLocks[fullPath] = false;
}

function outboxHandler(eventType, filename) {
  try {
    const { fullPath, created } = getWatchEventDetails('outbox', eventType, filename);
    console.log('outboxHandler', eventType, filename, fullPath, created);
    if (created) sendOutboxFile(fullPath, filename);
  } catch (err) {
    console.warn('thirdPartyNode outboxHandler Error:', err.message || err, base, eventType, filename);
  }
}

function localHandler(eventType, filename) {
  try {
    const { fullPath, created } = getWatchEventDetails('discovery/local', eventType, filename);
    console.log('localHandler', eventType, filename, fullPath, created);
  } catch (err) {
    console.warn('thirdPartyNode localHandler Error:', err.message || err, base, eventType, filename);
  }
}

function createDirectoryWatchers() {
  const opts = { recursive: false };
  fs.watch(getPath('inbox'), opts, inboxHandler);
  fs.watch(getPath('outbox'), opts, outboxHandler);
  fs.watch(getPath('discovery/local'), opts, localHandler);
  // fs.watch(getPath('discovery'), fileHandler);
  // fs.watch(getPath('discovery/remote'), fileHandler);
  // fs.watch(getPath(''), fileHandler);
}

function thirdIPC(type, ...args) {
  const ID = Math.floor(Math.random() * 999999) + '-' + Date.now();
  return new Promise((resolve, reject) => {
    try {
      ipcOnce(ID, (event, result) => {
        console.log('RESULT', ID, event, result);
        if (result.error) reject(result.error);
        else resolve(result.data);
      });
      ipcSend('third_ipc', ID, type, ...args);
    } catch (err) {
      reject(err);
    }
  });
}

function ipcSend(...args) {
  if (!mainWindow) throw new Error('Missing mainWindow!');
  return mainWindow.webContents.send(...args);
}

function ipcOnce(channel, listener) {
  // if (!mainWindow) throw new Error('Missing mainWindow!');
  // return mainWindow.webContents.once(...args);
  return ipcMain.once(channel, listener);
}

function randomID() {
  return Math.floor(Math.random() * 9999) + '_' + Date.now();
}

async function handleInboxParcel(message, sourceAddr) {
  console.log('InboxParcel', message, sourceAddr);
  // fs.writeFileSync(getPath('inbox', randomID() + '_' + sourceAddr + '_' + message.filename), Buffer.from(message.content));
  fs.writeFileSync(getPath('inbox', Date.now() + '_' + sourceAddr + '_' + message.filename), Buffer.from(message.content));
}

const thirdRPCTable = {
  'echo': (msg) => { return 'NODE-ECHO: ' + msg; },
  'inboxParcel': handleInboxParcel,
};

function initRPC() {
  ipcMain.on('third_ipc', async (event, ID, type, ...args) => {
    console.log('THIRDRPC', event, ID, type, args);
    const result = { error: undefined, data: undefined };
    try {
      result.data = await thirdRPCTable[type](...args);
    } catch (err) {
      console.warn('ThirdIPC Node Handler Error:', err.message || err, event, ID, type, args);
      result.error = err.message || err;
      result.data = undefined;
    }
    ipcSend(ID, result);
  });
}

async function testRPC() {
  try {
    const reply = await thirdIPC('echo', 'derp');
    console.log('THIRDIPC NODE TEST REPLY:', reply);
  } catch (err) {
    console.warn('THIRDRPC NODE TEST ERROR:', err.message || err);
  }
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

function waitForWindowReady(window) {
  return new Promise((resolve) => {
    window.webContents.once('did-finish-load', resolve);
  });
}

let mainWindow = null;
async function init(window) {
  try {
    mainWindow = window;
    ensureDirectoryStructure();
    await waitForWindowReady(window);
    initRPC();
    await handleExistingOutboxFiles();
    createDirectoryWatchers();

    setInterval(handleExistingOutboxFiles, 60000 * 5);
    
    // setTimeout(testRPC, 5000);
  } catch (err) {
    console.warn('thirdPartyNode init Error:', err.message || err);
  }
};

module.exports = {
  init,
};