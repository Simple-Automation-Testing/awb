import React from "react"
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import ReactSlider from 'react-slider'
import DropZone from './DropZone'
import DragItem from './DragItem'
import { Name } from './Name'
import { AddName } from './AddName'

import AsyncImitationComponent from './NewComponentWithAsyncImitation'
import NewTabComponent from './NewTabComponent'

class Names extends React.Component {
    state = {
        sortOption: 'First name',
        keyPressValue: null,
        showNewComponent: false
    }

    componentWillMount() {
        this.setState({ url: document.URL })
    }

    changeSelectedOption = (ev) => {
        this.setState({
            sortOption: ev.target.value
        })
    }

    changeSort = () => {
        const { sortNames } = this.props
        const { sortOption } = this.state
        sortNames(sortOption)
    }

    changeKeyInput = (event) => {

    }

    goToLink = () => {
        this.setState({ url: document.URL })
    }

    pressKeyDown = ({ keyCode, key, target: { value } }) => {
        if (keyCode === 13 && key === "Enter") {
            this.setState({ keyPressValue: value })
        }
    }

    render() {
        const { names: { names }, addName, removeName, addItem } = this.props
        const { keyPressValue, showNewComponent, url } = this.state

        return (
            <div>{!url.includes('new-tab') ? < div > <button className="asyncform handler"
                onClick={() => this.setState({ showNewComponent: !showNewComponent })}>Go to async form</button>
                {!showNewComponent
                    ? <div> {keyPressValue && <div className="apear disapear" style={{ border: '10px', borderColor: 'red', borderStyle: 'solid' }}>{keyPressValue}</div>}
                        <input
                            placeholder="KEY ENTER"
                            style={{ width: '100px', height: '50px' }}
                            onChange={this.changeKeyInput}
                            onKeyDown={this.pressKeyDown} />
                        <div >
                            <h1 >Names list, names count is {names.length}</h1>
                            <AddName addName={addName} />
                            <DropZone {...this.props} />
                            <DragItem addItem={addItem} />
                        </div>
                        <div >
                            <div ></div>

                            {names.length > 0 && <div>Names list
                        <button onClick={this.changeSort}>Sort Names</button>
                                Sort by
                        <select onChange={this.changeSelectedOption}>
                                    <option >First name</option>
                                    <option >Last name</option>
                                </select>
                            </div>}
                            {names.length > 0 && names.map((name, index) => {
                                return <Name key={index} name={name} removeName={removeName} />
                            })}
                            <div className="horizontal-slider bar bar-1">
                                <ReactSlider withBars>
                                    <div className="my-handle">1</div>
                                    <div className="my-handle">2</div>
                                    <div className="my-handle">3</div>
                                </ReactSlider>
                            </div>
                        </div>
                        <div>Open new tab component
                        <a href="/new-tab" target="_blank" className="new tab open">GO!!!!!</a>
                        </div>
                        <div style={{ display: 'none' }} className="not displayed div">NOT DISPLAYED ELEMENT</div>
                        <div style={{ marginTop: '2000px' }} className="bottom div">BOTTOM ELEMENT</div>
                    </div>
                    : <AsyncImitationComponent />}
            </div> : <NewTabComponent />
            } </div>
        )
    }
}

export default DragDropContext(HTML5Backend)(Names)