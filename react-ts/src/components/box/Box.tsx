import * as React from 'react';
import { style } from 'typestyle';
import { Draggable } from './dragbox'


const InitialBox = (({
  component,
  index,
  connectDragSource }: any) => connectDragSource(<div className={style({
    background: component, width: 100, height: 50, border: '2px solid yellow'
  })}>{index}<button className={style({marginTop: 30})} onClick={() => console.log('Click')}>Click me</button></div>))


export const Box = Draggable(InitialBox)