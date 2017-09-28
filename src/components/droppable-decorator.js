import React from 'react';
import { DropTarget } from 'react-dnd';

const type = 'SCENARIO_ITEM';

const spec = {
  drop({sortElements, position, ...rest}, monitor) {
    sortElements(monitor.getItem(), position);
  },
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return true;
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});


export const DroppableComponent = (Component) =>
  DropTarget(type, spec, collect)((props) => props.connectDropTarget(<div><Component {...props} /></div>))