const { initRPC, thirdRPCTable, waitForWindowReady, getMetaInfo } = require('./thirdparty/ipc');
const { ensureDirectoryStructure, createDirectoryWatchers, handleExistingOutboxFiles } = require('./thirdparty/watch');
const { handleInboxParcel } = require('./thirdparty/receiving');

// async function writeMetaFiles() {
//   const data = await getMetaInfo();
// }

async function init(window) {
  try {
    thirdRPCTable['inboxParcel'] = handleInboxParcel;

    ensureDirectoryStructure();
    await waitForWindowReady(window);
    initRPC(window);
    await handleExistingOutboxFiles();
    createDirectoryWatchers();

    setInterval(handleExistingOutboxFiles, 60000 * 5);

    // setTimeout(testRPC, 5000);
  } catch (err) {
    console.warn('thirdPartyNode init Error:', err.message || err);
  }
}

module.exports = {
  init,
};