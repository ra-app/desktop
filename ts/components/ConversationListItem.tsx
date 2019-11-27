import React from 'react';
import classNames from 'classnames';

import { Avatar } from './Avatar';
import { MessageBody } from './conversation/MessageBody';
import { Timestamp } from './conversation/Timestamp';
import { ContactName } from './conversation/ContactName';
import { TypingAnimation } from './conversation/TypingAnimation';

import { LocalizerType } from '../types/Util';

export type PropsData = {
  id: string;
  phoneNumber: string;
  color?: string;
  profileName?: string;
  name?: string;
  type: 'group' | 'direct' | 'company';
  avatarPath?: string;
  isMe: boolean;
  rawPhoneNumber?: string;

  lastUpdated: number;
  unreadCount: number;
  isSelected: boolean;

  isTyping: boolean;
  lastMessage?: {
    status: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
    text: string;
  };
};

type PropsHousekeeping = {
  i18n: LocalizerType;
  style?: Object;
  onClick?: (id: string) => void;
  openConversation?: (id: string) => void;
  openBlackboard?: (id: string) => void;
};

type Props = PropsData & PropsHousekeeping;

export class ConversationListItem extends React.PureComponent<Props> {
  public state = {
    lastUpdated: 'images/icons/post-it-pin-icon.svg',
  };
  private interval: any;

  constructor(props: Props) {
    super(props);

    this.interval = null;
  }
  public componentDidMount() {
    document.addEventListener('notificationNote', () => this.addNotification());
  }
  public componentWillUnmount() {
   this.cleanMyInterval();
  }
  public cleanMyInterval() {
    if (this.interval) {
      clearInterval(this.interval);
      this.setState({
        lastUpdated: 'images/icons/post-it-pin-icon.svg',
      });
    }
  }
  public addNotification() {
    this.interval = setInterval(() => {this.updateImg(); }, 2000);
  }

  public updateImg ()  {
    if (this.state.lastUpdated === 'images/icons/post-it-pin-icon.svg') {
      this.setState({
        lastUpdated: 'images/icons/post-it-pin-icon-red-corner.svg',
      });
    } else {
      this.setState({
        lastUpdated: 'images/icons/post-it-pin-icon.svg',
      });
    }
  }

  public renderAvatar() {
    const {
      avatarPath,
      color,
      type,
      i18n,
      isMe,
      name,
      phoneNumber,
      profileName,
      rawPhoneNumber,
    } = this.props;

    return (
      <div className="module-conversation-list-item__avatar-container">
        <Avatar
          avatarPath={avatarPath}
          color={color}
          noteToSelf={isMe}
          conversationType={type}
          i18n={i18n}
          name={name}
          phoneNumber={phoneNumber}
          profileName={profileName}
          size={48}
          rawPhoneNumber={rawPhoneNumber}
        />
        {this.renderUnread()}
      </div>
    );
  }

  public renderUnread() {
    const { unreadCount } = this.props;

    if (unreadCount > 0) {
      return (
        <div className="module-conversation-list-item__unread-count">
          {unreadCount}
        </div>
      );
    }

    return null;
  }

  public renderHeader() {
    const {
      unreadCount,
      i18n,
      isMe,
      lastUpdated,
      name,
      phoneNumber,
      profileName,
    } = this.props;

    return (
      <div className="module-conversation-list-item__header">
        <div
          className={classNames(
            'module-conversation-list-item__header__name',
            unreadCount > 0
              ? 'module-conversation-list-item__header__name--with-unread'
              : null
          )}
        >
          {isMe ? (
            i18n('noteToSelf')
          ) : (
              <ContactName
                phoneNumber={phoneNumber}
                name={name}
                profileName={profileName}
              />
            )}
        </div>
        <div
          className={classNames(
            'module-conversation-list-item__header__date',
            unreadCount > 0
              ? 'module-conversation-list-item__header__date--has-unread'
              : null
          )}
        >
          <Timestamp
            timestamp={lastUpdated}
            extended={false}
            module="module-conversation-list-item__header__timestamp"
            i18n={i18n}
          />
        </div>
      </div>
    );
  }

  public renderMessage() {
    const { lastMessage, isTyping, unreadCount, i18n } = this.props;
    if (!lastMessage && !isTyping) {
      return null;
    }
    let text = lastMessage && lastMessage.text ? lastMessage.text : '';

    const magicWord = '[![TICKETMSG]!]';
    if (text.indexOf(magicWord) !== -1) {
      text = text.replace(magicWord, '');
    }

    const magicLine = '[![TICKETLINE]!]';
    if (text.indexOf(magicLine) !== -1) {
      text = text.replace(magicLine, '');
    }

    return (
      <div className="module-conversation-list-item__message">
        <div
          className={classNames(
            'module-conversation-list-item__message__text',
            unreadCount > 0
              ? 'module-conversation-list-item__message__text--has-unread'
              : null
          )}
        >
          {isTyping ? (
            <TypingAnimation i18n={i18n} />
          ) : (
              <MessageBody
                text={text}
                disableJumbomoji={true}
                disableLinks={true}
                i18n={i18n}
              />
            )}
        </div>
        {lastMessage && lastMessage.status ? (
          <div
            className={classNames(
              'module-conversation-list-item__message__status-icon',
              `module-conversation-list-item__message__status-icon--${
              lastMessage.status
              }`
            )}
          />
        ) : null}
      </div>
    );
  }
  public render() {
    const {
      unreadCount,
      onClick,
      id,
      isSelected,
      openConversation,
      openBlackboard,
      style,
    } = this.props;
    return (
      <div
        role="button"
        onClick={() => {
          if (this.props.type == 'company' && onClick) {
            onClick(id);
          }
          if (
            (this.props.type == 'direct' || this.props.type == 'group') &&
            openConversation
          ) {
            openConversation(id);
          }
        }}
        style={style}
        className={classNames(
          'module-conversation-list-item',
          unreadCount > 0 ? 'module-conversation-list-item--has-unread' : null,
          isSelected ? 'module-conversation-list-item--is-selected' : null
        )}
      >
        {this.renderAvatar()}
        <div className="module-conversation-list-item__content">
          {this.renderHeader()}
          {this.renderMessage()}
          {(this.props.type === 'company' && openBlackboard) && (
            <div onClick={(evt) => { evt.preventDefault(); evt.stopPropagation(); this.cleanMyInterval(); openBlackboard(id); }}>
              <img className='iconOpenBlackboard' src={this.state.lastUpdated} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
