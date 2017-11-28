import * as constants from './constans'

export function addNewItem(item) {
    return {
        type: constants.ADD_ITEM,
        item: item
    };
};