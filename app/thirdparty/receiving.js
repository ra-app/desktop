const fs = require('fs');

const { getPath } = require('./util');

async function handleInboxParcel(message, sourceAddr) {
  console.log('InboxParcel', message, sourceAddr);
  // fs.writeFileSync(getPath('inbox', randomID() + '_' + sourceAddr + '_' + message.filename), Buffer.from(message.content));
  fs.writeFileSync(getPath('inbox', Date.now() + '_' + sourceAddr + '_' + message.filename), Buffer.from(message.content));
}

module.exports = {
  handleInboxParcel,
};