import { SET_COMPANY_TICKETS_ORDER, SET_COMPANY_TICKETS_SINCE_TS, SET_TICKET_DATA, SET_TICKETS_DATA, SetCompanyTicketsOrder, SetCompanyTicketsSinceTs, SetTicketDataAction, SetTicketsDataAction, Ticket } from './types';

export function setTicketData(ticket: Ticket): SetTicketDataAction {
  return {
    type: SET_TICKET_DATA,
    ticket: ticket,
  };
}

export function setTicketsData(tickets: Array<Ticket>): SetTicketsDataAction {
  return {
    type: SET_TICKETS_DATA,
    tickets: tickets,
  };
}

export function setCompanyTicketsSinceTs(companyNumber: number, ts: number): SetCompanyTicketsSinceTs {
  return {
    type: SET_COMPANY_TICKETS_SINCE_TS,
    ts: ts,
    company_number: companyNumber,
  };
}

export function setCompanyTicketsOrder(companyNumber: number, order: string): SetCompanyTicketsOrder {
  return {
    type: SET_COMPANY_TICKETS_ORDER,
    order: order,
    company_number: companyNumber,
  };
}
