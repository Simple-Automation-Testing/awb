
import { ItemActions } from './actions';
import { StoreState, ADD_ITEM } from './constans';

export function items(state = {
  items: [
    { component: "red" },
    { component: "red" },
    { component: "red" },
    { component: "red" },
    { component: "red" },
    { component: "red" },
    { component: "red" },
    { component: "red" }
  ]
}, action) {
  switch (action.type) {
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.item] };
    default:
      return { ...state };
  };
};