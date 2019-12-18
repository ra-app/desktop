import React from 'react';
import { Ticket } from '../../store/tickets/types';
import Avatar from '../avatar/Avatar';
interface Props {
  ticket: Ticket;
}

interface State {
  showMoreInfo: boolean;
}

declare global {
  interface Window {
    getpreferredLocale: any;
  }
}

// tslint:disable-next-line:no-default-export
export default class TicketInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMoreInfo: false,
    };
  }

  public setDate(date: string) {
    const language = window.getpreferredLocale();
    const d = new Date(date);
    const options = {
      weekday: 'long', year: 'numeric', month: 'short',
      day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'
    };

    return d.toLocaleDateString(language, options);
  }

  public render() {
    // console.log('TICKET PROPSSSS', this.props);
    const {
      ticket: {
        uuid,
        client_uuid,
        name,
        surname,
        profile_picture,
        ts_created,
        state,
      }
    } = this.props;
    // const { showMoreInfo } = this.state;

    return (
      <div className="main-ticket-container">
        <div className="container-ticket-userinfo">
          <Avatar
            avatarSrc={profile_picture}
            id={client_uuid}
          />
          <span className="ticket-user-name"> {name ? `${name} ${surname}` : 'username'}</span>
        </div>
        <div className="container-ticket-info">
          <span className="ticket-id">Ticket </span>
          <span className="ticket-date">
            {this.setDate(ts_created)}
          </span>
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
