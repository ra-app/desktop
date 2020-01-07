// tslint:disable:react-a11y-event-has-role

import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setCompanyTicketsOrder, setCompanyTicketsSinceTs, setTicketsData } from '../../store/tickets/actions';
import { setCompanyInfo } from '../../store/companyInfo/actions';
import { Ticket } from '../../store/tickets/types';
import { CompanyInfo } from '../../store/companyInfo/types';
import TicketInfo from './TicketInfo';
import EditCompany from '../editCompany/EditCompany';
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
  lastOrderTicket: string;
  companyInfo: CompanyInfo;
  window: BrowserWindow;
  setTickets(tickets: Array<Ticket>): any;
  setSinceTs(companyId: number, ts: number): any;
  setOrder(companyId: number, order: string): any;
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
  searchString: string;
  sortType: string;
  openEditCompany: boolean;
}

export class TicketsView extends React.Component<Props, State> {
  private updateTicketsInterval: NodeJS.Timeout | null = null;
  private _isMounted: boolean = false;
  private _boundOpenEditCompany: any;
  constructor(props: Props) {
    super(props);
    this.state = { stateFilter: 1,
                    searchString: '',
                    sortType: 'asc',
                    openEditCompany: false,
                  };
  }

  public componentDidMount() {
    this._isMounted = true;
    const { company_id, lastOrderTicket } = this.props;
    this._boundOpenEditCompany = this.openEditCompany.bind(this);
    document.addEventListener('openEditCompanyEvent', this._boundOpenEditCompany);
    this.callSince();
    this.updateTicketsInterval = setInterval(this.callSince.bind(this), 60000);
    this.getSortTicketInfo(company_id, lastOrderTicket);
    this.fetchCompanyInfoIfMissing(company_id);

  }

  public componentWillUnmount() {
    this._isMounted = false;
    if (this.updateTicketsInterval !== null) {
      clearInterval(this.updateTicketsInterval);
      this.updateTicketsInterval = null;
    }
    document.removeEventListener('openEditCompanyEvent', this._boundOpenEditCompany);
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

  public getSortTicketInfo(companyId: number, lastOrderTicket: string) {
    this.setState({sortType: lastOrderTicket});
    this.props.setOrder(companyId, lastOrderTicket);
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

  public handleChange(event: any) {
    // grab value form input box
    this.setState({searchString: event.target.value});
  }

  public setSortTicket(newSortType: any) {
    this.props.setOrder(this.props.company_id, newSortType);
    this.setState({sortType: newSortType});
  }

  public openEditCompany() {
    if (this._isMounted) {
      if (!this.state.openEditCompany) {
        this.setState({openEditCompany: true});
      }
    }
  }

  public closeEditCompany() {
    this.setState({openEditCompany: false});
  }

  public render() {
    const { tickets, companyInfo } = this.props;
    const { stateFilter, searchString, sortType, openEditCompany } = this.state;

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
        <div className="searchContainer">
          <div className="sort">
            {sortType === 'asc' && (
              <span  onClick={() => this.setSortTicket('desc')}>
                <img className="orderTicketIcon" src="images/icons/order-down.svg" alt="order tickets" />
              </span>
            )}
            {sortType === 'desc' && (
              <span  onClick={() => this.setSortTicket('asc')}>
                <img className="orderTicketIcon" src="images/icons/order-up.svg" alt="order tickets"/>
              </span>
            )}
          </div>
          <div className="search">
            <input type="text" className="module-main-header__search__input" value={searchString} onChange={evt => this.handleChange(evt)} placeholder="Search..." />
          </div>
        </div>
        <div className="general-container">
          <div className="container-ticket">
            <div id="ticketList">
              {tickets.map((ticket, _) => {
                if (stateFilter !== null && ticket.state !== stateFilter) {
                  return;
                }
                if (searchString.length > 0) {
                  if (ticket.name === null) {
                    return;
                  }
                  if (!ticket.name.toLowerCase().match(searchString.toLowerCase()) && !ticket.surname.toLowerCase().match(searchString.toLowerCase())) {
                    return;
                  }
                }

                return (<TicketInfo key={ticket.uuid} ticket={ticket} />);
              })}
            </div>
          </div>
          {/* Edit company */}
          {(openEditCompany && companyInfo) && (
            <EditCompany info={companyInfo} closeEdit={() => this.closeEditCompany()} />
          )}
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
  let lastOrderTicket: string = 'asc';
  if (state.tickets && state.tickets[company_id] && state.tickets[company_id].orderTicket) {
    lastOrderTicket = state.tickets[company_id].orderTicket;
    if (state.tickets[company_id].orderTicket === 'asc') {
      tickets = tickets.sort((a, b) => (new Date(b.ts_created)).getTime() - (new Date(a.ts_created)).getTime());
    } else if (state.tickets[company_id].orderTicket === 'desc') {
      tickets = tickets.sort((a, b) => (new Date(a.ts_created)).getTime() - (new Date(b.ts_created)).getTime());
    }
  } else {
    tickets = tickets.sort((a, b) => (new Date(b.ts_created)).getTime() - (new Date(a.ts_created)).getTime());
  }

  let lastSinceTs: number = 1276505834832;
  if (state.tickets && state.tickets[company_id]) {
    lastSinceTs = state.tickets[company_id].ticketsSinceTs;
  }

  const companyInfo = state.companyInfo[company_id];


  return { tickets, lastSinceTs, companyInfo, lastOrderTicket } as Props;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTickets: (tickets: Array<Ticket>) => dispatch(setTicketsData(tickets)),
    setSinceTs: (companyId: number, ts: number) => dispatch(setCompanyTicketsSinceTs(companyId, ts)),
    setOrder: (companyId: number, order: string) => dispatch(setCompanyTicketsOrder(companyId, order)),
    setCompanyInfo: (info: CompanyInfo) => dispatch(setCompanyInfo(info)),
  };
};

// tslint:disable-next-line:no-default-export
export default connect(mapStateToProp, mapDispatchToProps)(TicketsView);