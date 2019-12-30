export const SET_COMPANY_INFO = 'SET_COMPANY_INFO';
export const SET_COMPANY_AVATAR = 'SET_COMPANY_AVATAR';
export const SET_COMPANY_NAME = 'SET_COMPANY_NAME';


export interface CompanyInfo {
  name: string;
  company_number: number;
  active: boolean;
  business: string;
  company_avatar: string;
}

export interface CompanyInfoState {
  [key: number]: CompanyInfo;
}

export interface SetCompanyInfoAction {
  type: typeof SET_COMPANY_INFO;
  info: CompanyInfo;
}

export interface SetCompanyAvatar {
  type: typeof SET_COMPANY_AVATAR;
  src: string;
  company_number: number;
}

export interface SetCompanyName {
  type: typeof SET_COMPANY_NAME;
  name: string;
  company_number: number;
}

export type CompanyInfoActionTypes = SetCompanyInfoAction | SetCompanyAvatar | SetCompanyName;
