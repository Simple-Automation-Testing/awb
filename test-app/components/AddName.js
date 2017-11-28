import React from "react";

export class AddName extends React.Component {
  state = {
    currentFirstName: '',
    currentLastNme: ''
  };
  onChange = (part, e) => {
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
    return (
      <div>
        <span>Enter new name :)</span>
        <input
          onChange={this.onChange.bind(this, 'first')}
          value={this.state.currentFirstName} placeholder="firstname"></input>
        <input
          onChange={this.onChange.bind(this, 'last')}
          value={this.state.currentLastNme} placeholder="lastname"></input>
        <button
          onClick={this.addName}>Add new name</button>
      </div>
    );
  };
};
