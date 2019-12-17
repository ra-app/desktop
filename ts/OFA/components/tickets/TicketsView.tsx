import React from 'react';
import { connect } from 'react-redux';

import { setCompanyTicketsSinceTs, setTicketsData } from '../../store/tickets/actions';
import { Ticket } from '../../store/tickets/types';
import TicketInfo from './TicketInfo';

// External API
declare const get_since: any;

interface Props {
  company_id: number;
  tickets: Array<any>;
  lastSinceTs: number;
  setTickets(tickets: Array<Ticket>): any;
  setSinceTs(companyId: number, ts: number): any;
}

// tslint:disable-next-line:no-empty-interface
interface State {}

export class TicketsView extends React.Component<Props, State> {
  private updateTicketsInterval: NodeJS.Timeout | null = null;
  constructor(props: Props) {
    super(props);
  }

  public componentDidMount() {
    this.callSince();
    this.updateTicketsInterval = setInterval(this.callSince.bind(this), 60000);
  }

  public componentWillUnmount() {
    if (this.updateTicketsInterval !== null) {
      clearInterval(this.updateTicketsInterval);
      this.updateTicketsInterval = null;
    }
  }

  public async callSince() {
    const res = await get_since(this.props.company_id, { ts: this.props.lastSinceTs });
    if (res.success) {
      this.props.setTickets(res.tickets);
      this.props.setSinceTs(this.props.company_id, res.ts);
    }
  }

  public render() {
    const { tickets } = this.props;

    return (
      <div>
        <h1>AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHHHHh</h1>
        {tickets.map((ticket, _) => {
          return (<TicketInfo key={ticket.uuid} ticket={ticket} />);
        })}
      </div>
    );
  }
}

const mapStateToProp = (state: any, props: Props): Props => {
  const company_id = props.company_id;

  let tickets: Array<any> = [];
  if (state.tickets && state.tickets[company_id]) {
    tickets = Object.values(state.tickets[company_id].tickets);
  }

  tickets = tickets.sort((a, b) => (new Date(b.ts_created)).getTime() - (new Date(a.ts_created)).getTime());

  let lastSinceTs: number = 1276505834832;
  if (state.tickets && state.tickets[company_id]) {
    lastSinceTs = state.tickets[company_id].ticketsSinceTs;
  }

  return { tickets, lastSinceTs } as Props;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTickets: (tickets: Array<Ticket>) => dispatch(setTicketsData(tickets)),
    setSinceTs: (companyId: number, ts: number) => dispatch(setCompanyTicketsSinceTs(companyId, ts)),
  };
};

// tslint:disable-next-line:no-default-export
export default connect(mapStateToProp, mapDispatchToProps)(TicketsView);
