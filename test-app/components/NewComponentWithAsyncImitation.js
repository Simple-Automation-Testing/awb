import React, { Component } from 'react'
import { Loader } from './Loader'

class AsyncImitationComponent extends Component {
  state = {
    asyncCallEnd: null,
    code: '',
    postCode: ''
  }

  assertEntryData = () => {
    const { code, postCode } = this.state
    code.length > 3 && postCode > 3
      ? this.setState({ dataFormCondition: 'success' })
      : this.setState({ dataFormCondition: 'warning' })
  }

  changePostCode = ({ target: { value } }) => {
    this.setState({ postCode: value })
  }

  changeCode = ({ target: { value } }) => {
    this.setState({ code: value })
  }

  clickAndAsync = () => {
    this.setState({ generateLoader: true, asyncCallEnd: true })
    setTimeout(() => {
      this.setState({ asyncCallEnd: false, generateLoader: false })
      this.assertEntryData()
    }, 3000)
  }

  render() {
    const { asyncCallEnd, generateLoader, dataFormCondition } = this.state
    const formDataStyle = () => {
      switch (dataFormCondition) {
        case 'success':
          return 'success_entered_data'
        case 'warning':
          return 'warning_entered_data'
        default:
          return null
      }
    }

    return (
      <div>
        {generateLoader && <Loader />}
        Asyn form for enter and submit data
        {!asyncCallEnd
          ? <div className={formDataStyle()}>
            <input onChange={this.changeCode} style={{ width: '130px', height: '35px', borderBottom: 'solid red' }} placeholder="Enter code" />
            <input onChange={this.changePostCode} style={{ width: '130px', height: '35px', borderBottom: 'solid red' }} placeholder="Enter post code" />
            <button onClick={this.clickAndAsync} className="submit">Submit</button>
          </div>
          : null}
      </div>
    )
  }
}

export default AsyncImitationComponent