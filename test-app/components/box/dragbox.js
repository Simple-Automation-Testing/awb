import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const dragSource = {
  beginDrag: function (props, monitor ) {
    console.log('begin drag box')
    return {}
  },
  isDragging: function () {
    console.log('dragging')
  },
  canDrag: function () {
    console.log('candrag true')
    return true
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};


export const Draggable = (Component) => DragSource('BOX', dragSource, collect)(Component)