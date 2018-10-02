const {expect} = require('chai')

const awb = require('../../awb')

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

describe('crash', () => {
  const baseUrl = 'https://www.google.com/'

  before(async () => {await client.startDriver()})
  beforeEach(async () => {await client.goTo(baseUrl)})

  after(async () => {
    await client.close()
    await client.stopDriver()
  })

  it('false url', async () => {
    await client.goTo(undefined)
    await client.goTo(null)
    await client.goTo(false)
  })


  it('wait logic chaining', async () => {
    const el = $('body')
      .waitForElement(100)
      .$('#sfdiv')
      .waitForElement(200)
    expect(await el.getAttribute('id')).to.eql('sfdiv')
  })

  it('$$', async () => {
    const els = $('body').waitForElement(1000).$$('div')
    expect(await els.count()).to.not.eql(0)
    expect(await els.count()).to.not.eql(null)
    expect(await els.count()).to.not.eql(undefined)

    const elsElements = element('body').waitForElement(1000).elements('div')
    expect(await elsElements.count()).to.not.eql(0)
    expect(await elsElements.count()).to.not.eql(null)
    expect(await elsElements.count()).to.not.eql(undefined)
  })

  it('chaining', async () => {

    const link = $$('a').waitForElements(3500)

    await link.get(10).getTag()

    expect(await link.count()).to.not.eql(0)
    expect(await link.count()).to.not.eql(null)
    expect(await link.count()).to.not.eql(undefined)


    const linkElements = elements('a').waitForElements(2500)

    await linkElements.get(10).getTag()

    expect(await linkElements.count()).to.not.eql(0)
    expect(await linkElements.count()).to.not.eql(null)
    expect(await linkElements.count()).to.not.eql(undefined)
  })
})
