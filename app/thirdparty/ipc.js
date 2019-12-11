const { ipcMain } = require('electron');

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
  return ipcMain.once(channel, listener);
}


const thirdRPCTable = {
  'echo': (msg) => { return 'NODE-ECHO: ' + msg; },
  // 'inboxParcel': handleInboxParcel, // Now set externally
};


let mainWindow = null;
function initRPC(window) {
  mainWindow = window;
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

function waitForWindowReady(window) {
  return new Promise((resolve) => {
    window.webContents.once('did-finish-load', resolve);
  });
}

// async function testRPC() {
//   try {
//     const reply = await thirdIPC('echo', 'derp');
//     console.log('THIRDIPC NODE TEST REPLY:', reply);
//   } catch (err) {
//     console.warn('THIRDRPC NODE TEST ERROR:', err.message || err);
//   }
// }

module.exports = {
  thirdIPC,
  ipcSend,
  ipcOnce,
  initRPC,
  waitForWindowReady,
  // testRPC,
  thirdRPCTable,
};