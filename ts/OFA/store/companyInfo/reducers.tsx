import { CompanyInfo, CompanyInfoActionTypes, CompanyInfoState, SET_COMPANY_AVATAR, SET_COMPANY_NAME, SET_COMPANY_INFO, SetCompanyAvatar, SetCompanyInfoAction, SetCompanyName } from './types';

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
    case SET_COMPANY_NAME:
      clonedState = setNameDataReducer(clonedState, action);
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
  const data = action;
  if (data) {
    if (!state[data.company_number]) {
      state[data.company_number] = {} as CompanyInfo;
    }
    if (!state[data.company_number].company_avatar) {
      state[data.company_number].company_avatar = '';
    }
    state[data.company_number].company_avatar = data.src;
  }

  return state;
}

function setNameDataReducer(state: CompanyInfoState, action: SetCompanyName): CompanyInfoState {
  const data = action;
  if (data) {
    if (!state[data.company_number]) {
      state[data.company_number] = {} as CompanyInfo;
    }
    if (!state[data.company_number].name) {
      state[data.company_number].name = '';
    }
    state[data.company_number].name = data.name;
  }

  return state;
}
