import * as types from '../constants/actionTypes';

// Hide/Show Login
function hideLoginPopup() {
  return (dispatch) => {
    dispatch({ type: types.HIDE_LOGIN_POPUP });
  }
}

function showLoginPopup() {
  return (dispatch) => {
    dispatch({ type: types.SHOW_LOGIN_POPUP });
  }
}

// Hide/Show Register
function hideRegisterPopup() {
  return (dispatch) => {
    dispatch({ type: types.HIDE_REGISTER_POPUP });
  }
}

function showRegisterPopup() {
  return (dispatch) => {
    dispatch({ type: types.SHOW_REGISTER_POPUP });
  }
}

// Hide/Show Search
function hideSearchModal() {
  return (dispatch) => {
    dispatch({ type: types.HIDE_SEARCH_MODAL });
  }
}

function showSearchModal() {
  return (dispatch) => {
    dispatch({ type: types.SHOW_SEARCH_MODAL });
  }
}

// Copies email from "Become a Member" form to the Registration Form
function registrationFormSetEmail(email) {
  return (dispatch) => {
    dispatch({ type: types.REGISTRATION_FORM_SET_EMAIL, email })
  }
}

export default {
  hideLoginPopup,
  showLoginPopup,
  hideRegisterPopup,
  showRegisterPopup,
  hideSearchModal,
  showSearchModal,
  registrationFormSetEmail
};
