const {expect} = require('chai')

const awb = require('../../../awb')

const {element, elements, client} = awb()

const pathResolver = (name) => {
  const resolvedPath = require('path').resolve(__dirname, `../../spec_utils/${name}.html`)
  return `file://${resolvedPath}`
}

describe('client chrome', () => {
  before(async () => {
    await client.startDriver()
  })

  after(async () => {
    await client.close()
    await client.stopDriver()
  })

  it('clicker', async () => {
    const file = 'clicker'
    await client.goTo(pathResolver(file))
    const clicker = element('#test_button')
    const spanArr = elements('span')
    await clicker.click()
    expect(await spanArr.count()).to.eql(1)
    await clicker.click()
    expect(await spanArr.count()).to.eql(2)
  })

  it('input', async () => {
    const file = 'input'
    await client.goTo(pathResolver(file))
    const input = element('input')
    await input.sendKeys('test1')
    expect(await input.getAttribute('value')).to.eql('test1')
    await element('body').click()
    const spanArr = elements('span')
    expect(await spanArr.count()).to.eql(1)
  })

  it('execute script', async () => {
    const file = 'clicker'
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    await clicker.click()
    await clicker.click()

    const res = await client.executeScript(function() {
      return document.querySelectorAll('span').length
    })
    expect(res).to.eql(2)
    const res1 = await client.executeScript(`
      const text = arguments[0]
      let condition = true
      const spanArr = document.querySelectorAll('span').length
      const emptyArr = []
      emptyArr.forEach.call(spanArr, (el) =>{
        if(el.innerText !== text) {
          condition = false
        }
      })
      return condition
    `, 'test')
    expect(res1).to.eql(true)
  })

  it('appear', async () => {
    const file = 'appear'
    const clicker = element('#test_button')
    const link = element('a').waitForElement(1700)
    await client.goTo(pathResolver(file))
    await clicker.click()
    expect(await link.isDisplayed()).to.eql(true)
  })

  it('disappear', async () => {
    const file = 'disappear'
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    try {
      await clicker.waitUntilDisappear(1000)
    } catch(error) {
      expect(error.toString().includes('still present on page'))
    }
    const time = await clicker.waitUntilDisappear(5000)

    expect(time).to.not.eq(0)

    // await clicker.click()
    // expect(await link.isDisplayed()).to.eql(true)
  })
})

