import * as constants from './constans'

export function removeName(name) {
    return {
        type: constants.REMOVE_NAME,
        name: name
    };
};


export function sortNames(directive) {
    return {
        type: constants.SORT_NAMES,
        directive
    }
}

export function addNewName(name) {
    return {
        type: constants.ADD_NEW_NAME,
        name: name
    };
};