const { elements, element, Keys } = require('../../interface')

class Google {
  constructor() {
    this.submitSearch = element('[name="btnK"]')
    this.inputSearch = element('#lst-ib')
    this.resultSearch = element('#ires .g')
  }

  async find(value) {
    await this.inputSearch.sendKeys(value, /*Keys.ESCAPE */)
    await this.submitSearch.waitForClicable(1000).click()
    await this.resultSearch.waitForElementVisible(1000)
  }

  async getResultSearchText() {
    return await this.resultSearch.getText()
  }
}

module.exports = Google