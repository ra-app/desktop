const fs = require('fs');

const { getPath } = require('./util');
const { handleAttachmentPointer, deleteAttachmentPointer } = require('./ipc');

async function handleInboxParcel(message, sourceAddr) {
  // console.log('InboxParcel', message, sourceAddr);
  // fs.writeFileSync(getPath('inbox', randomID() + '_' + sourceAddr + '_' + message.filename), Buffer.from(message.content));

  let data;

  if (message.content) {
    data = Buffer.from(message.content);
  } else if (message.attachment) {
    data = Buffer.from(
      (await handleAttachmentPointer(message.attachment)).data
    );
  } else {
    throw new Error('Invalid message!');
  }

  fs.writeFileSync(
    getPath('inbox', Date.now() + '_' + sourceAddr + '_' + message.filename),
    data
  );

  if (message.attachment) await deleteAttachmentPointer(message.attachment);
}

module.exports = {
  handleInboxParcel,
};
