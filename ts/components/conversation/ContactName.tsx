import React, { Fragment } from 'react';

import { Emojify } from './Emojify';

interface Props {
  phoneNumber?: string;
  name?: string;
  profileName?: string;
  type?: string;
  module?: string;
}

export class ContactName extends React.Component<Props> {
  public render() {
    const { name, profileName, type, module } = this.props;
    const title = name ? name : 'unknown';
    let groupName = null;
    if (type === 'group' && title.includes('-')) {
      groupName = title.split('-');
    }
    const prefix = module ? module : 'module-contact-name';

    const shouldShowProfile = Boolean(profileName && !name);
    const profileElement = shouldShowProfile ? (
      <span className={`${prefix}__profile-name`}>
        ~<Emojify text={profileName || ''} />
      </span>
    ) : null;

    return (
      <span className={prefix} dir="auto">
        {type === 'group' && groupName !== null ? (
          <Fragment>
            <div className="breakGroupName">
              {groupName[0]} -
            </div>
            <div className="breakGroupName">
              {groupName[1]}
            </div>
          </Fragment>
        ) : (
            <Emojify text={title} />
          )}
        {shouldShowProfile ? ' ' : null}
        {profileElement}
      </span>
    );
  }
}
