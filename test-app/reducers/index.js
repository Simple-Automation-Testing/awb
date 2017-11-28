import { createStore, combineReducers } from 'redux';
import { items } from './items/index';
import { names } from './names/index';

const rootReducer = combineReducers({
  names, items
})


export const store = createStore(rootReducer);