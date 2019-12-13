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
  // console.log('handleRPCOutboxFile:', message);
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
  // console.log('createAttachmentPointer buffer', buffer);
  // if (!(buffer instanceof ArrayBuffer)) buffer = new Uint8Array(buffer).buffer;
  const file = { data: buffer, size: buffer.byteLength };
  const res = await textsecure.messaging.makeAttachmentPointer(file, false);
  // console.log('createAttachmentPointer', file, res);
  return res;
}

async function handleAttachmentPointer(attachment) {
  // const res = await window.getReceiver().handleAttachment(attachment);
  // console.log('handleAttachmentPointer attachment', attachment);
  const res = await window.getReceiver().downloadAttachment(attachment);
  // console.log('handleAttachmentPointer res', res);
  return res;
}

async function deleteAttachmentPointer(attachment) {
  // console.log('deleteAttachmentPointer attachment', attachment);
  const res = await window.getReceiver().deleteAttachment(attachment);
  // console.log('deleteAttachmentPointer res', res);
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
        result = JSON.parse(result);
        // console.log('RESULT', ID, event, result);
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
  // console.log('THIRDRPC', event, ID, type, args);
  const result = { error: undefined, data: undefined };
  try {
    result.data = await thirdRPCTable[type](...args);
  } catch (err) {
    console.warn('ThirdIPC Render Handler Error:', err, event, ID, type, args);
    result.error = err.message || err;
  }
  window.ipc.send(ID, JSON.stringify(result));
  // window.ipc.send(ID, result);
});

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
  console.warn('background_thirdparty toJSON error:', err);
}

try {
  if (!('toJSON' in ArrayBuffer.prototype)) {
    Object.defineProperty(ArrayBuffer.prototype, 'toJSON', {
      value: function () {
        return Array.from(new Uint8Array(this));
      },
      configurable: true,
      writable: true
    });
  }
} catch (err) {
  console.warn('background_thirdparty toJSON error:', err);
}

// === IPC/RPC Sys End ===

// === ThirdParty Signal Message Handling Start ===

async function handleThirdPartyEvent(event) {
  try {
    const { data, confirm } = event;
    const { envelope, message } = data;
    // console.log('handleThirdPartyEvent', envelope, message);

    let msgData;
    try {
      msgData = JSON.parse(message.data);
    } catch(err) {
      console.warn('handleThirdPartyEvent Error parsing json:', err);
      return confirm(); // No need to return bad messages.
    }

    switch(msgData.type) {
      case 'parcel':
        await thirdIPC('inboxParcel', msgData.payload, envelope.source);
        break;
      default:
        console.warn('handleThirdPartyEvent - Unknown message type', msgData.type);
        break;
    }

    confirm(); // Inform signal that message was handled correctly, safe to remove from queue.
  } catch (err) {
    console.warn('handleThirdPartyEvent Error:', err, event);
    throw err;
  }
}

async function sendThirdPartyMsg(destination, raw) {
  const data = (typeof raw === 'object') ? JSON.stringify(raw) : raw;
  try {
    const r = await textsecure.messaging.sendThirdParty(destination, data, {});
    // console.log('sendThirdPartyMsg', destination, {data, r});
    return r;
  } catch (err) {
    // console.warn('derp', err);
    if (err.errors && err.errors.length > 0 && err.errors[0].name === 'OutgoingIdentityKeyError') {  
      await resetSession(destination);
      return sendThirdPartyMsg(destination, raw);
    }
    throw err;
  }
}

async function resetSession(destination) {
  await textsecure.storage.protocol.removeIdentityKey(destination);
  // return await textsecure.messaging.resetSession(destination, Date.now(), {});
}
// === ThirdParty Signal Message Handling End ===

// const aSleep = (ms) => { return new Promise(resolve => setTimeout(resolve, ms)); };
// setTimeout(async () => {
//   for (let i = 1; i < 50; i++) {
//     const size = 1024 * 1024 * i;
//     const data = { arr: (new Array(size)).fill(0) };
//     const string = JSON.stringify(data);
//     console.log('Trying to send', i, size, string.length, string.length / (1024 * 1024));
//     try {
//       await sendThirdPartyMsg('+34000000001', string);
//     } catch (err) {
//       console.warn('Error:', err);
//       break;
//     }
//     await aSleep(1000);
//   }
// }, 5000);