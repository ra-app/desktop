import React from 'react';
import classNames from 'classnames';

import { getInitials } from '../util/getInitials';
import { LocalizerType } from '../types/Util';

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
      srcImage : '',
      loading: true,
    };
    this.getImage();
  }

  public async getImage() {
    console.log('imageeeeeeeeeeeeeeeeeeeeeeeeeeee')
    const { phoneNumber} = this.props;
    const API_URL = 'https://luydm9sd26.execute-api.eu-central-1.amazonaws.com/latest/';
    const test =  API_URL + 'public/img-uri/' + phoneNumber;
    const result = await (await fetch(test)).json();
    this.setState({srcImage: result.uri, loading: false});
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
    console.log(srcImage, "stateeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
    if (imageBroken) {
      return null;
    }

    const title = `${name || phoneNumber}${
      !name && profileName ? ` ~${profileName}` : ''
    }`;


  // .then(function(response) {
  //   return response.json();
  // })
  // .then(function(myJson) {
  //   console.log(myJson.uri, "666666666666666666666666666666666666666666666666666");
  //   console.log('AAAAAAAAAAA', test)

    return (
      <img
        onError={this.handleImageErrorBound}
        alt={i18n('contactAvatarAlt', [title])}
        src={srcImage}
      />
    );
  }

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
        >
        </div>
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
    const { i18n, name, phoneNumber, profileName, size } = this.props;
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
        className={classNames(
          'module-avatar',
          `module-avatar--${size}`,
          !imageBroken ? 'module-avatar--with-image' : 'module-avatar--no-image'
          // !hasImage ? `module-avatar--${color}` : null
        )}
      >
        {!imageBroken && !loading ? (
          // this.renderImage()
          <img onError={this.handleImageErrorBound}  alt={i18n('contactAvatarAlt', [title])} src={srcImage}/>
        ) : (
          <img src="images/header-chat.png" alt="Default img" />
        )}
      </div>
    );
  }
}
