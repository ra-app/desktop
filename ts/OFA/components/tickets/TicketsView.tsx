// tslint:disable:react-a11y-event-has-role

import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import { setCompanyTicketsSinceTs, setTicketsData } from '../../store/tickets/actions';
import { setCompanyInfo } from '../../store/companyInfo/actions';
import { Ticket } from '../../store/tickets/types';
import { CompanyInfo } from '../../store/companyInfo/types';
import TicketInfo from './TicketInfo';
import Avatar from '../avatar/Avatar';
import { BrowserWindow } from 'electron';

// External API
declare const get_since: any;
declare const getCompanyRaw: any;
declare var getAvatar: any;

interface Props {
  company_id: number;
  tickets: Array<any>;
  lastSinceTs: number;
  companyInfo: CompanyInfo;
  window: BrowserWindow;
  setTickets(tickets: Array<Ticket>): any;
  setSinceTs(companyId: number, ts: number): any;
  setCompanyInfo(companyInfo: CompanyInfo): any;
}
declare global {
  interface Window {
    owsDesktopApp: any;
  }
}

// tslint:disable-next-line:no-empty-interface
interface State {
  stateFilter: number | null;
}

export class TicketsView extends React.Component<Props, State> {
  private updateTicketsInterval: NodeJS.Timeout | null = null;
  constructor(props: Props) {
    super(props);
    this.state = { stateFilter: 1 };
  }

  public componentDidMount() {
    this.callSince();
    this.updateTicketsInterval = setInterval(this.callSince.bind(this), 60000);

    this.fetchCompanyInfoIfMissing(this.props.company_id);
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

  public async fetchCompanyInfoIfMissing(companyId: number) {
    if (this.props.companyInfo == null) {
      const res = await getCompanyRaw(companyId);
      if (res.success) {
        const company = res.company;
        company.company_avatar = getAvatar(companyId);
        this.props.setCompanyInfo(company);
      }
    }
  }

  public setStateFilter(newStateFilter: number) {
    this.setState({ stateFilter: newStateFilter});
  }

  public openContactList() {
    const { appView } = window.owsDesktopApp;
    appView.openContact();
  }

  public createGroup() {
    const { appView } = window.owsDesktopApp;
    appView.openModalImport('group');
  }

  public importAdmin() {
    const { appView } = window.owsDesktopApp;
    appView.openModalImport('admin');
  }
  public importKunde() {
    const { appView } = window.owsDesktopApp;
    appView.openModalImport('kunde');
  }

  public render() {
    const { tickets, companyInfo } = this.props;
    const { stateFilter } = this.state;

    return (
      <div className="content">
        <div className="module-main-header__info">
          {companyInfo && (
            <Fragment>
              <Avatar id={companyInfo.company_number.toString()} avatarSrc={companyInfo.company_avatar} />
              <span id="span-chat-name">{companyInfo ? companyInfo.name : 'Unknow'}</span>
            </Fragment>
          )}
        </div>
        <ul className="ulNavigationTickets">
          <li id="unclaimed" className={`ticket-nav ${stateFilter === 1 && 'true'}`} onClick={() => this.setStateFilter(1)}>Nicht zugewiesen</li>
          <li id="claimed" className={`ticket-nav ${stateFilter === 2 && 'true'}`} onClick={() => this.setStateFilter(2)}>Zugewiesen</li>
          <li id="closed" className={`ticket-nav ${stateFilter === 3 && 'true'}`} onClick={() => this.setStateFilter(3)}>Geschlossen</li>
          <li id="add_group" className="ticket-nav" onClick={() => this.createGroup()}>Gruppe erstellen</li>
          <li id="add_extern" className="ticket-nav" onClick={() => this.importKunde()}>Externe Nutzer einladen</li>
          <li id="add_intern" className="ticket-nav" onClick={() => this.importAdmin()}>Interne Nutzer einladen</li>
          <li id="open_contact" className="ticket-nav" onClick={() => this.openContactList()}>Kontakte</li>
        </ul>
        <div className="general-container">
          <div className="container-ticket">
            <div id="ticketList">
              {tickets.map((ticket, _) => {
                if (stateFilter !== null && ticket.state !== stateFilter) {
                  return;
                }

                return (<TicketInfo key={ticket.uuid} ticket={ticket} />);
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProp = (state: any, props: Props): Props => {
  const company_id = props.company_id;
  let tickets: Array<any> = [];
  if (state.tickets && state.tickets[company_id] && state.tickets[company_id].tickets) {
    tickets = Object.values(state.tickets[company_id].tickets);
  }
  // save avatar on storage
  if (tickets.length > 0) {
    tickets.forEach(element => {
      element.profile_picture = getAvatar(element.client_uuid);
    });
  }
  // sort ticket
  tickets = tickets.sort((a, b) => (new Date(b.ts_created)).getTime() - (new Date(a.ts_created)).getTime());

  let lastSinceTs: number = 1276505834832;
  if (state.tickets && state.tickets[company_id]) {
    lastSinceTs = state.tickets[company_id].ticketsSinceTs;
  }

  const companyInfo = state.companyInfo[company_id];


  return { tickets, lastSinceTs, companyInfo } as Props;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTickets: (tickets: Array<Ticket>) => dispatch(setTicketsData(tickets)),
    setSinceTs: (companyId: number, ts: number) => dispatch(setCompanyTicketsSinceTs(companyId, ts)),
    setCompanyInfo: (info: CompanyInfo) => dispatch(setCompanyInfo(info)),
  };
};

// tslint:disable-next-line:no-default-export
export default connect(mapStateToProp, mapDispatchToProps)(TicketsView);
