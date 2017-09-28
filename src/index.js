import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import ReactDom from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { v4 as uuid } from 'uuid'
import { DraggableComponent } from './components/draggable-decorator';
import { DroppableComponent } from './components/droppable-decorator';

import store from './reducers/rootReducer'

import { ScenarioComponent as Element } from './components/scenario-component';

const ScenarioComponent = DroppableComponent(DraggableComponent(Element));

const componentsList = [
  {
    title: 'Button (Click element)',
    id: uuid(),
    listElement: true
  },
  {
    title: 'Input',
    id: uuid(),
    listElement: true
  }
];

class Page extends Component {
  componentDidMount() {

  };
  render() {
    const { elements } = this.props;
    console.log(elements);
    return (
      <div className="work__area">
        <div className="scenario__area">{
          elements.map((element, index) => <ScenarioComponent key={index} {...element} position={index}/>)
        }</div>
        <div className="scenario__components__area">{
          componentsList.map((element, index) => <ScenarioComponent key={index} {...element} />)
        }</div>
      </div>
    );
  };
};


const mapStateToProps = ({ elements }) => ({
  elements
});

const mapDispatchToProps = (dispatch) => ({
  addName: (name) => dispatch(actionsName.addNewName(name)),
  removeName: (name) => dispatch(actionsName.removeName(name)),
  sortNames: (directive) => dispatch(actionsName.sortNames(directive)),
  addItem: (item) => dispatch(actionsItem.addNewItem(item))
});

const Main = DragDropContext(HTML5Backend)(connect(mapStateToProps)(Page))

ReactDom.render(
  <Provider store={store}>
    <Main />
  </Provider>
  , document.getElementById('app'));