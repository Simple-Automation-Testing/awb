const nock = require('nock')
const initializeRequestState = require('../../lib/core/index')
const {baseRequest, baseRequestUrl} = require('./util')
const {expect} = require('chai')



describe('sendKeys', () => {

  const sendKeys = initializeRequestState(baseRequest).sendKeys

  const sessionId = 'test-session', elementId = 'test-id'

  it('request positiv', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/element/${elementId}/value`)
      .reply(200, {
        status: 0
      })

    const resp = await sendKeys(sessionId, elementId, 1)
    expect(resp.status).to.eql(0)
    nock.restore()
  })

  it('request negative', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/element/${elementId}/value`)
      .reply(400, {
        error: 'Not found'
      })

    try {
      const resp = await sendKeys(sessionId, elementId, 1)
    } catch(error) {
      expect(error).to.be.exist
      nock.restore()
    }
  })
})