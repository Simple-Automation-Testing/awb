
import { ItemActions } from './actions';
import { StoreState, ADD_ITEM } from './constans';

export function items(state: StoreState = {
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
}, action: ItemActions): StoreState {
  switch (action.type) {
    case ADD_ITEM:
      return { ...state, items: [...state.items, action.item] };
    default:
      return { ...state };
  };
};