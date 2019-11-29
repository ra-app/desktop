/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
/* eslint-disable strict */

// Initial State
const initialState = {
  companies: {},
};

const LOCALSTORAGE_ITEM = 'ofa_redux_state';

// Action Types
const SET_TICKET_DATA = 'SET_TICKET_DATA';
const SET_TICKETS_DATA = 'SET_TICKETS_DATA';
const SET_COMPANY_INFO = 'SET_COMPANY_INFO';

// Actions
function setTicketDataDispatch(data) {
  return ofaDispatch({ type: SET_TICKET_DATA, data });
}

function setTicketsDataDispatch(dataArr) {
  return ofaDispatch({ type: SET_TICKETS_DATA, dataArr });
}

function setCompanyInfoDispatch(info) {
  return ofaDispatch({ type: SET_COMPANY_INFO, info });
}

// API Calls
async function fetchCompanyInfo(company_id) {
  const info = await getCompany(company_id);
  return setCompanyInfoDispatch(info);
}

// Reducers
function setTicketDataReducer(state, action) {
  const data = action.data;
  if (!state.companies[data.company_id]) state.companies[data.company_id] = {};
  if (!state.companies[data.company_id].tickets) state.companies[data.company_id].tickets = {};
  state.companies[data.company_id].tickets[data.uuid] = data;
  return state;
}

function setTicketsDataReducer(state, action) {
  for (let i = 0; i < action.dataArr.length; i++) {
    const ticket = action.dataArr[i];
    if (!state.companies[ticket.company_id]) state.companies[ticket.company_id] = {};
    if (!state.companies[ticket.company_id].tickets) state.companies[ticket.company_id].tickets = {};
    state.companies[ticket.company_id].tickets[ticket.uuid] = ticket;
  }
  return state;
}

function setCompanyInfoReducer(state, action) {
  if (!state.companies[action.info.company_number]) state.companies[action.info.company_number] = {};
  state.companies[action.info.company_number].info = action.info;
  return state;
}

const reducerDict = {
  SET_TICKET_DATA: setTicketDataReducer,
  SET_TICKETS_DATA: setTicketsDataReducer,
  SET_COMPANY_INFO: setCompanyInfoReducer,
};

function stateReducer(state, action) {
  if (typeof state === 'undefined') return getInitialState();

  console.log('STATE REDUCER', action);

  if (action.type in reducerDict) {
    state = reducerDict[action.type](state, action);
  } else {
    // throw new Error('Unknown Action Type ' + action.type);
    console.warn('StateReducer Unknown Action Type:', action);
    return state;
  }

  return state;
}

function getInitialState() {
  try {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_ITEM)) || initialState;
  } catch (err) {
    console.warn('GetInitialState Error:', err);
  }
  return initialState;
}

function ofaDispatch(action) {
  return getOfaStore().dispatch(action);
}

let _ofaStore = null;
function getOfaStore() {
  if (!_ofaStore) {
    _ofaStore = Signal.State.rawCreateStore(stateReducer, getInitialState());
    registerLocalstoragePersister(_ofaStore);
  }
  return _ofaStore;
}

function registerLocalstoragePersister(store) {
  store.subscribe(() => {
    try {
      const state = store.getState();
      console.log('STATE UPDATE', JSON.parse(JSON.stringify(state)));
      localStorage.setItem(LOCALSTORAGE_ITEM, JSON.stringify(state));
    } catch (err) {
      console.warn('Error persisten ofaStore:', err);
    }
  });
}

function initOfaStore() {
  try {
    getOfaStore();
  } catch (err) {
    console.error('Failed to init ofa store!', err);
  }
}

document.addEventListener('DOMContentLoaded', initOfaStore);

// Getters
function getOfaState() {
  const store = getOfaStore();
  return store.getState();
}

function getCompanyTicketsByState(company_id, ticket_state) {
  const state = getOfaState();
  const tickets = [];

  const uuids = Object.keys(state.companies[company_id].tickets);
  for (let i = 0; i < uuids.length; i++) {
    const uuid = uuids[i];
    const ticket = state.companies[company_id].tickets[uuid];
    if (ticket.state === ticket_state) tickets.push(ticket);
  }

  return tickets;
}

async function getCompanyTickets(company_id, options = { state: 1, offset: 0, limit: 10 }) {
  return setTicketsDataDispatch((await getTicketsList(company_id, options)).tickets);
}