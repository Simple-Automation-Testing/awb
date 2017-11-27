
import { NamesActions } from './actions';
import { StoreState, ADD_NEW_NAME, REMOVE_NAME, SORT_NAMES } from './constans';

export function names(state: StoreState = { names: [] }, action: NamesActions): StoreState {
  switch(action.type) {
    case ADD_NEW_NAME:
      return { ...state, names: [...state.names, action.name] };
    case REMOVE_NAME:
      return { ...state, names: state.names.filter(name => name != action.name) };
    case SORT_NAMES:
      return {
        ...state, names: [...state.names.sort((a: any, b: any) => {
          const firstArg = action.directive == 'First name' ? a : a.split(' ')[1];
          const secondArg = action.directive == 'First name' ? b : b.split(' ')[1];
          return firstArg.toLowerCase() > secondArg.toLowerCase() ? 1 : firstArg.toLowerCase() < secondArg.toLowerCase() ? -1 : 0
        })]
      }
    default:
      return { ...state };
  };
};