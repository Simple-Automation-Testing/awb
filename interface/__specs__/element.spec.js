// const { expect } = require('chai')

// const {
//   resizeWindow,
//   initSession,
//   killSession,
//   findElements,
//   findElement,
//   goToUrl,
//   getUrl,
//   getTitle,
//   clickElement,
//   sendKeys,
//   getAttribute,
//   executeScript,
//   syncWithDOM
// } = require('../core')

// const Element = require('../element')

// describe('Element', () => {
//   let sessionId = null
//   let element = null
//   const addnewname = 'button'
//   before(async () => {
//     const body = await initSession()
//     expect(body.status).to.eql(0)
//     expect(body.sessionId).to.be.exist
//     sessionId = body.sessionId
//     await goToUrl(sessionId, 'http://localhost:9090')
//     element = new Element(addnewname, sessionId)
//   })

//   after(async () => {
//     await killSession(sessionId)
//   })

//   it('getElementHTML', async () => {
//     const nodeHtml = await element.getElementHTML()
//     expect(nodeHtml.includes('button')).to.be.true
//     expect(nodeHtml.includes('Add new name')).to.be.true
//     expect(nodeHtml.includes('class')).to.be.true
//   })

//   it('getText', async () => {
//     const nodeText = await element.getText()
//     expect(nodeText).to.eql('Add new name')
//   })

//   it('click', async () => {
//     const clickResult = await element.click()
//     expect(clickResult.status).to.eql(0)
//   })
// })