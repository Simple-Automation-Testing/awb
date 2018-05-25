const {expect} = require('chai')
const fs = require('fs')
const rimraf = require('rimraf');


const awb = require('../../../awb')
const conf = {
  remote: false,
  directConnect: true,
  desiredCapabilities: {
    javascriptEnabled: true,
    acceptSslCerts: true,
    platform: 'ANY',
    browserName: 'chrome',
    chromeOptions: {args: ['--headless']}
  },
  // host: 'localhost',
  // port: 4444,
  timeout: 25000
}

const {element, elements, $, $$, client} = awb(conf)

const pathResolver = (name) => {
  const resolvedPath = require('path').resolve(__dirname, `../../spec_utils/${name}.html`)
  return `file://${resolvedPath}`
}

function rmdirRecursively(path) {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      err && reject(err)
      resolve()
    })
  })
}

describe('client chrome', () => {
  before(async () => {
    await client.startDriver()
  })

  after(async () => {
    await client.close()
    await client.stopDriver()
  })

  it('waitForTitleInclude', async () => {
    const file = 'titleUrl'
    await client.goTo(pathResolver(file))
    await client.waitForTitleInclude('Changed', 5000)
    expect(await client.getTitle()).to.eql('Changed')
  })

  it('waitForUrlIncludes', async () => {
    const file = 'titleUrl'
    await client.goTo(pathResolver(file))
    await client.waitForUrlIncludes('#changed', 5000)
    expect(await client.getUrl()).to.includes('#changed')
  })

  it('back forward', async () => {
    await client.goTo('https://www.google.com/')
    expect(await client.getUrl()).to.includes('google.com')
    await client.goTo('https://www.linkedin.com/')
    expect(await client.getUrl()).to.includes('linkedin.com/')
    await client.back()
    expect(await client.getUrl()).to.includes('google.com')
    await client.forward()
    expect(await client.getUrl()).to.includes('linkedin.com/')
  })

  it('waitTextContains', async () => {
    const file = 'waitTextContains'
    await client.goTo(pathResolver(file))
    const button = $('button').waitTextContains('CHANGED', 2500)
    expect(await button.getText()).to.eql('CHANGED')
  })

  it('stale reference one element', async () => {
    const file = 'appear'
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    expect(await clicker.isDisplayed()).to.eql(true)
    await client.refresh()
    expect(await clicker.isDisplayed()).to.eql(true)
  })

  it('stale reference with parent', async () => {
    const file = 'appear'
    const clicker = $('body').$('#test_button')
    await client.goTo(pathResolver(file))
    expect(await clicker.isDisplayed()).to.eql(true)
    await client.refresh()
    expect(await clicker.isDisplayed()).to.eql(true)
  })

  it('count', async () => {
    const file = 'appear'
    const clicker = element('#test_button')
    let link = $$('a')
    await client.goTo(pathResolver(file))
    expect(await link.count()).to.eql(0)
    await clicker.click()
    link = $$('a').waitForElements(2500)
    expect(await link.count()).to.eql(1)
  })

  it('chaining', async () => {
    const file = 'appear'
    const clicker = element('#test_button')
    const link = $$('a').waitForElements(3500).get(0)
    await client.goTo(pathResolver(file))
    await clicker.click()
    expect(await link.getElementHTML()).to.eql('<a>test link</a>')
  })

  it('range', async () => {
    const file = 'range'
    const range = $('#range')
    const span = $('span')
    await client.goTo(pathResolver(file))
    await range.mouseDownAndMove({x: -10, y: 15})
    expect(await span.isDisplayed()).to.eql(true)
  })

  it('tabs', async () => {
    const file = 'tabs'
    const link = $('a').waitForClickable(1000)
    const googleInput = $('#lst-ib').waitForElementPresent(5000)
    await client.goTo(pathResolver(file))
    await link.click()
    await client.switchToTab(1)
    expect(await googleInput.isDisplayed()).to.eql(true)
  })

  it('getRect', async () => {
    const file = 'tabs'
    const link = $('a').waitForClickable(1000)
    const googleInput = $('#lst-ib').waitForElementPresent(5000)
    await client.goTo(pathResolver(file))
    expect(await link.getRect()).to.eql(
      '<a href="https://www.google.com.ua" target="_blank">Go to goole</a>'
    )
  })

  it('getElementHTML', async () => {
    const file = 'tabs'
    const link = $('a').waitForClickable(1000)
    const googleInput = $('#lst-ib').waitForElementPresent(5000)
    await client.goTo(pathResolver(file))
    expect(await link.getElementHTML()).to.eql({
    })
  })

  it('switch back', async () => {
    const file = 'iframe'
    const buttonYoutube = $('figure').waitForElement(1500)
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    await client.switchToFrame(element('iframe'))

    expect(await buttonYoutube.isPresent()).to.eql(true)
    expect(await clicker.isDisplayed()).to.eql(false)
    await client.switchBack()

    expect(await clicker.isDisplayed()).to.eql(true)
  })

  it('click', async () => {
    const file = 'click'
    const link = element('a[href="https://google.com"]')
    const clicker = element('#test_button').waitForClickable(3000)
    await client.goTo(pathResolver(file))
    await clicker.click()
    expect(await link.getAttribute('href')).to.eql('https://google.com/')
  })

  it('allert', async () => {
    const file = 'alert'
    await client.goTo(pathResolver(file))
    const clicker = element('#test_button')
    await clicker.click()
    expect(await client.alert.getText()).to.eql('Hello')
    await client.alert.accept()
  })

  it('tagname', async () => {
    const file = 'click'
    const clicker = element('#test_button').waitForClickable(3000)
    await client.goTo(pathResolver(file))
    expect(await clicker.getTag()).to.eql('button')
  })

  it('rightClick', async () => {
    const file = 'rightClick'
    const clicker = element('#test_button').waitForClickable(3000)
    const spans = $$('span')
    await client.goTo(pathResolver(file))

    await clicker.rightClick()

    await client.sleep(10000)

    expect(await spans.count()).to.eql(1)
  })

  it('prompt', async () => {
    const file = 'prompt'
    const button = element('button').waitForClickable(1000)
    const text = element('#prompt_try')
    const prompt = client.alert

    await client.goTo(pathResolver(file))
    await button.click()
    await prompt.sendKeys('TEST')
    await prompt.accept()
    expect(await text.getText()).to.includes('TEST')

    await button.click()
    await prompt.accept()
    expect(await text.getText()).to.includes('AWB')
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
  })

  it('wait cb', async () => {
    const file = 'wait'
    const clicker = element('#test_button')
      .wait(1000, async (el) => await el.isDisplayed() === true)
      .wait(3500, async (el) => await el.getText() === 'Button test')
    await client.goTo(pathResolver(file))
    await clicker.click()
  })

  it('appear elements', async () => {
    const file = 'appearArr'
    const links = elements('a').waitForElements(15000)
    await client.goTo(pathResolver(file))
    expect(await links.count()).to.not.eq(0)
  })

  it('wait arr cb ', async () => {
    const file = 'appearArr'
    const link = elements('a').wait(15000, async (els) => await els.count() > 7).get(3)
    await client.goTo(pathResolver(file))
    expect(await link.getText()).to.eq('Super link')
  })

  it('disappear arr', async () => {
    const file = 'desappearArr'
    const links = elements('a')
    await client.goTo(pathResolver(file))
    await links.waitUntilDisappear(10000)
  })

  it('disappear arr negative', async () => {
    const file = 'desappearArr'
    const links = elements('a')
    await client.goTo(pathResolver(file))
    await links.waitUntilDisappear(1000)
  })

  it('iframe', async () => {
    const file = 'iframe'
    const figure = $('figure').waitForElement(1500)
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    await client.switchToFrame(element('#youtube'))

    expect(await figure.isDisplayed()).to.eql(true)
    expect(await clicker.isDisplayed()).to.eql(false)
  })

  it('switch', async () => {
    const file = 'iframe'
    const figure = $('figure')
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    await client.switchToFrame(element('#youtube'))
    expect(await figure.isDisplayed()).to.eql(true)
    expect(await clicker.isDisplayed()).to.eql(false)
    await client.switchBack()
    expect(await clicker.isDisplayed()).to.eql(true)
  })

  it('localstorage', async () => {
    const file = 'localstorage'
    const clicker = element('#test_button')
    await client.goTo(pathResolver(file))
    await clicker.click()
    const localStorage = client.localStorage

    expect(await localStorage.getAll()).to.eql({
      test: '{"first":1,"second":2}'
    })

    expect(await localStorage.get('test')).to.eql(
      '{"first":1,"second":2}'
    )

    await localStorage.set('testy', JSON.stringify({first: 1, second: 2}))

    expect(await localStorage.getAll()).to.eql({
      test: '{"first":1,"second":2}',
      testy: JSON.stringify({first: 1, second: 2})
    })

    await localStorage.clear()
    expect(await localStorage.getAll()).to.eql({})
  })

  it('execute async script', async () => {
    const file = 'appear'
    const clicker = $('button')
    await client.goTo(pathResolver(file))
    await clicker.click()
    const resp = await client.executeScriptAsync(function(cb) {
      cb('test')
    })
    expect(resp).to.eql('test')
  })

  it('subelements', async () => {
    const file = 'subelement'
    const clicker = element('#test_button')
    const link = elements('a').wait(1200, async (el) => await el.count() === 8).get(3)
    await client.goTo(pathResolver(file))
    await clicker.click()
    expect(await link.getText()).to.eql('link 5')
  })

  it('switchToTab', async () => {
    const file = 'subelement'
    const file1 = 'appear'
    const file2 = 'localstorage'

    await client.closeCurrentTab()
    await client.switchToTab(0)

    await client.goTo(pathResolver(file))

    expect(await client.getTitle()).to.eql('Elements')

    await client.executeScript(`window.open('${pathResolver(file1)}')`)
    await client.switchToTab(1)
    expect(await client.getTitle()).to.eql('Appear file')

    await client.executeScript(`window.open('${pathResolver(file2)}')`)

    await client.switchToTab(2)

    expect(await client.getTitle()).to.eql('Localstorage')
    await client.closeCurrentTab()

    await client.switchToTab(1)

    expect(await client.getTitle()).to.eql('Appear file')
  })

  it('some', async () => {
    const file = 'some'
    const spans = $$('span')

    await client.goTo(pathResolver(file))

    const result = await spans.some(async (el) => {
      return (await el.getText()).includes('Test')
    })
    expect(result).to.be.true

    const resultNext = await spans.some(async (el) => {
      return (await el.getText()).includes('Zorrro')
    })
    expect(resultNext).to.be.false
  })

  it('every', async () => {
    const file = 'some'
    const spans = $$('span')

    await client.goTo(pathResolver(file))

    const result = await spans.every(async (el) => {
      return (await el.getText()).includes('Test')
    })
    expect(result).to.be.true

    const resultNext = await spans.every(async (el) => {
      return (await el.getText()).includes('1')
    })
    expect(resultNext).to.be.false
  })

  it('map', async () => {
    const file = 'some'
    const spans = $$('span')

    await client.goTo(pathResolver(file))

    const result = await spans.map(async (el) => {
      return await el.getText()
    })

    expect(result.every(val => val.includes('Test'))).to.be.true
  })

  it('forEach', async () => {
    const file = 'some'
    const spans = $$('span')

    await client.goTo(pathResolver(file))

    const result = await spans.forEach(async (el) => {
      expect((await el.getText()).includes('Test')).to.eql(true)
    })
  })

  it('doubleClick', async () => {
    const file = 'doubleClick'
    const button = $('button')
    const links = $$('a')

    await client.goTo(pathResolver(file))
    await button.doubleClick()
    expect(await links.count()).to.eql(1)
  })

  describe('saveScreenshot', () => {
    const defaultPath = `${process.cwd()}/screenshots`
    const customNestedPath = `${defaultPath}/1/2/3/4`
    const screenshotName = 'defaultName'
    const fullScreenshotName = screenshotName + '.png'
    const customFormat = 'jpeg'
    const screenshot = 'iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAG5SURBVDhPxVRNT8JAEJ1ttyIB+YgQPZCoifGPeTMm3jx6NvHo0cS/ZiTxAAislmgo7a4z0xZaaIvUg2+z2Xbf7tuPeTtCKWUAYYFNDUNDEH2F2JVjUa0DUP4IpJAQGB8aThdsEQ4uw4lP5Zqx9waPL9fY2YHZYgKXJ/fQq16AMQbKcBataAsHmkg05SG2XZCWwzshlOFYlLbu4kquP+XW1wsmCWU4vtPABDCcv/LKgVlAp9IDR1SQNvi/O7eMvo2XHYMG06QYu3JL0RgGi802EWEHgo4phCjkkkiJ0iSJRS2GoI3muQKvvb13xPdF1snjksJpUbRJw2mhTW7YLjStbrfg9vwJxabItXM4lRLl6K+jJpvQIJtgrctW1BuiiIuRKYq3kI8iLkK26B/xj6IYAwsjb1HEV/HIxVZRNARMvHdQ3gDG8xFnJl6lAJmWeu7foU0G/Fo0vW8fLYOFfFzDiJNfNb6eqn0AV6cPv7NUciN0bMpAlN44E+H/NmSKfvsuzDDzrOokUVf9X/5HNCONjeNLaw8G8z6+aY+PnAeaZGE53j/DZ4pj854pgYTpLteTRBZo7GZCAfgBGWVS+xMK5noAAAAASUVORK5CYII='
    before(async () => {
      await rmdirRecursively(defaultPath)
    })
    after(async () => {
      await rmdirRecursively(defaultPath)
    })

    it(`throws if name is not passed`, async () => {
      await rmdirRecursively(defaultPath)
      try {
        await client.saveScreenshot()
        expect(true).to.eql(false, `method did not throw exception`)
      } catch(err) {
        expect(err.message)
          .to.includes('Name is obligatory to save screenshot',
            `Error message is not as expected: "${err.message}"`)
      } finally {
        expect(fs.existsSync(defaultPath))
          .to.eql(false, `Screenshot directory was created`)
      }
    })

    it(`default parameters`, async () => {
      await client.saveScreenshot(screenshotName, {screenshot})
      expect(fs.existsSync(`${defaultPath}/${fullScreenshotName}`))
        .to.eql(true, `Screenshot was not saved to default folder`)
    })

    it(`custom path`, async () => {
      await client.saveScreenshot(screenshotName, {screenshot, path: customNestedPath})
      expect(fs.existsSync(`${customNestedPath}/${fullScreenshotName}`))
        .to.eql(true, `Screenshot was not saved to custom folder`)
    })

    it(`custom format`, async () => {
      await client.saveScreenshot(screenshotName, {screenshot, format: customFormat})
      expect(fs.existsSync(`${defaultPath}/${screenshotName}.${customFormat}`))
        .to.eql(true, `Screenshot was not saved with custom format`)
    })

  })

})
