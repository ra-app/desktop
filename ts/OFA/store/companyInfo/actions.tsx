import { CompanyInfo, SET_COMPANY_INFO, SetCompanyInfoAction } from './types';

export function setCompanyInfo(info: CompanyInfo): SetCompanyInfoAction {
  return {
    type: SET_COMPANY_INFO,
    info: info,
  };
}
