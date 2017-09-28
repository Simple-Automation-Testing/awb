const ADD_ELEMENT = 'ADD_ELEMENT';
const DELETE_ELEMENT = 'DELETE_ELEMENT';
const SORT_ELEMENTS = 'SORT_ELEMENTS';

export const addElement = (element) => ({
  type: ADD_ELEMENT,
  element
});

export const deleteElement = (id) => ({
  type: DELETE_ELEMENT,
  id
});

export const sortElements = (element, position) => ({
  type: SORT_ELEMENTS,
  element,
  position
});

const initialState = [
  {
    title: 'Init driver',
    listElement: true,
    cssSelector: null,
    id: 'initial'
  },
  {
    title: 'Button 0',
    listElement: true,
    cssSelector: null,
    id: 'button0'
  },
  {
    title: 'Button 1',
    listElement: true,
    cssSelector: null,
    id: 'button0'
  },
  {
    title: 'Button 2',
    listElement: true,
    cssSelector: null,
    id: 'button2'
  }
];

export default (state = initialState, { type, ...rest }) => {
  switch (type) {
    case ADD_ELEMENT:
      return state.slice().push(rest.element)
    case DELETE_ELEMENT:
      return state.slice().filter((element) => element.id != rest.id);
    case SORT_ELEMENTS:
      return state.slice().filter((element) => rest.element.id != element.id).splice(rest.position, 0, rest.element);
    default:
      return state
  }
};