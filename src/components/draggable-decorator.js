import React from 'react';
import { DragSource } from 'react-dnd';

const type = 'SCENARIO_ITEM';

const spec = {
  beginDrag() {
    return {}
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});


export const DraggableComponent = (Component) =>
  DragSource(type, spec, collect)((props) => props.connectDragSource(<div><Component {...props} /></div>))