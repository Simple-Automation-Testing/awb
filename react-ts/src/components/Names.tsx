import * as React from "react";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import DropZone from './DropZone'
import DragItem from './DragItem'
import { Name } from './Name'
import { AddName } from './AddName'
import { style } from 'typestyle';

export interface HelloProps {
    names: string[];
    addName?: (name: string) => any;
    removeName?: (name: string) => any;
    sortNames?: () => any;
};

class Names extends React.Component<any, any> {
    state = {
        sortOption: 'First name'
    };
    changeSelectedOption = (ev: any) => {
        this.setState({
            sortOption: ev.target.value
        });
    };
    changeSort = () => {
        const { sortNames } = this.props;
        const { sortOption } = this.state;
        sortNames(sortOption)
    }
    render() {
        const buttonStyle = style({
            color: 'red', ['&:active']: {
                borderLeft: '10px solid red',
                borderRight: '10px solid red',
                color: 'green'
            }
        });
        const { names: { names }, addName, removeName, addItem } = this.props;
        return (
            <div className={style({ display: 'flex' })}>
                <div className={style({ flex: 1 })}>
                    <h1 >Names list, names count is {names.length}</h1>
                    <AddName addName={addName} />
                    <DropZone {...this.props} />
                    <DragItem addItem={addItem} />
                </div>
                <div className={style({ flex: 1 })}>
                    <div className={style({ marginTop: 80 })}></div>

                    {names.length > 0 && <div>Names list
                        <button className={buttonStyle} onClick={this.changeSort}>Sort Names</button>
                        Sort by
                        <select onChange={this.changeSelectedOption}>
                            <option >First name</option>
                            <option >Last name</option>
                        </select>
                    </div>}
                    {names.length > 0 && names.map((name: string, index: number) => {
                        return <Name key={index} name={name} removeName={removeName} />
                    })}
                </div>
            </div>
        );
    };
};

export default DragDropContext(HTML5Backend)(Names)