import * as React from 'react';
import { DragSource, DropTarget } from 'react-dnd';

const dragSource: any = {
  beginDrag: function (props: any, monitor: any): any {
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

function collect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
};


export const Draggable = (Component: any) => DragSource('BOX', dragSource, collect)(Component)