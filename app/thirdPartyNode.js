const { initRPC, thirdRPCTable, waitForWindowReady } = require('./thirdparty/ipc');
const { ensureDirectoryStructure, createDirectoryWatchers, handleExistingOutboxFiles } = require('./thirdparty/watch');
const { handleInboxParcel } = require('./thirdparty/receiving');
const { initDiscovery } = require('./thirdparty/discovery');

async function init(window) {
  try {
    thirdRPCTable['inboxParcel'] = handleInboxParcel;

    ensureDirectoryStructure();
    await waitForWindowReady(window);
    initRPC(window);
    await initDiscovery();
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