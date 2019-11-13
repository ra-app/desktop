async function handleThirdPartyEvent(event) {
  try {
    const { data, confirm } = event;
    const { envelope, message } = data;
    console.log('handleThirdPartyEvent', envelope, message);

    const msgData = JSON.parse(message.data);

    switch(msgData.type) {
      case 'parcel':
        await thirdIPC('inboxParcel', msgData.payload);
        break;
    }

    confirm();
  } catch (err) {
    console.warn('handleThirdPartyEvent Error:', err, event);
  }
}

async function sendThirdPartyMsg(destination, data) {
  const r = await textsecure.messaging.sendThirdParty(destination, data);
  console.log('sendThirdPartyMsg', destination, data, r);
}

// document.addEventListener('DOMContentLoaded', async () => {
//   await waitForConversationController(); // Ensure we are ready for things.
//   try {
//     const reply = await thirdIPC('echo', 'derp');
//     console.log('THIRDIPC RENDER TEST REPLY:', reply);
//   } catch (err) {
//     console.warn('THIRDRPC RENDER TEST ERROR:', err);
//   }
// });

async function handleOutboxFile(message) {
  console.log('HandleOutboxFile:', message);
  await sendThirdPartyMsg('+34664666666', JSON.stringify({ type: 'parcel', payload: message }));
  return { success: true };
}

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

const thirdRPCTable = {
  'echo': (msg) => { return 'RENDER-ECHO: ' + msg; },
  'outbox_file': handleOutboxFile,
};

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

