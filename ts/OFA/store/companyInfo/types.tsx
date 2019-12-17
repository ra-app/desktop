export const SET_COMPANY_INFO = 'SET_COMPANY_INFO';

export interface CompanyInfo {
  name: string;
  company_number: number;
  active: boolean;
  business: string;
}

export interface CompanyInfoState {
  [key: number]: CompanyInfo;
}

export interface SetCompanyInfoAction {
  type: typeof SET_COMPANY_INFO;
  info: CompanyInfo;
}

export type CompanyInfoActionTypes = SetCompanyInfoAction;
