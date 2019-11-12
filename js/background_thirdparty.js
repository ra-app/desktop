async function handleThirdPartyEvent(event) {
  try {
    const { data, confirm } = event;
    console.log('handleThirdPartyEvent', event, data);
    confirm();
  } catch (err) {
    console.warn('handleThirdPartyEvent Error:', err, event);
  }
}

async function sendThirdPartyMsg(destination, data) {
  const r = await textsecure.messaging.sendThirdParty(destination, data);
  console.log('sendThirdPartyMsg', destination, data, r);
}

document.addEventListener('DOMContentLoaded', async () => {
  await waitForConversationController(); // Ensure we are ready for things.
  // sendThirdPartyMsg(getOwnNumber(), 'TEST');
  sendThirdPartyMsg('+34664666666', 'TEST');
});