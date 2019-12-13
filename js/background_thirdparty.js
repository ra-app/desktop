// RPC Handler table
const thirdRPCTable = {
  'echo': (msg) => { return 'RENDER-ECHO: ' + msg; },
  'outbox_file': handleRPCOutboxFile,
  'getMetaInfo': getThirdPartyMetaInfo,
  'getCompaniesForMe': () => { return getCompaniesForMe(); },
  'createAttachmentPointer': createAttachmentPointer,
  'handleAttachmentPointer': handleAttachmentPointer,
  'deleteAttachmentPointer': deleteAttachmentPointer,
};

async function handleRPCOutboxFile(destination, message) {
  console.log('handleRPCOutboxFile:', message);
  // const result = await sendThirdPartyMsg(destination, JSON.stringify({ type: 'parcel', payload: message }));
  const result = await sendThirdPartyMsg(destination, { type: 'parcel', payload: message });
  return { success: true, result }; // TODO: Check for errors in sending message?
}

async function getThirdPartyMetaInfo() {
  return {
    ownPhoneNumber: getOwnNumber(),
  };
}

async function createAttachmentPointer(buffer) {
  const file = { data: buffer, size: buffer.byteLength || buffer.length };
  const res = await textsecure.messaging.makeAttachmentPointer(file, false);
  console.log('createAttachmentPointer', file, res);
  return res;
}

async function handleAttachmentPointer(attachment) {
  // const res = await window.getReceiver().handleAttachment(attachment);
  const res = await window.getReceiver().downloadAttachment(attachment);
  console.log('handleAttachmentPointer', attachment, res);
  return res;
}

async function deleteAttachmentPointer(attachment) {
  const res = await window.getReceiver().deleteAttachment(attachment);
  console.log('deleteAttachmentPointer', attachment, res);
  return res;
}

// setTimeout(async () => {
//   const attachment = await createAttachmentPointer(new ArrayBuffer(1024));
//   const dl = await handleAttachmentPointer(attachment);
//   console.log('TEST', dl);
  
//   const del = await deleteAttachmentPointer(attachment);
//   console.log('TEST 3', del);
//   const del2 = await deleteAttachmentPointer(attachment);
//   console.log('TEST 4', del2);

//   const dl2 = await handleAttachmentPointer(attachment);
//   console.log('TEST 2', dl2);
// }, 5000);

// === IPC/RPC Sys Start ===

function thirdIPC(type, ...args) {
  const ID = Math.floor(Math.random() * 999999) + '-' + Date.now();
  return new Promise((resolve, reject) => {
    try {
      window.ipc.once(ID, (event, result) => {
        console.log('RESULT', ID, event, result);
        if (result.error) reject(result.error);
        else resolve(result.data);
      });
      window.ipc.send('third_ipc', ID, type, ...args);
    } catch (err) {
      reject(err);
    }
  });
}

window.ipc.on('third_ipc', async (event, ID, type, ...args) => {
  console.log('THIRDRPC', event, ID, type, args);
  const result = { error: undefined, data: undefined };
  try {
    result.data = await thirdRPCTable[type](...args);
  } catch (err) {
    console.warn('ThirdIPC Render Handler Error:', err, event, ID, type, args);
    result.error = err.message || err;
    result.data = undefined;
  }
  window.ipc.send(ID, result);
});

// === IPC/RPC Sys End ===

// === ThirdParty Signal Message Handling Start ===

async function handleThirdPartyEvent(event) {
  try {
    const { data, confirm } = event;
    const { envelope, message } = data;
    console.log('handleThirdPartyEvent', envelope, message);

    const msgData = JSON.parse(message.data);

    switch(msgData.type) {
      case 'parcel':
        await thirdIPC('inboxParcel', msgData.payload, envelope.source);
        break;
      default:
        console.warn('handleThirdPartyEvent - Unknown message type', msgData,type);
        break;
    }

    confirm(); // Inform signal that message was handled correctly, safe to remove from queue.
  } catch (err) {
    console.warn('handleThirdPartyEvent Error:', err, event);
  }
}

async function sendThirdPartyMsg(destination, raw) {
  const data = (typeof raw === 'object') ? JSON.stringify(raw) : raw;
  const r = await textsecure.messaging.sendThirdParty(destination, data);
  console.log('sendThirdPartyMsg', destination, data, r);
  return r;
}

// === ThirdParty Signal Message Handling End ===
