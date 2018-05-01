const nock = require('nock')
const initializeRequestState = require('../../lib/core/index')
const {baseRequest, baseRequestUrl} = require('./util')
const {expect} = require('chai')



describe('buttonUp', () => {

  const buttonUp = initializeRequestState(baseRequest).buttonUp

  const sessionId = 'test-session'

  it('request positiv', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/buttonup`)
      .reply(200, {
        status: 0
      })

    const resp = await buttonUp(sessionId)
    console.log(resp)
    expect(resp.status).to.eql(0)

    nock.restore()
  })

  it('request negative', async () => {
    // stub
    stub = nock(baseRequestUrl)
      .post(`/session/${sessionId}/buttonup`)
      .reply(400, {
        error: 'Not found'

      })


    try {
      const resp = await buttonUp(sessionId)
    } catch(error) {
      expect(error).to.be.exist
      nock.restore()
    }
  })
})