import Names from './Names';
import * as actionsName from '../reducers/names/actions';
import * as actionsItem from '../reducers/items/actions';
import { StoreState } from '../reducers/names/constans';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({ names, items }: any) {
  return {
    names,
    items
  };
};

export function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    addName: (name: string) => dispatch(actionsName.addNewName(name)),
    removeName: (name: string) => dispatch(actionsName.removeName(name)),
    sortNames: (directive: string) => dispatch(actionsName.sortNames(directive)),
    addItem: (item: any) => dispatch(actionsItem.addNewItem(item))
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Names);