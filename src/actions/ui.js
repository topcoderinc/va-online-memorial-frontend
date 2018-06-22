import * as types from '../constants/actionTypes';

// Show the search modal
function showSearchModal() {
  return (dispatch) => {
    dispatch({ type: types.SHOW_SEARCH_MODAL });
  }
}

// Hide the search modal
function hideSearchModal() {
  return (dispatch) => {
    dispatch({ type: types.HIDE_SEARCH_MODAL });
  }
}

export default {
  hideSearchModal,
  showSearchModal,
};
