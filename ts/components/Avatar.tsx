import React from 'react';
import classNames from 'classnames';

import { getInitials } from '../util/getInitials';
import { LocalizerType } from '../types/Util';

declare var getClientPhone: any;
interface Props {
  avatarPath?: string;
  color?: string;
  conversationType: 'group' | 'direct' | 'company';
  i18n: LocalizerType;
  noteToSelf?: boolean;
  name?: string;
  phoneNumber?: string;
  profileName?: string;
  size: number;
  rawPhoneNumber?: string;
  onclick?: () => void;
  className?: string;
}

interface State {
  imageBroken: boolean;
  srcImage: string;
  loading: boolean;
}

export class Avatar extends React.Component<Props, State> {
  public handleImageErrorBound: () => void;

  public constructor(props: Props) {
    super(props);

    this.handleImageErrorBound = this.handleImageError.bind(this);

    this.state = {
      imageBroken: false,
      srcImage: '',
      loading: true,
    };
    this.getImage();
  }

  public async getImage() {
    const { phoneNumber, rawPhoneNumber, conversationType } = this.props;
    const API_URL =
      'https://luydm9sd26.execute-api.eu-central-1.amazonaws.com/latest/';
    let avatar = '';
    if (conversationType === 'company') {
      avatar = API_URL + 'public/img/' + phoneNumber;
    } else if (conversationType === 'direct') {
      const getClientInfo = await getClientPhone(rawPhoneNumber);
      const clientUuid = getClientInfo.uuid;
      avatar =  API_URL + 'public/img/' + clientUuid;
    }
    const result =  await fetch(avatar);
    this.setState({ srcImage: result.url, loading: false });
  }
  public handleImageError() {
    // tslint:disable-next-line no-console
    console.log('Avatar: Image failed to load; failing over to placeholder');
    this.setState({
      imageBroken: true,
    });
  }

  public renderImage = async () => {
    const { i18n, name, phoneNumber, profileName } = this.props;
    const { imageBroken, srcImage } = this.state;
    if (imageBroken) {
      return null;
    }

    const title = `${name || phoneNumber}${
      !name && profileName ? ` ~${profileName}` : ''
    }`;

    return (
      <img
        onError={this.handleImageErrorBound}
        alt={i18n('contactAvatarAlt', [title])}
        src={srcImage}
      />
    );
  };

  public renderNoImage() {
    const { conversationType, name, noteToSelf, size } = this.props;

    const initials = getInitials(name);
    const isGroup = conversationType === 'group';

    if (noteToSelf) {
      return (
        <div
          className={classNames(
            'module-avatar__icon',
            'module-avatar__icon--note-to-self',
            `module-avatar__icon--${size}`
          )}
        />
      );
    }

    if (!isGroup && initials) {
      return (
        <div
          className={classNames(
            'module-avatar__label',
            `module-avatar__label--${size}`
          )}
        />
      );
    }

    return (
      <div
        className={classNames(
          'module-avatar__icon',
          `module-avatar__icon--${conversationType}`,
          `module-avatar__icon--${size}`
        )}
      />
    );
  }

  public render() {
    const { i18n, name, phoneNumber, profileName, size, conversationType } = this.props;
    const { imageBroken, srcImage, loading } = this.state;

    // const hasImage = !noteToSelf && avatarPath && !imageBroken;
    const title = `${name || phoneNumber}${
      !name && profileName ? ` ~${profileName}` : ''
    }`;
    if (size !== 28 && size !== 36 && size !== 48 && size !== 80) {
      throw new Error(`Size ${size} is not supported!`);
    }

    return (
      <div
        onClick={this.props.onclick}
        className={this.props.className ? this.props.className : classNames(
          'module-avatar',
          `module-avatar--${size}`,
          !imageBroken ? 'module-avatar--with-image' : 'module-avatar--no-image'
          // !hasImage ? `module-avatar--${color}` : null
        )}
      >
        {!imageBroken && !loading ? (
          // this.renderImage()
          // tslint:disable-next-line:use-simple-attributes
          <img
            className={this.props.className ? this.props.className : ''}
            onError={this.handleImageErrorBound}
            alt={i18n('contactAvatarAlt', [title])}
            src={srcImage}
          />
        ) : (
          // tslint:disable-next-line:use-simple-attributes
          <img  className={conversationType === 'company' ? 'companyAvatarDefault' : ''} src="images/firmen-logo.png" alt="Default img" />
        )}
      </div>
    );
  }
}
