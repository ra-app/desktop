import { CompanyInfo, SET_COMPANY_AVATAR, SET_COMPANY_INFO, SetCompanyAvatar, SetCompanyInfoAction } from './types';

export function setCompanyInfo(info: CompanyInfo): SetCompanyInfoAction {
  return {
    type: SET_COMPANY_INFO,
    info: info,
  };
}

export function setCompanyAvatar(companyNumber: number, src: string): SetCompanyAvatar {
  return {
    type: SET_COMPANY_AVATAR,
    src: src,
    company_number: companyNumber,
  };
}

