import React from 'react'
import { expect } from 'chai'
import { shallow, mount } from 'enzyme'
import sinon from 'sinon'
const ComponentA = ({ onClick }) => <div onClick={onClick} className="a" id="a"></div>

const ComponentB = (props) => <div onClick={props.onClick} className="b" id="b">{props.children}</div>

class ComponentC extends React.Component {
  componentWillMount() {
    console.log('will mount')
  }
  componentDidMount() {
    console.log('did mount')
  }
  func = (arrr) => {
    return arrr.map(a => a + 1)
  }
  componentWillUpdate() {
    console.log('will update')
  }
  componentWillReceiveProps() {
    console.log('resive props')
  }
  componentDidUpdate() {
    console.log('did update')
  }
  componentWillUnmount() {

  }
  state = { value: '0' }
  onChange = ({ target: { value } }) => {
    this.setState({ value })
  }
  render() {
    return (<span onChange={this.onChange}>{this.state.value}</span>)
  }
}

describe('CMV', () => {
  let cwrp
  let cwm
  let cwu
  let wrap
  beforeEach(() => {
    wrap = mount(<ComponentC />)
  })
  before(() => {
    cwrp = sinon.spy(ComponentC.prototype, 'componentWillReceiveProps')
    cwm = sinon.spy(ComponentC.prototype, 'componentWillMount')
    cwu = sinon.spy(ComponentC.prototype, 'componentWillUnmount')
  })
  after(() => {
    cwrp.restore()
    cwm.restore()
    cwu.restore()
  })
  afterEach(() => {
    cwrp.reset()
    cwm.reset()
    cwu.reset()
  })
  it('a', () => {
    expect(ComponentC.prototype.componentWillMount.calledOnce).to.eql(true)
  })
  it('b', () => {
    wrap.setProps({ a: 'a' })
    expect(ComponentC.prototype.componentWillReceiveProps.calledOnce).to.eql(true) 
  })
})

describe('ComponentA', () => {
  it('shallow', () => {
    const onClick = (e) => { console.log(e) }
    const el = shallow(<ComponentA onClick={onClick} />)
    expect(el.props()).to.eql({ className: 'a', id: 'a', onClick })
  })
  it('mount', () => {
    const onClick = (e) => { console.log(e) }
    const el = mount(<ComponentA onClick={onClick} />)
    expect(el.props()).to.eql({ onClick })
  })
})

describe('ComponentB', () => {
  it('shallow', () => {
    const el = shallow(
      <ComponentB onClick={(e) => { console.log(e) }}>
        <ComponentA onClick={(e) => { console.log(e) }} />
      </ComponentB>
    )
    // expect(el.props()).to.eql({ className: 'a', id: 'a'})
    expect(el.html()).to.eql('<div class="b" id="b"><div class="a" id="a"></div></div>')
  })
  it('mount', () => {
    const el = mount(
      <ComponentB >
        <ComponentA />
      </ComponentB>
    )
    expect(el.html()).to.eql('<div class="b" id="b"><div class="a" id="a"></div></div>')
  })
})

describe('ComponentC', () => {
  it('shallow', () => {
    const el = shallow(<ComponentC />, { disableLifecycleMethods: true })
    expect(el.text()).to.eql('0')
    el.simulate('change', { target: { value: '2' } })
    expect(el.text()).to.eql('2')
    expect(el.instance().func([1, 2])).to.eql([2, 3])
  })
  it('mount', () => {
    const el = mount(<ComponentC />)
    expect(el.text()).to.eql('0')
    el.simulate('change', { target: { value: '2' } })
    expect(el.instance().func([1, 2])).to.eql([2, 3])
    expect(el.text()).to.eql('2')
  })
})
