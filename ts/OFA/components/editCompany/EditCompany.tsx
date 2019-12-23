import React, { Fragment } from 'react';
import Avatar from '../avatar/Avatar';
import { CompanyInfo } from '../../store/companyInfo/types';

interface Props {
  info: CompanyInfo;
}

// interface State {

// }

// export default class EditCompany extends React.Component<Props, State> {
// tslint:disable-next-line:no-default-export
export default class EditCompany extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    // this.state = {
    // };
  }

  // public componentDidMount() {}

  public render() {
    const {
      info: {
        company_avatar,
        company_number,
        name,
      },
    } = this.props;

    return (
     <Fragment>
      <div id="edit_company_data" className="edit-company-container">
        <div className="companyAvatarContainer">
          <div className="avatarCompanyContainer">
            <Avatar avatarSrc={company_avatar} id={`companyAvatar-${company_number}`}/>
          </div>
          <div className="buttonEditCompany">
            <div>
              <img className="closeIcon" id="closeEdit" src="images/icons/x-searchbar.svg" alt="close edit company" />
            </div>
            <div className="changeAvatar">
              <input type="file" className="hidden" id="inputNewAvatar" placeholder="input file" />
              <img className="editIconAvatar" id="editAvatar" src="images/icons/edit-blue.svg" alt="upload new avatar"/>
            </div>
          </div>
        </div>
        <div className="containerLabelInfoCompany">
          <label className="labelEditName">Name des Unternehmens</label>
        </div>
        <div className="containerDataEditCompany" id="nameSection">
          <div className="companyNameEdit">
            <span id="spanCompanyName">{name}</span>
          </div>
          <div className="buttonEditCompany">
            <img className="editIcon" id="editName" src="images/icons/edit-blue.svg" alt="edit name company"/>
          </div>
        </div>
        <button className="buttonSaveEditCompany disabled"  id="buttonSaveEditCompany">Speichern</button>
      </div>
     </Fragment>
    );
  }
}
