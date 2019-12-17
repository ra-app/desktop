export const SET_TICKET_DATA = 'SET_TICKET_DATA';
export const SET_TICKETS_DATA = 'SET_TICKETS_DATA';
// export const SET_COMPANY_INFO = 'SET_COMPANY_INFO';
export const SET_COMPANY_TICKETS_SINCE_TS = 'SET_COMPANY_TICKETS_SINCE_TS';

export interface CompanyTickets {
  tickets: Record<string, Ticket>;
  ticketsSinceTs: number;
}

export interface TicketState {
  [key: number]: CompanyTickets;
}

export interface Ticket {
  admin_uuid: string;
  client_uuid: string;
  company_id: number;
  name: string;
  profile_picture: string;
  state: number;
  surname: string;
  ts_claimed: string;
  ts_closed: string;
  ts_created: string;
  uuid: string;
}

export interface SetTicketDataAction {
  type: typeof SET_TICKET_DATA;
  ticket: Ticket;
}

export interface SetTicketsDataAction {
  type: typeof SET_TICKETS_DATA;
  tickets: Array<Ticket>;
}

export interface SetCompanyTicketsSinceTs {
  type: typeof SET_COMPANY_TICKETS_SINCE_TS;
  ts: number;
  company_number: number;
}

export type TicketActionTypes = SetTicketDataAction | SetTicketsDataAction | SetCompanyTicketsSinceTs;
