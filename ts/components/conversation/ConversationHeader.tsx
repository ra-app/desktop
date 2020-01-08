import React from 'react';
import { connect } from 'react-redux';

import { setTicketData } from '../../OFA/store/tickets/actions';
import { Ticket } from '../../OFA/store/tickets/types';
import classNames from 'classnames';
import { Emojify } from './Emojify';
import { Avatar } from '../Avatar';
import { LocalizerType } from '../../types/Util';
import { BrowserWindow } from 'electron';

declare var isAdmin: any;
declare global {
  interface Window {
    i18n: any;
  }
}
interface TimerOption {
  name: string;
  value: number;
}

interface Props {
  id: string;
  name?: string;
  rawPhoneNumber?: string;
  phoneNumber: string;
  profileName?: string;
  color: string;
  avatarPath?: string;
  company_id: number;
  uuid: number;
  isVerified: boolean;
  isMe: boolean;
  isGroup: boolean;
  isArchived: boolean;
  isClosed: boolean;
  isCompany: boolean;
  expirationSettingName?: string;
  showBackButton: boolean;
  timerOptions: Array<TimerOption>;

  onSetDisappearingMessages: (seconds: number) => void;
  setTicket: (ticket: Ticket) => any;
  onResetSession: () => void;
  closeTicket: () => void;
  onShowSafetyNumber: () => void;
  onShowAllMedia: () => void;
  onShowGroupMembers: () => void;
  onGoBack: () => void;
  onArchive: () => void;
  onMoveToInbox: () => void;

  i18n: LocalizerType;
  ticket: Ticket;
  window: BrowserWindow;
}

export class ConversationHeader extends React.Component<Props> {
  public state = {
    openMenu: false,
  };
  public wrapperRef: any;
  public wrapperRefImage: any;
  public showMenuBound: () => void;
  public openEditGroupBound: () => void;
  public menuTriggerRef: React.RefObject<any>;
  public isAdmin: boolean = false;

  public constructor(props: Props) {
    super(props);
    this.menuTriggerRef = React.createRef();
    this.showMenuBound = this.showMenu.bind(this);
    this.openEditGroupBound = this.openEditGroup.bind(this);
    this.wrapperRef = React.createRef();
    this.wrapperRefImage = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  public componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.checkIsAdmin();
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  public async checkIsAdmin() {
    this.isAdmin = await isAdmin(this.props.company_id);
  }

  public handleClickOutside(event: any) {
    const { openMenu } = this.state;
    if (openMenu && (this.wrapperRef && (!this.wrapperRef.current.contains(event.target)))) {
      this.setState({ openMenu: false });
    }
  }

  public showMenu() {
    this.setState({ openMenu: !this.state.openMenu });
  }

  public openEditGroup() {
    const { appView } = window['owsDesktopApp'];
    const { name, id } = this.props;
    appView.openModalEditGroup('group', name, id);
  }

  public closeTicket() {
    const tmpTicket = this.props.ticket;
    tmpTicket.state = 3;
    this.props.setTicket(tmpTicket);
    this.props.closeTicket();
  }

  public renderBackButton() {
    const { onGoBack, showBackButton } = this.props;

    return (
      <button
        onClick={onGoBack}
        className={classNames(
          'module-conversation-header__back-icon',
          showBackButton ? 'module-conversation-header__back-icon--show' : null
        )}
        disabled={!showBackButton}
      />
    );
  }

  public renderTitle() {
    const {
      name,
      i18n,
      isMe,
      profileName,
    } = this.props;

    if (isMe) {
      return (
        <div className="module-conversation-header__title">
          {i18n('noteToSelf')}
        </div>
      );
    }

    return (
      <div className="module-conversation-header__title">
        {name ? <Emojify text={name} /> : null}
        {profileName && !name ? (
          <span className="module-conversation-header__title__profile-name">
            ~<Emojify text={profileName} />
          </span>
        ) : null}
      </div>
    );
  }

  public renderAvatar() {
    const {
      avatarPath,
      color,
      i18n,
      isGroup,
      isMe,
      name,
      phoneNumber,
      profileName,
      rawPhoneNumber,
    } = this.props;

    const conversationType = isGroup ? 'group' : 'direct';

    return (
      <span className="module-conversation-header__avatar">
        <Avatar
          avatarPath={avatarPath}
          color={color}
          conversationType={conversationType}
          i18n={i18n}
          noteToSelf={isMe}
          name={name}
          phoneNumber={phoneNumber}
          profileName={profileName}
          size={28}
          rawPhoneNumber={rawPhoneNumber}
        />
      </span>
    );
  }

  public renderExpirationLength() {
    const { expirationSettingName } = this.props;
    if (!expirationSettingName) {
      return null;
    }

    return (
      <div className="module-conversation-header__expiration">
        <div className="module-conversation-header__expiration__clock-icon" />
        <div className="module-conversation-header__expiration__setting">
          {expirationSettingName}
        </div>
      </div>
    );
  }

  public renderGear() {
    return (
      <div className="menuButton">
        <span onClick={this.showMenuBound}>
          <img
            style={{ height: 30 }}
            src="images/icons/menu_over_blue_24x24.svg"
            className="chat_menu"
            alt="Chat menu"
          />
        </span>
      </div>
    );
  }

  public renderMenu() {
    const {
      i18n,
      isGroup,
      isArchived,
      isClosed,
      onArchive,
      onMoveToInbox,
      isCompany,
    } = this.props;

    return (
      <div className="module-main-header__info" style={{ padding: 0 }}>
        <div className="menuChat" ref={this.wrapperRef}>
          <ul className="ulMenuChat">
            {isArchived ? (
              <li onClick={onMoveToInbox}>
                <span>
                  {i18n('moveConversationToInbox')}
                </span>
              </li>
            ) : !isCompany && (
              <li onClick={onArchive}>
                {i18n('archiveConversation')}
              </li>
            )}
            {(isGroup) && (
              <li>
                <span onClick={this.openEditGroupBound}>Gruppe bearbeiten</span>
              </li>
            )}
            {((!isCompany && !isClosed) && !isGroup) && this.isAdmin && (
              <li onClick={() => this.closeTicket()}>
                <span>
                  {i18n('closeTicket')}
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  }

  public render() {

    return (
      <div className="module-conversation-header">
        {this.renderBackButton()}
        <div className="module-conversation-header__title-container">
          <div className="module-conversation-header__title-flex">
            {this.renderAvatar()}
            {this.renderTitle()}
          </div>
        </div>
        {this.renderExpirationLength()}
        {!this.state.openMenu ? (
          this.renderGear()
        ) : (
            this.renderMenu()
          )}
      </div>
    );
  }
}

const mapStateToProp = (state: any, props: Props): Props => {
  let ticket: Ticket | Array<any> = [];
  if (!props.isGroup && !props.isCompany) {
    const company_id = props.company_id;
    const uuid = props.uuid;
    if (state.tickets && state.tickets[company_id] && state.tickets[company_id].tickets) {
      ticket = state.tickets[company_id].tickets[uuid];
    }

  }

  return { ticket } as Props;
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setTicket: (ticket: Ticket) => dispatch(setTicketData(ticket)),
  };
};

// tslint:disable-next-line:no-default-export
export default connect(mapStateToProp, mapDispatchToProps)(ConversationHeader);
