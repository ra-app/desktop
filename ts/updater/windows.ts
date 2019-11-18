import { dirname, join } from 'path';
import { spawn as spawnEmitter, SpawnOptions } from 'child_process';
import { readdir as readdirCallback, unlink as unlinkCallback, existsSync } from 'fs';

import { app, BrowserWindow, ipcMain, IpcMessageEvent } from 'electron';
import { get as getFromConfig } from 'config';
import { gt } from 'semver';
import pify from 'pify';
import path from 'path';

import {
  checkForUpdates,
  deleteTempDir,
  downloadUpdate,
  getPrintableError,
  LoggerType,
  MessagesType,
  showCannotUpdateDialog,
  // showUpdateDialog,
} from './common';
import { hexToBinary, verifySignature } from './signature';
import { markShouldQuit } from '../../app/window_state';
import got from 'got';

const readdir = pify(readdirCallback);
const unlink = pify(unlinkCallback);

let isChecking = false;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const INTERVAL = MINUTE * 360;

export async function start(
  getMainWindow: () => BrowserWindow,
  messages: MessagesType,
  logger: LoggerType
) {
  logger.info('windows/start: starting checks...');

  // loggerForQuitHandler = logger;
  app.once('quit', quitHandler);
  // await quitHandler(getMainWindow);

  setInterval(async () => {
    try {
      await checkDownloadAndInstall(getMainWindow, messages, logger);
    } catch (error) {
      logger.error('windows/start: error:', getPrintableError(error));
    }
  }, INTERVAL);

  // await deletePreviousInstallers(logger);
  await checkDownloadAndInstall(getMainWindow, messages, logger);
}

let fileName: string;
let version: string;
let updateFilePath: string;
// let installing: boolean;
// let loggerForQuitHandler: LoggerType;

function waitForMessage(channel: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      ipcMain.once(channel, (_: IpcMessageEvent, msg: Object) => {
        resolve(msg);
      });
    } catch (err) { reject(err); }
  });
}

async function checkDownloadAndInstall(
  getMainWindow: () => BrowserWindow,
  messages: MessagesType,
  logger: LoggerType
) {
  if (isChecking) {
    return;
  }

  try {
    isChecking = true;

    logger.info('checkDownloadAndInstall: checking for update...');
    const result = await checkForUpdates(logger);
    logger.info('checkDownloadAndInstall: Update result:', result);
    if (!result) {
      return getMainWindow().webContents.send('update', { status: 'up-to-date' });
    }

    const checkUpdatePromise = waitForMessage('checkUpdate');
    getMainWindow().webContents.send('update', { status: 'checking' });
    const checkUpdate = await checkUpdatePromise;
    // logger.info('checkUpdate', checkUpdate);
    const shouldUsePrevious = checkUpdate.localStorageData !== undefined && typeof checkUpdate.localStorageData === 'string' && checkUpdate.localStorageData.indexOf(result.fileName) !== -1 && existsSync(checkUpdate.localStorageData);
    logger.info('checkDownloadAndInstall: Existing update', checkUpdate, shouldUsePrevious);
    if (shouldUsePrevious) {
      updateFilePath = checkUpdate.localStorageData;
      version = checkUpdate.localStorageDataVersion;
      fileName = checkUpdate.localStorageDataFileName;
      // getMainWindow().webContents.send('update', { status: 'initInstall' });
      // const startInstall = await waitForMessage('startInstall');
      // if (startInstall) {
      //   await verifyAndInstall(updateFilePath, version, logger);
      //   await deletePreviousInstallers(logger);
      // } else {
      //   return getMainWindow().webContents.send('update', { status: 'canceled' });
      // }
    }

    // logger.info('checkDownloadAndInstall: showing dialog...');
    // // const shouldUpdate = await showUpdateDialog(getMainWindow(), messages);
    // const shouldUpdate = await waitForMessage('update-shouldUpdate');
    // if (!shouldUpdate) {
    //   return getMainWindow().webContents.send('update', { status: 'canceled' });
    // }

    if (!updateFilePath) {
      const startDownloadPromise = waitForMessage('start-download');
      getMainWindow().webContents.send('update', { status: 'update_found' });
      const startDownload = await startDownloadPromise;
      if (startDownload) {
        await deletePreviousInstallers(logger);
        getMainWindow().webContents.send('update', { status: 'starting_download' });
        let lastPercent = 0;
        function progressCB(progress: got.Progress) {
          if ((progress.percent - lastPercent) > 0.001) {
            lastPercent = progress.percent;
            getMainWindow().webContents.send('update', { status: 'dl_progress', progress });
          }
        }

        // const cancelationRequestPromise = new Promise(async resolve => {
        //   const cancel = await waitForMessage('cancel-download');
        //   resolve(!!cancel);
        // });

        try {
          const { fileName: newFileName, version: newVersion } = result;
          if (fileName !== newFileName || !version || gt(newVersion, version)) {
            deleteCache(updateFilePath, logger);
            fileName = newFileName;
            version = newVersion;
            updateFilePath = await downloadUpdate(fileName, logger, progressCB); // , cancelationRequestPromise);
          }
        } catch (error) {
          logger.info(
            'checkDownloadAndInstall: showing general update failure dialog...'
          );
          await showCannotUpdateDialog(getMainWindow(), messages);
          throw error;
        }
      } else {
        return getMainWindow().webContents.send('update', { status: 'canceled' });
      }
    }

    const startInstallPromise = waitForMessage('startInstall');
    getMainWindow().webContents.send('update', { status: 'download_finished', updateFilePath, version, fileName });
    const startInstall = await startInstallPromise;
    if (startInstall) {
    // const shouldInstall = await waitForMessage('shouldInstall');
    // if (shouldInstall === true) {
      try {
        const publicKey = hexToBinary(getFromConfig('updatesPublicKey'));
        const verified = await verifySignature(updateFilePath, version, publicKey);
        if (!verified) {
          // Note: We don't delete the cache here, because we don't want to continually
          //   re-download the broken release. We will download it only once per launch.
          throw new Error(
            `Downloaded update did not pass signature verification (version: '${version}'; fileName: '${fileName}')`
          );
        }
        await verifyAndInstall(updateFilePath, version, logger);
        await deletePreviousInstallers(logger);
        // installing = true;
      } catch (error) {
        logger.info(
          'checkDownloadAndInstall: showing general update failure dialog...'
        );
        await showCannotUpdateDialog(getMainWindow(), messages);
        throw error;
      }
    } else {
      // await deletePreviousInstallers(logger);
      return getMainWindow().webContents.send('update', { status: 'canceled' });
    }

    markShouldQuit();
    app.quit();
  } catch (error) {
    logger.error('checkDownloadAndInstall: error', getPrintableError(error));
  } finally {
    isChecking = false;
  }
}
  function quitHandler() {
    // const test = false;
    // if(test) {
    //   if (updateFilePath && !installing) {
    //     // tslint:disable-next-line:no-console
    //     // console.log('EEEEEEEEEEEEEEEEE');
    //     // getMainWindow().webContents.send('update', { status: 'initInstall' });
    //     // const startInstall = await waitForMessage('startInstall');
    //     // if(startInstall) {
    //       verifyAndInstall(updateFilePath, version, loggerForQuitHandler).catch(
    //         error => {
    //           loggerForQuitHandler.error(
    //             'quitHandler: error installing:',
    //             getPrintableError(error)
    //           );
    //         }
    //       );
    //     // }
    //   } else {
    //     return;
    //   }

    // }
  }


// Helpers

// This is fixed by out new install mechanisms...
//   https://github.com/signalapp/Signal-Desktop/issues/2369
// ...but we should also clean up those old installers.
const IS_EXE = /\.exe$/i;
const IS_SIG = /\.sig$/i;
async function deletePreviousInstallers(logger: LoggerType) {
  // return;
  try {
    const userDataPath = path.join(app.getPath('userData'), 'update');
    const files: Array<string> = await readdir(userDataPath);
    await Promise.all(
      files.map(async file => {
        const isExe = IS_EXE.test(file);
        const isSig = IS_SIG.test(file);
        logger.info('deletePreviousInstallers', file, isExe, isSig);
        if (!isExe && !isSig) {
          return;
        }

        const fullPath = join(userDataPath, file);
        try {
          await unlink(fullPath);
        } catch (error) {
          logger.error(`deletePreviousInstallers: couldn't delete file ${file}`);
        }
      })
    );
  } catch (err) {
    logger.error('deletePreviousInstallers:', err);
  }
}

async function verifyAndInstall(
  filePath: string,
  newVersion: string,
  logger: LoggerType
) {
  const publicKey = hexToBinary(getFromConfig('updatesPublicKey'));
  const verified = await verifySignature(updateFilePath, newVersion, publicKey);
  if (!verified) {
    throw new Error(
      `Downloaded update did not pass signature verification (version: '${newVersion}'; fileName: '${fileName}')`
    );
  }

  await install(filePath, logger);
}

async function install(filePath: string, logger: LoggerType): Promise<void> {
  logger.info('windows/install: installing package...');
  const args = ['--updated'];
  const options = {
    detached: true,
    stdio: 'ignore' as 'ignore', // TypeScript considers this a plain string without help
  };

  try {
    await spawn(filePath, args, options);
  } catch (error) {
    if (error.code === 'UNKNOWN' || error.code === 'EACCES') {
      logger.warn(
        'windows/install: Error running installer; Trying again with elevate.exe'
      );
      await spawn(getElevatePath(), [filePath, ...args], options);

      return;
    }

    throw error;
  }
}

function deleteCache(filePath: string | null, logger: LoggerType) {
  if (filePath) {
    const tempDir = dirname(filePath);
    deleteTempDir(tempDir).catch(error => {
      logger.error(
        'deleteCache: error deleting temporary directory',
        getPrintableError(error)
      );
    });
  }
}
function getElevatePath() {
  const installPath = app.getAppPath();

  return join(installPath, 'resources', 'elevate.exe');
}

async function spawn(
  exe: string,
  args: Array<string>,
  options: SpawnOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const emitter = spawnEmitter(exe, args, options);
    emitter.on('error', reject);
    emitter.unref();

    // tslint:disable-next-line no-string-based-set-timeout
    setTimeout(resolve, 200);
  });
}
