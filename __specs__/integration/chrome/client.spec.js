const { expect } = require('chai')

const client = require('../../../interface/client')
const { element, elements } = require('../../../interface/element')
const { fakeServer } = require('../../util')

describe('client chrome', () => {

  let browser = null

  const baseURL = 'http://localhost:9090'
  const addnewname = 'button'
  const dropzone = '.dropzone'
  const dropitem = '.dropitem'
  const firstname = '[placeholder="firstname"]'
  const dispaynonediv = '.not.displayed'
  const bottomdiv = '.bottom.div'
  const openframe = '.frame-open-button'
  const playbutton = '.ytp-large-play-button.ytp-button'

  const elementDropZone = element(dropzone)
  const elementInput = element(firstname)
  const elementBottomDiv = element(bottomdiv)
  const elementDisplayNoneDiv = element(dispaynonediv)
  const elementOpenFrame = element(openframe)
  const playButton = element(playbutton)

  before(async () => {
    // fakeServer.start()
    browser = client().chrome(false, {
      'request': 1000,
      // 'page load': 1
    })
    // await browser.startSelenium()
  })

  after(async () => {
    // await browser.stopSelenium()
    // fakeServer.stop()
  })

  beforeEach(async () => {

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
      expect(body.sessionId).to.be.exist
    }
    {
      const value = await elementInput.getAttribute('value')
      expect(value).to.be.exist
      expect(value).to.eql(inputValue)
    }
  })

  it('get title and url', async () => {
    {
      const currentUrl = await browser.getUrl()
      expect(currentUrl).to.eql(`${baseURL}/`)
    }
  })

  it.skip('execute async script', async () => {
    {
      const val = await browser.executeScriptAsync(
        function (callback) {
          fetch('http://localhost:8085/bar', {
            node: 'no-cors'
          }).then(resp => resp.json()).then(callback)
        })
      expect(val).to.eql({ bar: 'bar' })
    }
  })
  /*
      it('to frame', async () => {
        await elementOpenFrame.click()
        await browser.switchToFrame('#myId')
        await browser.sleep(1500)
  
        await elements(playbutton).get(0)
        // await browser.sleep(10000)
      })
  */

  
})

