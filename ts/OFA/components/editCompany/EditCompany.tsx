import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Avatar from '../avatar/Avatar';
import { CompanyInfo } from '../../store/companyInfo/types';
import { setCompanyAvatarSrc } from '../../store/companyInfo/actions';
declare var updateCompanyName: any;
declare var setCompanyAvatar: any;
declare var updateImagesByUrl: any;
declare var CENTRAL_IMG_ROOT: string;
declare var toBase64: any;
interface Props {
  info: CompanyInfo;
  closeEdit: any;
  setAvatar(companyNumber: number, src: string): any;
}

interface State {
  editingCompanyName: boolean;
  companyNameValue: string;
  companyAvatarValue: any;
  displayedAvatar: string;
  disabledSaveCompany: boolean;
}
// tslint:disable-next-line:no-default-export
export  class EditCompany extends React.Component<Props, State> {
  // newAvatar: boolean;
  constructor(props: Props) {
    super(props);
    this.state = {
      editingCompanyName: false,
      companyNameValue: this.props.info.name,
      companyAvatarValue: { data: null, type: null },
      displayedAvatar: this.props.info.company_avatar,
      disabledSaveCompany: true,
    };
  }

  public editCompanyName() {
    this.setState({ editingCompanyName: !this.state.editingCompanyName });
  }

  public updatingCompanyName(e: any) {
    if (this.state.disabledSaveCompany) {
      this.setState({ disabledSaveCompany: false });
    }
    if (e.target.value === '' || e.target.value === ' ') {
      this.setState({ disabledSaveCompany: true });
    }
    this.setState({ companyNameValue: e.target.value });
  }

  public openFileSelector() {
    if (document.getElementById('inputNewAvatar')) {
      // tslint:disable-next-line:no-non-null-assertion
      document.getElementById('inputNewAvatar')!.click();
    }
  }

  public updatingCompanyAvatar(e: any) {
    const currentFile = e.target.files[0];
    let base64: any = '';
    const imageType = 'image/png';
    const width = 140;
    const height = 140;
    const fileName = currentFile.name;
    const reader = new FileReader();
    reader.readAsDataURL(currentFile);
    reader.onload = () => {
      const img: any = new Image();
      img.src = reader.result;
      // tslint:disable-next-line:ban-comma-operator
      (img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx: any = elem.getContext('2d');
        ctx.drawImage(img, ((img.naturalWidth / 2) - (300 / 2)), ((img.naturalHeight / 2) - (300 / 2)), 300, 300, 0, 0, width, height);
        ctx.canvas.toBlob(
          async (blob: BlobPart) => {
            base64 = new File([blob], fileName, {
              type: imageType,
              lastModified: Date.now(),
            });
            base64 = await toBase64(base64);
            this.setState({ displayedAvatar: base64 });
            base64 = base64.split(',')[1];
            const dataCompanyAvatar = {
              data: base64,
              type: imageType.split('/')[1],
            };
            this.setState({ disabledSaveCompany: false, companyAvatarValue: dataCompanyAvatar });
          }, imageType, 1
        );
      }),
        (reader.onerror = error => console.warn(error));
    };
  }

  public async updateCompanyInfo() {
    // double check before to upload the compan
    const companyID = this.props.info.company_number;
    const companyName = this.props.info.name;
    const date = Date.now();
    const companyAvatar = this.props.info.company_avatar ;

    // const src = `${companyAvatar}?ts=${date}`;
    const src = this.updateQueryStringParameter(companyAvatar, 'ts', date);
    if (!this.state.disabledSaveCompany) {
      if (this.state.companyNameValue !== companyName) {
        await updateCompanyName(this.state.companyNameValue, companyID);
      }
      if (this.state.companyAvatarValue.data !== null) {
        setCompanyAvatar(companyID, this.state.companyAvatarValue);
        this.props.setAvatar(companyID, src);
      }
      this.setState({ disabledSaveCompany: true });
          updateImagesByUrl(CENTRAL_IMG_ROOT + companyID);
    }
  }

  public updateQueryStringParameter(uri: string, key: string, value: number) {
    const re = new RegExp(`([?&])${key}=.*?(&|$)`);
    const separator = uri.indexOf('?') !== -1 ? '&' : '?';
    if (uri.match(re)) {
      // console.log('replaceeeeeeeeeeeeeeeeee')
      return uri.replace(re, `$1${key}=${value}$2`);
    } else {
      // console.log('normallllllllllll')
      return `${uri}${separator}${key}=${value}`;
    }
  }

  public closeEdit() {
    this.props.closeEdit();
  }

  public render() {
    const { displayedAvatar, companyNameValue, editingCompanyName, disabledSaveCompany } = this.state;
    const { info: { company_number, name } } = this.props;

    return (
      <Fragment>
        <div id="edit_company_data" className="edit-company-container">
          <div className="companyAvatarContainer">
            <div className="avatarCompanyContainer">
              {/* tslint:disable-next-line:use-simple-attributes */}
              <Avatar avatarSrc={displayedAvatar} id={`companyAvatar-${company_number}`} size={120} />
            </div>
            <div className="buttonEditCompany">
              <div>
                <img onClick={() => this.closeEdit()} className="closeIcon" id="closeEdit" src="images/icons/x-searchbar.svg" alt="close edit company" />
              </div>
              <div className="changeAvatar">
                <input type="file" onChange={e => this.updatingCompanyAvatar(e)} className="hidden" id="inputNewAvatar" placeholder="input file" />
                <img onClick={() => this.openFileSelector()} className="editIconAvatar" id="editAvatar" src="images/icons/edit-blue.svg" alt="upload new avatar" />
              </div>
            </div>
          </div>
          <div className="containerLabelInfoCompany">
            <label className="labelEditName">Name des Unternehmens</label>
          </div>
          {editingCompanyName ? (
            <input id="companyNameInput" onChange={e => this.updatingCompanyName(e)} value={companyNameValue} />
          ) : (
              <div className="containerDataEditCompany" id="nameSection">
                <div className="companyNameEdit">
                  <span id="spanCompanyName">{name}</span>
                </div>
                {/* tslint:disable-next-line:react-a11y-event-has-role */}
                <div className="buttonEditCompany" onClick={() => this.editCompanyName()}>
                  <img className="editIcon" id="editName" src="images/icons/edit-blue.svg" alt="edit name company" />
                </div>
              </div>
            )}
          <button
            className={`buttonSaveEditCompany ${disabledSaveCompany && 'disabled'}`}
            disabled={disabledSaveCompany}
            id="buttonSaveEditCompany"
            onClick={() => this.updateCompanyInfo()}
          >
            Speichern
          </button>
        </div>
      </Fragment>
    );
  }
}
const mapDispatchToProps = (dispatch: any) => {
  return {
    setAvatar: (companyNumber: number, src: string) => dispatch(setCompanyAvatarSrc(companyNumber, src)),

  };
};
// tslint:disable-next-line:no-default-export
export default connect(null, mapDispatchToProps)(EditCompany);
