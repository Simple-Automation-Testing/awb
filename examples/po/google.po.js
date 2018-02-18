const { elements, element, Keys } = require('../../interface')

class Google {
  constructor() {
    this.submitSearch = element('[name="btnK"]').waitForClicable(1000)
    this.inputSearch = element('#lst-ib')
    this.resultSearch = element('#ires .g').waitForElementVisible(1000)
  }

  async find(value) {
    await this.inputSearch.sendKeys(value, /*Keys.ESCAPE */)
    await this.submitSearch.click()
  }

  async getResultSearchText() {
    return await this.resultSearch.getText()
  }
}

module.exports = Google