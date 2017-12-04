const { expect } = require('chai')

const client = require('../../interface/client')
const element = require('../../interface/element')

describe.only('client dirrectConnection', () => {
  let browser = null
  const baseURL = 'http://localhost:9090'

  //selectors
  const entercode = '[placeholder="Enter code"]'
  const enterpostcode = '[placeholder="Enter post code"]'
  const button = '.submit'
  const asyncform = '.asyncform.handler'
  const loader = '.loader'

  //elements
  const asyncFormHandler = element(asyncform)
  const enterCode = element(entercode)
  const enterPostCode = element(enterpostcode)
  const submitButton = element(button)
  const asyncLoade = element(loader)

  before(async () => {
    browser = client().chrome(true)
    // expect(browser.sessionId).to.eql(true)
    expect(global.__sessionId).to.eql(undefined)
    await browser.goTo(baseURL)
  })

  after(async () => {
    await browser.closeBrowser()
  })

  it('get text asyn form button', async () => {
    const buttonText = await asyncFormHandler.getText()
    expect(buttonText).to.eql('Go to async form')
  })

  it('click button and assert presents elements', async () => {
    await asyncFormHandler.click()
    {
      const isDisplayed = await enterCode.isDisplayed()
      expect(isDisplayed).to.be.true
    }
    {
      const isDisplayed = await enterPostCode.isDisplayed()
      expect(isDisplayed).to.be.true
    }
    {
      const isDisplayed = await submitButton.isDisplayed()
      expect(isDisplayed).to.be.true
    }
  })

  it('send keys to inputs and submit', async () => {
    await enterCode.sendKeys('CODE')
    await enterPostCode.sendKeys('CODE')
    await submitButton.click()
    {
      const isDisplayed = await asyncLoade.isDisplayed()
      expect(isDisplayed).to.eql(true)
    }
    //wait for element
    {
      const res = submitButton.waitForElement(2000)
    }
  })

})
