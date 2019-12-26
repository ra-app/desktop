import { CompanyInfo, CompanyInfoActionTypes, CompanyInfoState, SET_COMPANY_AVATAR, SET_COMPANY_INFO, SetCompanyAvatar, SetCompanyInfoAction } from './types';

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
    case SET_COMPANY_AVATAR:
    clonedState = setAvatarDataReducer(clonedState, action);
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

function setAvatarDataReducer(state: CompanyInfoState, action: SetCompanyAvatar): CompanyInfoState {
  const data = action.src;
  console.log(action, "dataaaaaaaaaa");
  if (data) {
  //   if (!state[data.company_id]) {
  //     state[data.company_id] = {} as CompanyTickets;
  //   }
  //   if (!state[data.company_id].tickets) {
  //     state[data.company_id].tickets = {};
  //   }
  //   state[data.company_id].tickets[data.uuid] = data;
  }

  return state;
}
