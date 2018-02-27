const { element, elements } = require('../driver')

class Google {
  constructor() {
    this.submitSearch = element('body').element('.tsf-p').element('[name="btnK"]').waitForClicable(1000)
    this.inputSearch = element('#lst-ib')
    this.resultSearch = element('#ires .g').waitForElementVisible(1000)
    this.input4 = elements('input').get(4)
  }

  async find(value) {
    await this.inputSearch.sendKeys(value, /*Keys.ESCAPE */)
    await this.submitSearch.click()
  }

  async getSome() {
    console.log(await this.input4.getElementHTML())
  }

  async getElementRects() {
    const { x, y } = await this.inputSearch.location()
    const body = await this.inputSearch.locationView()
    const { width, height } = await this.inputSearch.size()
    console.log(x, y, body, width, height)
  }

  async getResultSearchText() {
    return await this.resultSearch.getText()
  }
}

module.exports = Google