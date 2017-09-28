import React from 'react';
import { DropTarget } from 'react-dnd';

const type = 'SCENARIO_ITEM';

const spec = {
  drop(props, monitor) {
    console.log(props, '<----- props', 'dropitem ------>', monitor.getItem())
    return {}
  },
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return true;
  },
  hover(props, monitor) {
    // console.log(monitor.getItem());
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});


export const DroppableComponent = (Component) =>
  DropTarget(type, spec, collect)((props) => props.connectDropTarget(<div><Component {...props} /></div>))