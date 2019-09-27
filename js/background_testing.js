'use strict';

/* eslint strict: ["error", "global"] */

// Testing Playground
document.addEventListener('DOMContentLoaded', async () => {
  await waitForConversationController(); // Ensure we are ready for things.

  const number = textsecure.storage.get('companyNumber', null);
  if (number) await ensureCompanyConversation(number);

  // await addAllCompanies();

  setInterval(() => {
    createDeveloperInterface();
  }, 1000);

  // await testProfile();
});

async function testProfile() {
  const server = getServer();
  await server.setProfile(await encryptProfileName('HAHAHAHAHAHAHA'));

  // const pictureData = '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';
  // const pictureData = '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';
  const pictureData = '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';

  const pictureBuffer = atob(pictureData);
  // console.log(pictureBuffer);

  const avatarUploadForm = await server.getAvatarUploadForm();
  // console.log('getAvatarUploadForm', avatarUploadForm);
  const r = await server.putToCDN(avatarUploadForm, await encryptProfile(pictureBuffer));
  // console.log('putToCDN', r);

  // const enc = await encryptProfileName("TEST");
  // console.log("ENCRYPT", enc);
  // const dec = await decryptProfileName(enc);
  // console.log("DECRYPT", dec);

  // const d = [0, 1, 2, 3, 4, 5, 6];
  // const enc = await encryptProfile(d);
  // console.log('ENC', enc);
  // const dec = await decryptProfile(enc);
  // console.log('DEC', dec);
}

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
    source,
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
      const anotherPromise = ConversationController.loadPromise();
      if (anotherPromise) resolve(anotherPromise);
      else setTimeout(check, 1000);
    };
    setTimeout(check, 1000);
  });
};

// Helper for async get/post json api calls with optional auth header
const xhrReq = (url, postdata, authHeader) => {
  return new Promise((resolve, reject) => {
    const req = new window.XMLHttpRequest();
    req.onload = () => {
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
    // eslint-disable-next-line no-param-reassign
    if (typeof postdata === 'object') postdata = JSON.stringify(postdata);
    console.log(postdata);
    // eslint-disable-next-line no-unused-expressions
    postdata ? req.send(postdata) : req.send();
  });
};

const getAuth = async () => {
  const USERNAME = window.storage.get('number_id');
  const PASSWORD = window.storage.get('password');
  console.log('getAuth', USERNAME, PASSWORD);
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

const updateAdmin = async (company_id, name) => {
  const res = await apiRequest('/api/v1/admin/'+company_id +'/admins/update', { name });
  console.log('updateAdmin', res);
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

const getClient = async (company_id, client_uuid) => {
  return (await apiRequest('api/v1/admin/' + company_id + '/clients/get/' + client_uuid)).details;
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
  const existingPanel = document.getElementById('devPanel');
  if (existingPanel) return;
  console.log('createDeveloperInterface');

  // Dev Panel
  const devPanel = document.createElement('div');
  devPanel.id = 'devPanel';
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

const readFileAsText = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

const checkValidXML = xml => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const throwParserError = node => {
    let depth = 0;
    while (node && node.children && node.children.length && depth < 3) {
      const first = node.children[0];
      if (first && first.tagName.toLowerCase() === 'parsererror') {
        throw new Error(first.children[1].innerText);
      }
      node = first;
      depth += 1;
    }
  }
  throwParserError(doc);
}

// PROFILE STUFF START


function getServer() {
  const username = window.storage.get('number_id');
  const password = window.storage.get('password');
  const server = WebAPI.connect({ username, password });
  console.log('getServer', username, password);
  return server;
}

async function encryptProfile(data) {
  const key = window.storage.get('profileKey');
  const keyBuffer = window.Signal.Crypto.base64ToArrayBuffer(key);

  const dataBuffer = dcodeIO.ByteBuffer.wrap(
    data,
    'binary'
  ).toArrayBuffer();

  const encrypted = await textsecure.crypto.encryptProfile(
    dataBuffer,
    keyBuffer
  );

  return encrypted;
}

async function decryptProfile(data) {
  const key = window.storage.get('profileKey');
  const keyBuffer = window.Signal.Crypto.base64ToArrayBuffer(key);

  const dataBuffer = dcodeIO.ByteBuffer.wrap(
    data,
    'binary'
  ).toArrayBuffer();

  const decrypted = await textsecure.crypto.decryptProfile(
    dataBuffer,
    keyBuffer
  );

  return decrypted;
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
