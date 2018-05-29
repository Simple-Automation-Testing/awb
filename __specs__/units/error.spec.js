const {expect} = require('chai')
const {handledErrors} = require('../../lib/interfaceError')

describe('InterfaceError', () => {
  it('handledErrors INVALID_SESSION_ID', () => {
    const {err} = handledErrors(0)
    expect(err).to.eql(undefined)
  })
  it('ELEMENT_NOT_FOUND', () => {
    const {err, errorType} = handledErrors(7)
    expect(err).to.not.eql(undefined)
    expect(err).to.not.eql(null)
    const errObj = {
      sessionId: 'test sessionid',
      selector: 'test selector',
      additionalMessage: 'test message',
      parentSelector: 'test parent selector'
    }
    try {
      err(errObj)
    } catch(error) {
      expect(errorType).to.eql('ELEMENT_NOT_FOUND')
      expect(error.toString()).includes(errorType)
      expect(error.toString()).includes(errObj.additionalMessage)
      expect(error.toString()).includes(errObj.selector)
      expect(error.toString()).includes(errObj.sessionId)
      expect(error.toString()).includes(errObj.parentSelector)
    }
  })

  it('INVALID_SESSION_ID', () => {
    const {err, errorType} = handledErrors(6)
    expect(err).to.not.eql(undefined)
    expect(err).to.not.eql(null)
    const errObj = {
      sessionId: 'test sessionid',
      selector: 'test selector',
      additionalMessage: 'test message',
      parentSelector: 'test parent selector'
    }
    try {
      err(errObj)
    } catch(error) {
      expect(errorType).to.eql('INVALID_SESSION_ID')
      expect(error.toString()).includes(errorType)
      expect(error.toString()).includes(errObj.additionalMessage)
      expect(error.toString()).to.not.includes(errObj.selector)
      expect(error.toString()).includes(errObj.sessionId)
      expect(error.toString()).to.not.includes(errObj.parentSelector)
    }
  })
})