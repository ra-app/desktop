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
    console.log('TICKET PROPSSSS', this.props);
    const {
      ticket: {
        uuid,
        profile_picture,
        surname,
        ts_created,
        state,
      }
    } = this.props;
    // const { showMoreInfo } = this.state;

    return (
      <div className="main-ticket-container">
        <div className="container-ticket-userinfo">
          <img src={profile_picture} id={`clientTicketAvatar_${uuid}`} alt={`clientTicketAvatar_${uuid}`} className="ticket-user-image" />
          <span className="ticket-user-name">{name} {surname}</span>
          {/* <span class="ticket-user-name">username</span> */}
        </div>
        <div className="container-ticket-info">
          <span className="ticket-id">Ticket {uuid}</span>
          <span className="ticket-date">{ts_created}</span>
        </div>

        <div className="container-ticket-actions">
          {/* {{#isUnknown}} */}
          <button id={`claim_${uuid}`} className="button-claim-ticket not-claimed">{state}</button>
          {/* {{/isUnknown}} */}
          {/* {{#isUnclaimed}} */}
          {/* <button id={`claim_${uuid}`} className="button-claim-ticket not-claimed">{{ status }}</button> */}
          {/* {{/isUnclaimed}} */}
          {/* {{#isClaimed}} */}
          {/* <button id={`claim_${uuid}`} className="button-claim-ticket claimed" disabled="disabled">{{ status }}</button> */}
          {/* {{/isClaimed}} */}
          {/* {{#isClosed}} */}
          {/* <!-- <button id='claim_{{uuid}}' className="button-claim-ticket not-claimed">{{ status }}</button>  --> */}
          {/* {{/isClosed}} */}
        </div>


        {/* <h1>IMMA TICKET</h1>
        <div>{ticket.uuid}</div>
        {showMoreInfo} */}
      </div>
    );
  }
}
