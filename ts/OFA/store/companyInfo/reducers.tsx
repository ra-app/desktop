import { CompanyInfo, CompanyInfoActionTypes, CompanyInfoState, SET_COMPANY_INFO, SetCompanyInfoAction } from './types';

const initialState: CompanyInfoState = {};

export function companyInfoReducer(
  state = initialState,
  action: CompanyInfoActionTypes
): CompanyInfoState {
  let clonedState = {...state};

  switch (action.type) {
    case SET_COMPANY_INFO:
      clonedState = setCompanyInfoReducer(clonedState, action);
      break;
    default:
  }

  return clonedState;
}

function setCompanyInfoReducer(state: CompanyInfoState, action: SetCompanyInfoAction): CompanyInfoState {
  if (action.info) {
    if (!state[action.info.company_number]) {
      state[action.info.company_number] = {} as CompanyInfo;
    }
    state[action.info.company_number] = action.info;
  }

  return state;
}
