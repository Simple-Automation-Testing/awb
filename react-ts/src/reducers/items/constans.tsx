export const ADD_ITEM = 'ADD_ITEM';
export type ADD_ITEM = typeof ADD_ITEM;

export interface StoreState {
  items: Array<any>;
}