'use strict';

// Testing Playground
document.addEventListener('DOMContentLoaded', async () => {
  await ensureCompanyConversation('0000000', 'Mega Corporate');
  await ensureCompanyConversation('0000001', "Boris's Great Solutions");
});

// ===

const API_URL = 'https://luydm9sd26.execute-api.eu-central-1.amazonaws.com/latest/';


// Receives messages to send from conversations.js switchcase.
async function sendCompanyMessage(destination, messageBody, finalAttachments, quote, preview, sticker, now, expireTimer, profileKey, options) {
  const messageInfo = { destination, messageBody, finalAttachments, quote, preview, sticker, now };
  
  inboxMessage(messageInfo);

  return { sent_to: destination };
}

async function inboxMessage(messageInfo) {
  console.log('inboxMessage -- MessageInfo:', messageInfo);
  const response = await apiRequest('api/inbox', messageInfo);
  console.log('inboxMessage -- response:', response);

  const data = {
    source: messageInfo.destination,
    sourceDevice: 1,
    sent_at: Date.now(),
    conversationId: messageInfo.destination,
    message: {
      body: response.text,
    },
  };

  return receiveCompanyMessage(data);
}

function receiveCompanyMessage(data) {
  return new Promise(async (resolve) => {
    const message = new Whisper.Message({
      source: data.source,
      sourceDevice: data.sourceDevice || 1,
      sent_at: data.timestamp || Date.now(),
      received_at: data.receivedAt || Date.now(),
      conversationId: data.source,
      unidentifiedDeliveryReceived: data.unidentifiedDeliveryReceived,
      type: 'incoming',
      unread: 1,
    });
    
    console.log('receiveCompanyMessage', data, message);
    
    // const message = await initIncomingMessage(data);
    await ConversationController.getOrCreateAndWait(data.source, 'company');
    return message.handleDataMessage(data.message, resolve, {
      initialLoadComplete: true,
    });
  })
}

// Create company conversation if missing.
const ensureCompanyConversation = async (company_id, company_name) => {
  await waitForConversationController();
  console.log('ensureCompanyConversation', company_id, company_name);
  let conversation = await ConversationController.get(company_id, 'company');
  if (conversation && conversation.get('active_at')) {
    console.log(
      'ensureCompanyConversation existing',
      company_id,
      company_name,
      conversation
    );
    return;
  }

  conversation = await ConversationController.getOrCreateAndWait(
    company_id,
    'company'
  );
  conversation.set({ active_at: Date.now(), name: company_name });
  console.log('ensureCompanyConversation new', company_id, conversation);

  await window.Signal.Data.updateConversation(
    company_id,
    conversation.attributes,
    {
      Conversation: Whisper.Conversation,
    }
  );
};

// Crutch to ensure conversations controller is ready.
const waitForConversationController = () => {
  const initialPromise = ConversationController.loadPromise();
  if (initialPromise) return initialPromise;
  return new Promise(resolve => {
    const check = () => {
      const initialPromise = ConversationController.loadPromise();
      if (initialPromise) resolve(initialPromise);
      else setTimeout(check, 1000);
    };
    setTimeout(check, 1000);
  });
};

// Helper for async get/post json api calls with optional auth header
const xhrReq = (url, postdata, authHeader) => {
  return new Promise((resolve, reject) => {
    const req = new window.XMLHttpRequest();
    req.onload = function() {
      try {
        if (req.status === 200) {
          try {
            resolve(JSON.parse(req.response));
          } catch (err) {
            resolve(req.response);
          }
        } else {
          console.warn('xhrReq BadStatus', req.status, req.response);
          reject(new Error('Network request returned bad status: ' + req.status + ' ' + req.response));
        }
      } catch (err) {
        reject(err);
      }
    };
    req.onerror = (event) => {
      if (event.target.status === 0) {
        console.warn('xhrReq onerror (status 0):', event);
        reject(new Error('Unexpected failure in network request. Please check your network connection.'));
      }
    };
    req.open(postdata ? 'POST' : 'GET', url, true);
    if (authHeader) req.setRequestHeader('Authorization', authHeader);
    if (postdata) req.setRequestHeader('Content-Type', 'application/json');
    if (typeof postdata === 'object') postdata = JSON.stringify(postdata);
    console.log(postdata);
    postdata ? req.send(postdata) : req.send();
  });
};

const getAuth = async () => {
  return "user:pass";
}

const apiRequest = async (call, data = undefined) => {
  return xhrReq(API_URL + call, data, await getAuth());
  // const options = {
  //   method: data ? 'POST' : 'GET',
  //   body: data,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': await getAuth()
  //   }
  // };
  // const res = await fetch(API_URL + call, options);
  // return res.json();
};