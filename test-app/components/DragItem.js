import React from 'react';
import { DragSource } from 'react-dnd';

const TYPE = 'item';

const dragdSource = {
  beginDrag: function (props, monitor, component) {
    return { component: component.state.component };
  },

  isDragging: function (props, monitor) {
    return monitor.getItem().id === props.id;
  },

  endDrag: function (props, monitor, component) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DragItem extends React.Component {
  state = {
    component: 'red'
  }
  render() {
    const { connectDragSource, addItem } = this.props;
    return connectDragSource(<div onClick={() => addItem(this.state)}></div>)
  }
};

export default DragSource(TYPE, dragdSource, collect)(DragItem);