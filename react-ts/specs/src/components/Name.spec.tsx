import * as React from "react"
import { mount } from 'enzyme'
import { expect } from 'chai'
import { Name } from '../../../src/components/Name'

describe('Name component', () => {
  it('render component and assert', () => {
    const args: Array<string>  = []
    const props: any = {
      name: 'testName',
      removeName: (name: string) => args.push(name)
    }
    const wrapper = mount(<Name {...props} />)
    expect(wrapper.text().indexOf(props.name) >= 0).to.eql(true)
    wrapper.find('button').simulate('click')
    expect(args.length).to.eql(1)
    expect(args[0]).to.eql(props.name)
    wrapper.unmount()
  })
})