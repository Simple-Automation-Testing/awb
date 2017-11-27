export const ADD_NEW_NAME = 'ADD_NEW_NAME';
export type ADD_NEW_NAME = typeof ADD_NEW_NAME;

export const REMOVE_NAME = 'REMOVE_NAME';
export type REMOVE_NAME = typeof REMOVE_NAME;

export const SORT_NAMES = 'SORT_NAMES';
export type SORT_NAMES = typeof SORT_NAMES;

export interface StoreState {
  names: Array<string>;
}