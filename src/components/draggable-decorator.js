import React from 'react';
import { DragSource } from 'react-dnd';

const type = 'SCENARIO_ITEM';

const spec = {
  beginDrag(props, monitor) {
    console.log(props, monitor.getItem(), '!!!!')
    return {a: 1}
  },
  endDrag() {}
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});


export const DraggableComponent = (Component) =>
  DragSource(type, spec, collect)((props) => props.connectDragSource(<div><Component {...props} /></div>))