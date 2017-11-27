import * as constants from './constans'

export interface AddItem {
    type: constants.ADD_ITEM;
    item: any;
}

export type ItemActions = AddItem;

export function addNewItem(item: any): AddItem {
  return {
      type: constants.ADD_ITEM,
      item: item
  };
};