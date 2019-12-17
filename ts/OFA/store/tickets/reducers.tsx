import { CompanyTickets, SET_COMPANY_TICKETS_SINCE_TS, SET_TICKET_DATA, SET_TICKETS_DATA, SetCompanyTicketsSinceTs, SetTicketDataAction, SetTicketsDataAction, TicketActionTypes, TicketState } from './types';

const initialState: TicketState = {};

export function ticketReducer(
  state = initialState,
  action: TicketActionTypes
): TicketState {
  // tslint:disable-next-line:no-console
  // console.log('STATE REDUCER', action);

  let clonedState = {...state};

  switch (action.type) {
    case SET_TICKET_DATA:
      clonedState = setTicketDataReducer(clonedState, action);
      break;
    case SET_TICKETS_DATA:
        clonedState = setTicketsDataReducer(clonedState, action);
        break;
    case SET_COMPANY_TICKETS_SINCE_TS:
        clonedState = setCompanyTicketsSinceTsReducer(clonedState, action);
        break;
    default:
  }

  return clonedState;
}

function setTicketDataReducer(state: TicketState, action: SetTicketDataAction): TicketState {
  const data = action.ticket;
  if (data) {
    if (!state[data.company_id]) {
      state[data.company_id] = {} as CompanyTickets;
    }
    if (!state[data.company_id].tickets) {
      state[data.company_id].tickets = {};
    }
    state[data.company_id].tickets[data.uuid] = data;
  }

  return state;
}

function setTicketsDataReducer(state: TicketState, action: SetTicketsDataAction): TicketState {
  if (action.tickets && action.tickets.length) {
    for (const ticket of action.tickets) {
      if (!state[ticket.company_id]) {
        state[ticket.company_id] = {} as CompanyTickets;
      }
      if (!state[ticket.company_id].tickets) {
        state[ticket.company_id].tickets = {};
      }
      state[ticket.company_id].tickets[ticket.uuid] = ticket;
    }
  }

  return state;
}

// function setCompanyInfoReducer(state: TicketState, action: TicketActionTypes): TicketState {
//   if (!state.companies[action.info.company_number]) state.companies[action.info.company_number] = {};
//   state.companies[action.payload.company_number].info = action.info;
//   return state;
// }

function setCompanyTicketsSinceTsReducer(state: TicketState, action: SetCompanyTicketsSinceTs): TicketState {
  if (!state[action.company_number]) {
    state[action.company_number] = {} as CompanyTickets;
  }
  state[action.company_number].ticketsSinceTs = action.ts;

  return state;
}
