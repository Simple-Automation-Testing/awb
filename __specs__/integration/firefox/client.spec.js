const { expect } = require('chai')

const client = require('../../../interface/client')
const { element, elements } = require('../../../interface/element')
const { fakeServer } = require('../../util')

describe('firefox', () => {

  let browser = null

  const baseURL = 'http://localhost:9090'
  const addnewname = 'button'
  const dropzone = '.dropzone'
  const dropitem = '.dropitem'
  const firstname = '[placeholder="firstname"]'
  const dispaynonediv = '.not.displayed'
  const bottomdiv = '.bottom.div'

  const elementDropZone = element(dropzone)
  const elementInput = element(firstname)
  const elementBottomDiv = element(bottomdiv)
  const elementDisplayNoneDiv = element(dispaynonediv)

  beforeEach(async () => {
    browser = client().firefox()
    expect(browser.sessionId).to.eql(null)
    expect(global.__sessionId).to.eql(undefined)
    await browser.goTo(baseURL)
    expect(browser.sessionId).to.be.exist
    expect(browser.sessionId).to.not.null
    expect(browser.sessionId).to.not.undefined
  })

  afterEach(async () => {
    await browser.closeBrowser()
  })

  it('send case', async () => {
    const inputValue = '!#!#!@#!'
    {
      const body = await elementInput.sendKeys(inputValue)
      expect(body).to.be.exist
      // expect(body.sessionId).to.be.exist
    }
    {
      const value = await elementInput.getAttribute('value')
      //   expect(value).to.be.exist
      //   expect(value).to.eql(inputValue)
    }
  })

  it('take screenshot', async () => {
    const screenshot = await browser.takeScreenshot()
    require('fs').writeFileSync('firefox.png', new Buffer(screenshot, 'base64'))
  })

  it('get title and url', async () => {
    {
      const currentUrl = await browser.getUrl()
      expect(currentUrl).to.eql(`${baseURL}/`)
    }
  })
})