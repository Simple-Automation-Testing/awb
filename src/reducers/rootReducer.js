import {combineReducers, createStore} from 'redux';
import elements from './elements';

export default createStore(combineReducers({
  elements
}));
