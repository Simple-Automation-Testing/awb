import React from 'react';
import { Draggable } from './dragbox'


const InitialBox = (({
  component,
  index,
  connectDragSource }) => connectDragSource(<div >{index}<button onClick={() => console.log('Click')}>Click me</button></div>))


export const Box = Draggable(InitialBox)