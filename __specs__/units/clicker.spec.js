const { expect } = require('chai')

const { resizeWindow, initSession, killSession, findElements, findElement, goToUrl, getUrl, executeScript, sleep } = require('../../interface/core')

const {
  element, elementInstance: Element,
  elements, elementsInstance: Elements
} = require('../../interface/element')


describe('Element', () => {

  let clicker = 'file:///Users/potapopweblium/Documents/interface-webdriver/__specs__/clicker.html'
  before(async () => {
    const body = await initSession()
    expect(body.status).to.eql(0)
    expect(body.sessionId).to.be.exist
    sessionId = body.sessionId
    global.___sessionId = sessionId
    await goToUrl(sessionId, clicker)
  })

  after(async () => {
    // await killSession(sessionId)
  })

  it('element by xpath', async () => {
    await executeScript(global.___sessionId, "console.log('click')")
    const a = await executeScript(global.___sessionId, "monitorEvents(document, 'click')")
    await executeScript(global.___sessionId, "console.log('click')")
    await sleep(5000)
    const clickBut = element('#test_button')
    await clickBut.click()
    await clickBut.click()
    await clickBut.click()
    expect(await elements('span').count()).to.eql(3)
  })
})