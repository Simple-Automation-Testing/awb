import * as React from "react";
import { style } from 'typestyle';
import { DropTarget } from 'react-dnd';
import { Box } from './box/Box'

const TYPE = 'item';
type TYPE = typeof TYPE;

const dropZone: any = {
  hover() {
  },
  canDrop(props: any, monitor: any) {
    const item = monitor.getItem();
    return true
  },
  drop(props: any, monitor: any, component: any) {
    const item = monitor.getItem();
    const { addItem } = props;
    addItem(item)
    return { moved: true };
  }
};

const collect = (connect: any, monitor: any) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
});


class DropZone extends React.Component<any, any> {

  render() {
    const { connectDropTarget, items: { items } } = this.props;
    return <div>{
      connectDropTarget(<div className={style({
        background: 'rgba(100, 90, 1, 0.3)',
        width: '300px',
        minHeight: '30px'
      })}>

      </div>)}
      <div className={style({
        display: 'flex'
      })}>
        <div className={style({
          flex: 1
        })}>
          {items.length > 0 && items.map((item: any, index: number) => <Box key={index} index={index} {...item} />)}
        </div>
      </div>
    </div>
  }
}

export default DropTarget(TYPE, dropZone, collect)(DropZone)