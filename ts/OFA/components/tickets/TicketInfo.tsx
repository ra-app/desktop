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
    this.state = {
      showMoreInfo: false,
    };
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
          {name ? (
            <span className="ticket-user-name">{name} {surname}</span>
          ) : (
            <span className="ticket-user-name">username</span>
          )}
        </div>
        <div className="container-ticket-info">
          <span className="ticket-id">Ticket {uuid}</span>
          <span className="ticket-date">${
                  days[new Date(mssg.ts).getDay()]
                  } ${new Date(mssg.ts).getHours() -
                  1}:${new Date(mssg.ts).getMinutes()}</span>
        </div>

        <div className="container-ticket-actions">
          {/* commented because there is the same in the ternary condition right now */}
          {/* {state === 1 && (
            <button id={`claim_${uuid}`} className="button-claim-ticket not-claimed">Übernehmen</button>
          )} */}
          {state === 2 ? (
            <button id={`claim_${uuid}`} className="button-claim-ticket claimed" disabled={true}>Übernommen</button>
          ) : (
            // can be unknown, unclaim or close
            <button id={`claim_${uuid}`} className="button-claim-ticket not-claimed">Übernehmen</button>
          )}
        </div>
        {/* {showMoreInfo} */}
      </div>
    );
  }
}
