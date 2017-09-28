const ADD_ELEMENT = 'ADD_ELEMENT';
const DELETE_ELEMENT = 'DELETE_ELEMENT';
const SORT_ELEMENT = 'SORT_ELEMENT';


const initialState = [
  {
    title: 'Init driver',
    listElement: true,
    cssSelector: null,
    id: 'initial'
  }
];

export default (state = initialState, { type, ...rest }) => {
  switch (type) {
    case ADD_ELEMENT:
      return state.slice().push(rest.element)
    case DELETE_ELEMENT:
      return state.slice().filter((element) => rest.element.id != element.id);
    case SORT_ELEMENT:
      return state.slice().filter((element) => rest.element.id != element.id).splice(rest.position, 0, rest.element);
    default:
      return state
  }
};