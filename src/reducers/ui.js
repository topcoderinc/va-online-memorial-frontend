import * as types from '../constants/actionTypes';

const defaultState = {
  showSearchModal: false
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case types.HIDE_SEARCH_MODAL:
      return {
        ...state,
        showSearchModal: false
      };
    case types.SHOW_SEARCH_MODAL:
      return {
        ...state,
        showSearchModal: true
      };
    default:
      return state;
  }
};
