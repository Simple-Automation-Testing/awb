const nock = require('nock')
const initializeRequestState = require('../../lib/core/index')
const {baseRequest, baseRequestUrl} = require('./util')
const {expect} = require('chai')



describe('alertAccept', () => {

  const alertAccept = initializeRequestState(baseRequest).alertAccept

  const sessionId = 'test-session'

  it('request positiv', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/alert/accept`)
      .reply(200, {
        status: 0
      })

    const resp = await alertAccept(sessionId)
    expect(resp.status).to.eql(0)
    nock.restore()
  })

  it('request negative', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/alert/accept`)
      .reply(400, {
        error: 'Not found'
      })

    try {
      const resp = await alertAccept(sessionId, elementId, 1)
    } catch(error) {
      expect(error).to.be.exist
      nock.restore()
    }
  })
})