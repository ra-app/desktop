import React from 'react';
import { debounce } from 'lodash';

// import { Avatar } from './Avatar';

import { cleanSearchTerm } from '../util/cleanSearchTerm';
import { LocalizerType } from '../types/Util';

export interface Props {
  searchTerm: string;

  // To be used as an ID
  ourNumber: string;
  regionCode: string;

  // For display
  phoneNumber: string;
  isMe: boolean;
  name?: string;
  color: string;
  verified: boolean;
  profileName?: string;
  avatarPath?: string;

  i18n: LocalizerType;
  updateSearchTerm: (searchTerm: string) => void;
  search: (
    query: string,
    options: {
      regionCode: string;
      ourNumber: string;
      noteToSelf: string;
    }
  ) => void;
  clearSearch: () => void;
}

declare global {
  interface Window {
    owsDesktopApp: any;
  }
}

export class MainHeader extends React.Component<Props> {
  public state = {
    openMenu: false,
  };
  private readonly updateSearchBound: (
    event: React.FormEvent<HTMLInputElement>
  ) => void;
  private readonly clearSearchBound: () => void;
  private readonly handleKeyUpBound: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
  private readonly setFocusBound: () => void;
  private readonly chatMenuBound: () => void;
  private readonly showContactsBound: () => void;
  private readonly importAdminBound: () => void;
  private readonly importKundeBound: () => void;
  private readonly createGroupBound: () => void;
  private readonly inputRef: React.RefObject<HTMLInputElement>;
  private readonly debouncedSearch: (searchTerm: string) => void;

  constructor(props: Props) {
    super(props);

    this.updateSearchBound = this.updateSearch.bind(this);
    this.clearSearchBound = this.clearSearch.bind(this);
    this.handleKeyUpBound = this.handleKeyUp.bind(this);
    this.setFocusBound = this.setFocus.bind(this);
    this.chatMenuBound = this.chatMenu.bind(this);
    this.showContactsBound = this.showContacts.bind(this);
    this.importAdminBound = this.importAdmin.bind(this);
    this.importKundeBound = this.importKunde.bind(this);
    this.createGroupBound = this.createGroup.bind(this);
    this.inputRef = React.createRef();

    this.debouncedSearch = debounce(this.search.bind(this), 20);
  }

  public search() {
    const { searchTerm, search, i18n, ourNumber, regionCode } = this.props;
    if (search) {
      search(searchTerm, {
        noteToSelf: i18n('noteToSelf').toLowerCase(),
        ourNumber,
        regionCode,
      });
    }
  }

  public updateSearch(event: React.FormEvent<HTMLInputElement>) {
    const { updateSearchTerm, clearSearch } = this.props;
    const searchTerm = event.currentTarget.value;

    if (!searchTerm) {
      clearSearch();

      return;
    }

    if (updateSearchTerm) {
      updateSearchTerm(searchTerm);
    }

    if (searchTerm.length < 2) {
      return;
    }

    const cleanedTerm = cleanSearchTerm(searchTerm);
    if (!cleanedTerm) {
      return;
    }

    this.debouncedSearch(cleanedTerm);
  }

  public clearSearch() {
    const { clearSearch } = this.props;

    clearSearch();
    this.setFocus();
  }

  public handleKeyUp(event: React.KeyboardEvent<HTMLInputElement>) {
    const { clearSearch } = this.props;

    if (event.key === 'Escape') {
      clearSearch();
    }
  }

  public setFocus() {
    if (this.inputRef.current) {
      // @ts-ignore
      this.inputRef.current.focus();
    }
  }

  public chatMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }
  public showContacts() {
    // this.setState({openMenu: !this.state.openMenu});
    const { appView } = window['owsDesktopApp'];
    console.log('appView', appView);
    this.setState({ openMenu: !this.state.openMenu });
    appView.openContact();
  }
  public importAdmin() {
    const { appView } = window['owsDesktopApp'];
    appView.openModalImport('admin');
    this.setState({ openMenu: !this.state.openMenu });
  }
  public importKunde() {
    const { appView } = window['owsDesktopApp'];
    appView.openModalImport('kunde');
    this.setState({ openMenu: !this.state.openMenu });
  }

  public createGroup() {
    const { appView } = window['owsDesktopApp']
    appView.openModalImport('group');
    this.setState({ openMenu: !this.state.openMenu })
  }
  public render() {
    const {
      searchTerm,
      // avatarPath,
      i18n,
      // color,
      // name,
      // phoneNumber,
      // profileName,
    } = this.props;
    const { openMenu } = this.state;

    return (
      <div>
        <div className="module-main-header__info">
          <img src="images/header-chat.png" alt="header chat" />
          <span>Kommunikation</span>
          <img
            src="images/icons/menu_over_blue_24x24.svg"
            className="chat_menu"
            alt="Cbat menu"
            onClick={this.chatMenuBound}
          />
          {openMenu && (
            <div className="menuChat">
              <ul className="ulMenuChat">
                <li>
                  <span>Broadcast erstellen</span>
                  <img
                    src="images/icons/broadcast_einladen_35x35.svg"
                    className="imageLiChatMenu"
                    alt="Create broadcast"
                  />
                </li>
                <li onClick={this.createGroupBound}>
                  <span>Gruppe erstellen</span>
                  <img
                    src="images/icons/broadcast_einladen_35x35.svg"
                    className="imageLiChatMenu"
                    alt="Create broadcast"
                  />
                </li>
                <li onClick={this.importKundeBound}>
                  <span>Externe Nutzer einladen</span>
                  <img
                    src="images/icons/user_einladen_35x35.svg"
                    className="imageLiChatMenu"
                    alt="Add user"
                  />
                </li>
                <li onClick={this.importAdminBound}>
                  <span>Interne Nutzer einladen</span>
                  <img
                    src="images/icons/admin_einladen_35x35.svg"
                    className="imageLiChatMenu"
                    alt="Add admin"
                  />
                </li>
                <li onClick={this.showContactsBound}>
                  <span>Kontaktliste</span>
                  <img
                    src="images/icons/contact_list_35x35.svg"
                    className="imageLiChatMenu"
                    alt="Import contacts"
                  />
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="module-main-header">
          {/* <Avatar
          avatarPath={avatarPath}
          color={color}
          conversationType="direct"
          i18n={i18n}
          name={name}
          phoneNumber={phoneNumber}
          profileName={profileName}
          size={28}
        /> */}
          <div className="module-main-header__search">
            <div
              role="button"
              className="module-main-header__search__icon"
              onClick={this.setFocusBound}
            />
            <input
              type="text"
              ref={this.inputRef}
              className="module-main-header__search__input"
              placeholder={i18n('search')}
              dir="auto"
              onKeyUp={this.handleKeyUpBound}
              value={searchTerm}
              onChange={this.updateSearchBound}
            />
            {searchTerm ? (
              <div
                role="button"
                className="module-main-header__search__cancel-icon"
                onClick={this.clearSearchBound}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
