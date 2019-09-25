/* eslint strict: ["error", "global"] */
'use strict';

// Testing Playground
document.addEventListener('DOMContentLoaded', async () => {
  await waitForConversationController(); // Ensure we are ready for things.

  const number = textsecure.storage.get('companyNumber', null);
  if (number) await ensureCompanyConversation(number);

  setInterval(() => {
    createDeveloperInterface();
  }, 1000);

  // const server = getServer();
  // await server.setProfile(await encryptProfileName("HAHAHAHAHAHAHA"));

  // const enc = await encryptProfileName("TEST");
  // console.log("ENCRYPT", enc);
  // const dec = await decryptProfileName(enc);
  // console.log("DECRYPT", dec);
});

// ===

const API_URL = 'https://luydm9sd26.execute-api.eu-central-1.amazonaws.com/latest/';
// const API_URL = 'http://127.0.0.1:4000/';

// XXX: Queue for sent messages, sent/received/seen indicators, error handling!

// Receives messages to send from conversations.js switchcase.
async function sendCompanyMessage(
  destination,
  messageBody,
  finalAttachments,
  quote,
  preview,
  sticker,
  now,
  expireTimer,
  profileKey,
  options
) {
  // Actually upload things!
  const message = await textsecure.messaging.uploadMessageAttachments(
    destination,
    messageBody,
    finalAttachments,
    quote,
    preview,
    sticker,
    now,
    expireTimer,
    profileKey,
    options
  );

  // const messageInfo = { destination, messageBody, finalAttachments, quote, preview, sticker, now, message };
  const messageInfo = { destination, message };

  await inboxMessage(messageInfo);
  
  // textsecure.messaging.queueJobForNumber(destination, async () => {
  //   await inboxMessage(messageInfo);
  // });

  return { sent_to: destination };
}

// let retryQueue = [];

async function inboxMessage(messageInfo) {
  console.log('inboxMessage -- MessageInfo:', messageInfo);
  const response = await apiRequest('api/v2/inbox', messageInfo);
  console.log('inboxMessage -- response:', response);

  if (response && response.success && response.text) {
    // await receiveCompanyText(messageInfo.destination, response.text);

    textsecure.messaging.queueJobForNumber(messageInfo.destination, async () => {
      await receiveCompanyText(messageInfo.destination, response.text);
    });
  } else {
    console.error('inboxMessage', response);
    if (!response.success && response.error) {
      devToaster('inboxMessage Error: ' + response.error);
    }
  }
}

async function receiveCompanyText(source, text) {
  const data = {
    source: source,
    sourceDevice: 1,
    sent_at: Date.now(),
    conversationId: source,
    message: {
      body: text,
    },
  };
  return receiveCompanyMessage(data);
}

function receiveCompanyMessage(data) {
  return new Promise(async resolve => {
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
  });
}

// Create company conversation if missing.
const ensureCompanyConversation = async company_id => {
  await waitForConversationController();
  console.log('ensureCompanyConversation', company_id);
  let conversation = await ConversationController.get(company_id, 'company');
  if (conversation && conversation.get('active_at')) {
    console.log('ensureCompanyConversation existing', conversation);
    return;
  }

  const companyInfo = await getCompany(company_id);
  if (!companyInfo) throw new Error('Company not found! ' + company_id);

  conversation = await ConversationController.getOrCreateAndWait(
    company_id,
    'company'
  );
  conversation.set({ active_at: Date.now(), name: companyInfo.name });
  console.log(
    'ensureCompanyConversation new',
    company_id,
    conversation,
    companyInfo
  );

  await window.Signal.Data.updateConversation(
    company_id,
    conversation.attributes,
    {
      Conversation: Whisper.Conversation,
    }
  );

  const welcomeText = `Welcome to ${
    companyInfo.name
  } (${company_id}) support chat.`;
  await receiveCompanyText(company_id, welcomeText);
};

const ensureConversation = async phone_number => {
  await waitForConversationController();
  console.log('ensureConversation', phone_number);
  let conversation = await ConversationController.get(phone_number, 'private');
  if (conversation && conversation.get('active_at')) {
    console.log('ensureConversation existing', conversation);
    return;
  }

  conversation = await ConversationController.getOrCreateAndWait(
    phone_number,
    'private'
  );
  conversation.set({ active_at: Date.now() });
  console.log('ensureConversation new', phone_number, conversation);

  await window.Signal.Data.updateConversation(
    phone_number,
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
          reject(
            new Error(
              'Network request returned bad status: ' +
                req.status +
                ' ' +
                req.response
            )
          );
        }
      } catch (err) {
        reject(err);
      }
    };
    req.onerror = event => {
      if (event.target.status === 0) {
        console.warn('xhrReq onerror (status 0):', event);
        reject(
          new Error(
            'Unexpected failure in network request. Please check your network connection.'
          )
        );
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
  const USERNAME = window.storage.get('number_id');
  const PASSWORD = window.storage.get('password');
  const auth = btoa(`${USERNAME}:${PASSWORD}`);
  return `Basic ${auth}`;
};

const apiRequest = async (call, data = undefined) => {
  const res = await xhrReq(API_URL + call, data, await getAuth());
  if (!res.success && res.error)
    throw new Error('Request Failed! ' + res.error);
  if (!res.success) throw new Error('Request Failed!');
  return res;
};

const createCompany = async info => {
  const res = await apiRequest('api/v1/companies/register', info);
  console.log('CreateCompany', info, res);
  return res;
};

// const getAllCompanies = async () => {
//   return (await apiRequest('api/v1/companies/getcompanyinfo')).companies;
// };

const getCompany = async number => {
  return (await apiRequest('api/v1/companies/' + number)).company;
};

const getUnclaimedCompanyTickets = async company_id => {
  return (await apiRequest('api/v1/admin/' + company_id + '/tickets/list')).tickets;
};

const getTicketDetails = async (company_id, ticket_uuid) => {
  return (await apiRequest('api/v1/admin/' + company_id + '/tickets/details/' + ticket_uuid)).details;
};

const claimTicket = async (company_id, ticket_uuid) => {
  return (await apiRequest('api/v1/admin/' + company_id + '/tickets/claim/' + ticket_uuid)).phone_number;
};

const exampleInfo = {
  name: 'Mega Corporate',
  business: 'Corporationing',
  tax_number: '0xDEADBEEF',
  tax_id: '0xDEADBEEF',
  commercial_register: '0xDEADBEEF',
  iban: '0xDEADBEEF',
  bic: '0xDEADBEEF',
};

const devToaster = msg => {
  const toaster = document.createElement('div');
  toaster.style.cssText =
    'border: 1px solid red; background-color: white; position: fixed; left: 50%; bottom: 5px; padding: 5px; transform: translate(-50%, 0px); z-index: 9999;';
  toaster.innerText = msg;
  document.body.appendChild(toaster);

  setTimeout(() => {
    document.body.removeChild(toaster);
  }, 5000);
};

const createDeveloperInterface = () => {
  // Dev Panel
  const devPanel = document.createElement('div');
  devPanel.style.cssText =
    'border: 1px solid black; background-color: white; position: absolute; right: 5px; top: 50px; padding: 5px; z-index: 9999;';
  document.body.appendChild(devPanel);

  // Company Input
  const addCompanyInput = document.createElement('input');
  addCompanyInput.placeholder = 'Company #';
  addCompanyInput.value = '675728'; // MegaCorporate V42

  // Add Company Conversation Button
  const addCompanyBtn = document.createElement('button');
  addCompanyBtn.textContent = 'Add Company';

  addCompanyBtn.addEventListener('click', async () => {
    if (addCompanyInput.value) {
      const companyID = addCompanyInput.value;
      // addCompanyInput.value = '';
      try {
        await ensureCompanyConversation(companyID);
      } catch (err) {
        devToaster('AddCompany Error: "' + err.message + '"');
      }
    }
  });

  // Ticket Display
  const ticketsList = document.createElement('ul');

  // Tickets Button
  const getCompanyTicketsBtn = document.createElement('button');
  getCompanyTicketsBtn.textContent = 'Tickets';

  getCompanyTicketsBtn.addEventListener('click', async () => {
    if (addCompanyInput.value) {
      ticketsList.innerHTML = '';
      const companyID = addCompanyInput.value;
      try {
        const tickets = await getUnclaimedCompanyTickets(companyID);
        console.log(tickets);
        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];
          const ticketItem = document.createElement('li');
          ticketsList.appendChild(ticketItem);

          // ticketItem.innerHTML = JSON.stringify(ticket);
          ticketItem.innerHTML = `${ticket.uuid} ${ticket.state} ${
            ticket.client_uuid
          }`;

          const detailsList = document.createElement('ul');
          const infoBtn = document.createElement('button');
          const claimBtn = document.createElement('button');
          ticketItem.appendChild(claimBtn);
          ticketItem.appendChild(infoBtn);
          ticketItem.appendChild(detailsList);
          claimBtn.innerText = 'Claim';
          infoBtn.innerText = 'Info';
          infoBtn.addEventListener('click', async () => {
            detailsList.innerText = '';
            const details = await getTicketDetails(companyID, ticket.uuid);
            // console.log(details);
            for (let x = 0; x < details.events.length; x++) {
              // console.log(x)
              const event = details.events[x];
              const detailsListItem = document.createElement('li');
              detailsListItem.innerText =
                event.id + ' ' + event.type + ' ' + event.json;
              detailsList.appendChild(detailsListItem);
            }
          });
          claimBtn.addEventListener('click', async () => {
            const phone_number = await claimTicket(companyID, ticket.uuid);
            console.log(phone_number);
            await ensureConversation(phone_number);
            getCompanyTicketsBtn.click();
          });
        }
      } catch (err) {
        devToaster('getCompanyTickets Error: "' + err.message + '"');
      }
    }
  });

  // Input Change Handling
  const updateBtn = () => {
    const m = addCompanyInput.value.match(/^\d{6}$/);
    const disabled = !m;
    addCompanyBtn.disabled = disabled;
    getCompanyTicketsBtn.disabled = disabled;
  };
  addCompanyInput.addEventListener('change', updateBtn);
  addCompanyInput.addEventListener('keyup', updateBtn);
  updateBtn();

  // Div for company input + btns
  const addCompanyDiv = document.createElement('div');
  addCompanyDiv.appendChild(addCompanyInput);
  addCompanyDiv.appendChild(addCompanyBtn);
  addCompanyDiv.appendChild(getCompanyTicketsBtn);
  addCompanyDiv.appendChild(ticketsList);
  devPanel.appendChild(addCompanyDiv);
};


// PROFILE STUFF START


function getServer() {
  const username = window.storage.get('number_id');
  const password = window.storage.get('password');
  const server = WebAPI.connect({ username, password });
  return server;
}

async function encryptProfileName(name) {
  const key = window.storage.get('profileKey');
  const keyBuffer = window.Signal.Crypto.base64ToArrayBuffer(key);
  const data = window.Signal.Crypto.bytesFromString(name);

  // encrypt
  const encrypted = await textsecure.crypto.encryptProfileName(
    data,
    keyBuffer
  );

  // encode
  const encryptedName = window.Signal.Crypto.arrayBufferToBase64(encrypted);
  return encryptedName;
}

async function decryptProfileName(encryptedName) {
  const key = window.storage.get('profileKey');
  const keyBuffer = window.Signal.Crypto.base64ToArrayBuffer(key);
  const data = window.Signal.Crypto.base64ToArrayBuffer(encryptedName);

  // decrypt
  const decrypted = await textsecure.crypto.decryptProfileName(
    data,
    keyBuffer
  );

  // encode
  const profileName = window.Signal.Crypto.stringFromBytes(decrypted);
  return profileName;
}

// async function encryptWithProfileKey(message) {
//   const plaintext = dcodeIO.ByteBuffer.wrap(
//     message,
//     'binary'
//   ).toArrayBuffer();
//   const key = dcodeIO.ByteBuffer.wrap(
//     textsecure.storage.get('profileKey'),
//     'binary'
//   ).toArrayBuffer();
//   const encrypted = await Signal.Crypto.encryptSymmetric(key, plaintext);
//   console.log(encrypted);
//   const encoded = btoa(encrypted)
//   return encoded;
// }

// async function decryptWithProfileKey(message) {
//   const plaintext = dcodeIO.ByteBuffer.wrap(
//     atob(message),
//     'binary'
//   ).toArrayBuffer();
//   const key = dcodeIO.ByteBuffer.wrap(
//     textsecure.storage.get('profileKey'),
//     'binary'
//   ).toArrayBuffer();
//   const decrypted = await Signal.Crypto.decryptSymmetric(key, plaintext);
//   const result = Signal.Crypto.bytesFromString(decrypted);
//   return result;
// }

// String ciphertextName = Base64.encodeBytesWithoutPadding(new ProfileCipher(key).encryptName(name.getBytes("UTF-8"), ProfileCipher.NAME_PADDED_LENGTH));

// PROFILE STUFF END