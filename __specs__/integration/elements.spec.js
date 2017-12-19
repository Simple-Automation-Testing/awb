const { expect } = require('chai')

const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl } = require('../../interface/core')

const { elements, element } = require('../../interface/element')
// const Elements = elements.elementsInstance

describe('Elements', () => {
  //parts
  let sessionId = null
  //selectors
  const dropitem = '.dropitem'

  //elements
  const elementDropItems = elements(dropitem)

  before(async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
    await goToUrl(sessionId, 'http://localhost:9090')
    global.___sessionId = sessionId
  })

  after(async () => {
    await killSession(sessionId)
  })

  it('element getElementHTML', async () => {
    await elementDropItems.forEach(async (element) => {
      expect(await element.getText()).to.contains('Click me')
    })
  })
})