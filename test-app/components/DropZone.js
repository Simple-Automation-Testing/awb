import React from "react"
import { DropTarget } from 'react-dnd'
import { Box } from './box/Box'

const TYPE = 'item';

const dropZone = {
  hover() {
  },
  canDrop(props, monitor) {
    const item = monitor.getItem();
    return true
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const { addItem } = props;
    addItem(item)
    return { moved: true };
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
});


class DropZone extends React.Component {

  render() {
    const { connectDropTarget, items: { items } } = this.props;
    return <div>{
      connectDropTarget(<div >

      </div>)}
      <div >
        <div className="dropzone">
          {items.length > 0 && items.map((item, index) => <Box key={index} index={index} {...item} />)}
        </div>
      </div>
    </div>
  }
}

export default DropTarget(TYPE, dropZone, collect)(DropZone)