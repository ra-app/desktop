const TicketsView = require('../../ts/OFA/components/tickets/TicketsView').default;
const { wrapWithReduxStoreOnElem } = require('../../ts/OFA/util/StoreWrapper');
const { storeInstance } = require('../../ts/OFA/store/index');

module.exports = {
  TicketsView,
  wrapWithReduxStoreOnElem,
  store: storeInstance,
};