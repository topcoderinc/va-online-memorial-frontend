import * as types from '../constants/actionTypes';

const defaultState = {
  isRegisterActive: false,
  registrationFormEmail: '',
  showSearchModal: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.HIDE_LOGIN_POPUP:
      return {
        ...state,
        isLoginActive: false
      };
    case types.SHOW_LOGIN_POPUP:
      return {
        ...state,
        isRegisterActive: false,
        isLoginActive: true
      };
    case types.HIDE_REGISTER_POPUP:
      return {
        ...state,
        isRegisterActive: false
      };
    case types.SHOW_REGISTER_POPUP:
      return {
        ...state,
        isLoginActive: false,
        isRegisterActive: true
      };
    case types.HIDE_SEARCH_MODAL:
      return {
        ...state,
        showSearchModal: false
      };
    case types.SHOW_SEARCH_MODAL:
      return {
        ...state,
        isLoginActive: false,
        isRegisterActive: false,
        showSearchModal: true
      };
    case types.REGISTRATION_FORM_SET_EMAIL:
      console.log(action);
      return {
        ...state,
        registrationFormEmail: action.email
      };
    default:
      return state;
  }
}
