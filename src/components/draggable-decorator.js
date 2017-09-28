import React from 'react';
import { DragSource } from 'react-dnd';

const type = 'SCENARIO_ITEM';

const spec = {
  beginDrag(props, monitor) {
    const dragDataItem = {
      title: props.title,
      listElement: props.listElement,
      cssSelector: props.cssSelector,
      id: props.id
    }
    return dragDataItem;
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});


export const DraggableComponent = (Component) =>
  DragSource(type, spec, collect)((props) => props.connectDragSource(<div><Component {...props} /></div>))