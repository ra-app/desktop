import React from 'react';
import { Ticket } from '../../store/tickets/types';

interface Props {
  ticket: Ticket;
}

interface State {
  showMoreInfo: boolean;
}

// tslint:disable-next-line:no-default-export
export default class TicketInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { showMoreInfo: false };
  }

  public render() {
    const { ticket } = this.props;
    const { showMoreInfo } = this.state;

    return (
      <div>
        <h1>IMMA TICKET</h1>
        <div>{ticket.uuid}</div>
        {showMoreInfo}
      </div>
    );
  }
}
