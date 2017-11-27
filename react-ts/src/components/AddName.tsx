import * as React from "react";
import { style } from 'typestyle';

export class AddName extends React.Component<any, any> {
  state = {
    currentFirstName: '',
    currentLastNme: ''
  };
  onChange = (part: string, e: any) => {
    part == 'first' ? this.setState({ currentFirstName: e.target.value }) : this.setState({ currentLastNme: e.target.value });
  };
  addName = () => {
    const { addName } = this.props;
    const { currentFirstName, currentLastNme } = this.state;
    currentFirstName != '' && currentLastNme != '' &&
      currentFirstName.length != 0 &&
      currentLastNme.length <= 25 &&
      addName && addName(`${currentFirstName} ${currentLastNme}`);
    this.setState({ currentFirstName: '', currentLastNme: '' });
  };
  render() {
    const inputStyle = style({
      color: 'red', [`&:focus`]: {
        borderBottom: '10px solid red',
        color: 'green'
      }
    });
    const buttonStyle = style({
      color: 'red', [`&:active`]: {
        borderBottom: '10px solid red',
        color: 'green'
      }
    });
    return (
      <div>
        <span>Enter new name :)</span>
        <input 
          className={inputStyle}
          onChange={this.onChange.bind(this, 'first')}
          value={this.state.currentFirstName} placeholder="firstname"></input>
        <input 
          className={inputStyle}
          onChange={this.onChange.bind(this, 'last')}
          value={this.state.currentLastNme} placeholder="lastname"></input>
        <button className={buttonStyle} onClick={this.addName}>Add new name</button>
      </div>
    );
  };
};
