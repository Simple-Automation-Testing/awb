import Names from './Names'
import * as actionsName from '../reducers/names/actions'
import * as actionsItem from '../reducers/items/actions'
import { connect } from 'react-redux'

export function mapStateToProps({ names, items }) {
  return {
    names,
    items
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    addName: (name) => dispatch(actionsName.addNewName(name)),
    removeName: (name) => dispatch(actionsName.removeName(name)),
    sortNames: (directive) => dispatch(actionsName.sortNames(directive)),
    addItem: (item) => dispatch(actionsItem.addNewItem(item))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Names)