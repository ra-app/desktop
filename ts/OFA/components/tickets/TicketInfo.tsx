import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Ticket } from '../../store/tickets/types';
import {  setTicketData } from '../../store/tickets/actions';
import Avatar from '../avatar/Avatar';
declare var claimTicket: any;
declare var getClientByPhone: any;
declare var ensureConversation: any;
declare var getTicketDetails: any;
declare var openTicketBySignal: any;
declare var getOwnNumber: any;
declare var disableCompanyTicketBySignal: any;
interface Props {
  ticket: Ticket;
  setTicket(ticket: Ticket): any;
}

interface State {
  showMoreInfo: boolean;
  loading: boolean;
}

declare global {
  interface Window {
    getpreferredLocale: any;
    Whisper: any;
  }
}

// tslint:disable-next-line:no-default-export
export class TicketInfo extends React.Component<Props, State> {
  private mapTicketMessages: Array<string> = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      showMoreInfo: false,
      loading: true,
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

  public async claimTicket(companyID: number, uuid: string) {
    const tmpTicket = this.props.ticket;
    const phoneNumber = await claimTicket(companyID, uuid);
    const client = await getClientByPhone(companyID, phoneNumber);
    const conversation = await ensureConversation(phoneNumber);
    let conversationName = 'User without data';

    if (client.name) {
      if (client.name && client.surname) {
        // tslint:disable-next-line:prefer-template
        conversationName = client.name + ' ' + client.surname;
      } else {
        conversationName = client.name;
      }
    } else if (client.email) {
      conversationName = client.email;
    }

    conversation.set({
      name: conversationName,
      ticket_uuid: uuid,
      company_id: companyID,
      isClosed: false,
      isArchived: false,
    });
    // send event ticket
    const ticketDETAIL = await getTicketDetails(companyID, uuid);
    let message = '[![TICKETMSG]!]';
    const ownNumber = await getOwnNumber();
    openTicketBySignal(phoneNumber, {id: ownNumber, type: 'private'});
    disableCompanyTicketBySignal(phoneNumber, {id: companyID, type: 'company'});
    ticketDETAIL.events.reverse().forEach((mssg: { json: string }) => {
      // tslint:disable-next-line:prefer-template
      message = message + '\n ' + JSON.parse(mssg.json).body;
    });
    conversation.sendMessage(message);
    window.Whisper.events.trigger('showConversation', phoneNumber);
    $(`#${uuid}`).remove();
    tmpTicket.state = 2;
    this.props.setTicket(tmpTicket);
  }

  public async showInfoTicket(ticket: Ticket) {
    if (this.state.showMoreInfo) {
      this.setState({ showMoreInfo: false, loading: true });
    } else {
      this.setState({ showMoreInfo: true });
      try {
        const ticketDETAIL = await getTicketDetails(
          ticket.company_id,
          ticket.uuid
        );
        this.mapTicketMessages = ticketDETAIL.events.reverse();
        this.setState({ loading: false });
      } catch (e) {
        console.warn('Error getting ticket info', e);
      }
    }
  }

  public render() {
    // console.log('TICKET PROPSSSSz', this.props);
    const {
      ticket: {
        uuid,
        company_id,
        client_uuid,
        profile_picture,
        ts_created,
        name,
        surname,
        state,
      },
    } = this.props;
    let displayName = 'username';
    const { showMoreInfo, loading } = this.state;
    if (name) {
      if (name && surname) {
        // tslint:disable-next-line:prefer-template
        displayName = name + ' ' + surname;
      } else {
        displayName = name;
      }
    }

    return (
      <div className="main-ticket-container">
        <div className="container-ticket-userinfo">
          <Avatar
            avatarSrc={profile_picture}
            id={client_uuid}
          />
          <span className="ticket-user-name"> {displayName}</span>
        </div>
        {/* tslint:disable-next-line:react-a11y-event-has-role */}
        <div className="container-ticket-info" onClick={() => this.showInfoTicket(this.props.ticket)}>
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
            <button
              id={`claim_${uuid}`}
              className="button-claim-ticket claimed"
              disabled={true}
            >
              Übernommen
            </button>
          ) : (
            <Fragment>
              {state === 1 || state === 0 ? (
                <button
                  id={`claim_${uuid}`}
                  className="button-claim-ticket not-claimed"
                  onClick={() => this.claimTicket(company_id, uuid)}
                >
                  Übernehmen
                </button>
              ) : (
                null
              )}
            </Fragment>
            )}
        </div>
        {showMoreInfo && (
          <div id={`ticket_${uuid}`} className="mainMssgDiv">
            {loading ? (
              <Fragment>
                <img className="isLoading" src="images/spinner-56.svg" alt="loading content" />
              </Fragment>
            ) : (
                <Fragment>
                  <div className="ticket-message">
                    <p className="mssgUsername">
                      {displayName}
                    </p>
                    {this.mapTicketMessages.map((message: any) => {
                      return (
                        <Fragment key={message.id}>
                          <p className="ticket-message">
                            {JSON.parse(message.json).body} - {this.setDate(message.ts)}
                          </p>
                        </Fragment>
                      );
                    })}
                  </div>
                </Fragment>
              )}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTicket: (ticket: Ticket) => dispatch(setTicketData(ticket)),
  };
};

// tslint:disable-next-line:no-default-export
export default connect(null, mapDispatchToProps)(TicketInfo);
