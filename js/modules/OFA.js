const TicketsView = require('../../ts/OFA/components/tickets/TicketsView').default;
const ConversationHeader = require('../../ts/components/conversation/ConversationHeader').default;
const { wrapWithReduxStoreOnElem } = require('../../ts/OFA/util/StoreWrapper');
const { storeInstance } = require('../../ts/OFA/store/index');

module.exports = {
  TicketsView,
  ConversationHeader,
  wrapWithReduxStoreOnElem,
  store: storeInstance,
};