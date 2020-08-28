import { combineReducers } from 'redux';
import homeReducer from '../module/home/reducer/home';

export default combineReducers({
  ...homeReducer,
});
