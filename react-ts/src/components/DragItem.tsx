import * as React from 'react';
import { DragSource } from 'react-dnd';
import { style } from 'typestyle';

const TYPE = 'item';
type TYPE = typeof TYPE;


const dragdSource = {
  beginDrag: function (props: any, monitor: any, component: any) {
    return { component: component.state.component };
  },

  isDragging: function (props: any, monitor: any) {
    return monitor.getItem().id === props.id;
  },

  endDrag: function (props: any, monitor: any, component: any) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
  }
};

function collect(connect: any, monitor: any) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DragItem extends React.Component<any, any> {
  state = {
    component: 'red'
  }
  render() {
    const { connectDragSource, addItem } = this.props;
    return connectDragSource(<div className={style({
      background: 'red',
      width: 20,
      height: 20
    })} onClick={() => addItem(this.state)}></div>)
  }
};

export default DragSource(TYPE, dragdSource, collect)(DragItem);