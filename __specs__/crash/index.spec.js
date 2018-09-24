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
    const el = $('body').$('#sfdiv').waitForEement(100)
    expect(await el.getTag()).to.eql('input')
    // expect(await el.getAttribute('id')).to.eql('lst-ib')
  })
})
