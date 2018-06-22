import { combineReducers } from 'redux';
import auth from './auth.js';
import dataReducer from './dataReducer.js';
import ui from './ui.js';

const allReducers = combineReducers({ auth, dataReducer, ui });

export default allReducers;
