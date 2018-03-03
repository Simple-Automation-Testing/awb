const { expect } = require('chai')

const { element, client, elements } = require('./driver')

const Google = require('./po/google.po')

describe('Google base example', () => {
  let browser = null

  const baseURL = 'https://www.google.com.ua/'

  const googlePage = new Google()

  before(async () => {
    browser = client
    await browser.startDriver()
    await browser.goTo(baseURL)
  })

  after(async () => {
    await browser.closeBrowser()
    await browser.stopDriver()
  })

  it('search git hub potapovDim', async () => {
    await googlePage.getSome()
    await googlePage.getElementRects()
    await googlePage.find('git hub potapovDim')
    expect(await googlePage.getResultSearchText()).to.includes('potapovDim')
  })
})
