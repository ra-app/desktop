import { CompanyInfo, SET_COMPANY_AVATAR, SET_COMPANY_INFO,  SET_COMPANY_NAME, SetCompanyAvatar, SetCompanyInfoAction, SetCompanyName } from './types';

export function setCompanyInfo(info: CompanyInfo): SetCompanyInfoAction {
  return {
    type: SET_COMPANY_INFO,
    info: info,
  };
}

export function setCompanyAvatarSrc(companyNumber: number, src: string): SetCompanyAvatar {
  return {
    type: SET_COMPANY_AVATAR,
    src: src,
    company_number: companyNumber,
  };
}

export function setCompanyName(companyNumber: number, name: string): SetCompanyName {
  return {
    type: SET_COMPANY_NAME,
    name: name,
    company_number: companyNumber,
  };
}

