'use strict';

// Testing Playground
document.addEventListener('DOMContentLoaded', async () => {
  await ensureCompanyConversation('0000000', 'Mega Corporate');
  await ensureCompanyConversation('0000001', "Boris's Great Solutions");
});

// ===

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
  console.log('SEND TO COMPANY:', {
    destination,
    messageBody,
    finalAttachments,
    quote,
    preview,
    sticker,
    now,
    expireTimer,
    profileKey,
    options,
  });
  setTimeout(() => {
    const data = {
      source: destination,
      sourceDevice: 1,
      sent_at: Date.now(),
      conversationId: destination,
      message: {
        body: 'Echo: ' + messageBody,
      },
    };

    receiveCompanyMessage(data, (...args) => {
      console.log('receiveCompanyMessage CB', args);
    });
  }, 1000);
  return { sent_to: destination };
}

async function receiveCompanyMessage(data, confirm) {
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

  console.log(message);

  // const message = await initIncomingMessage(data);
  await ConversationController.getOrCreateAndWait(data.source, 'company');
  return message.handleDataMessage(data.message, confirm, {
    initialLoadComplete: true,
  });
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
