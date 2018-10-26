const {baseNegativeWait} = require('../../lib/util')
const {expect} = require('chai')

describe('Wait conditions', () => {
  const getCondition = () => {
    let requester = 0
    return async () => {
      requester += 1
      if(requester < 5) {return {status: 0}}
      else {return {status: 1}}
    }
  }
  it('baseNegativeWait time', async () => {
    const conditionFunction = getCondition()
    const resp = await baseNegativeWait(conditionFunction, 2500, 'error')
    expect(resp).to.have.property('time')
  })

  it('baseNegativeWait error', async () => {
    const conditionFunction = getCondition()
    const resp = await baseNegativeWait(conditionFunction, 50, 'error')
    expect(resp).to.have.property('error')
  })
})