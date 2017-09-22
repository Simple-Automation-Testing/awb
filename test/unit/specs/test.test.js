// import { expect } from 'chai'
import { shallow, mount } from 'enzyme';

const ComponentA = ({ onClick }) => (<div onClick={onClick} className="a" id="a"></div>)

const ComponentB = (props) => (<div onClick={props.onClick} className="b" id="b">{props.children}</div>)


class ComponentC extends React.Component {
  componentWillMount() {
    console.log('will mount')
  }
  componentDidMount() {
    console.log('did mount')
  }
  funcMap =  (arrr) =>  {
    return arrr.map(a => a + 1)
  }
  componentWillUpdate() {
    console.log('will update')
  }
  componentDidUpdate() {
    console.log('did update')
  }
  state = { value: '0' }
  onChange = ({ target: { value } }) => {
    this.setState({ value })
  }
  render() {
    return (<span onChange={this.onChange}>{this.state.value}</span>)
  }
}

describe('ComponentA', () => {
  it('shallow', () => {
    const onClick = (e) => { console.log(e) }
    const el = shallow(<ComponentA onClick={onClick} />)
    expect(el.props()).toEql({ className: 'a', id: 'a', onClick })
  })
  it('mount', () => {
    const onClick = (e) => { console.log(e) }
    const el = mount(<ComponentA onClick={onClick} />)
    expect(el.props()).toEql({ onClick })
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

describe.only('ComponentC', () => {
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
    expect(el.instance().funcMap([1, 2])).to.eql([2, 3])
    console.log(el.instance().componentDidMount)
    expect(el.text()).to.eql('2')
  })
})
