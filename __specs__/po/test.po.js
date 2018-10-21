class TestPO {
  constructor(client, $, $$) {
    this.client = client
    this.$ = $
    this.$$ = $$
  }

  async sleep(time) {
    await this.client.sleep(time)
  }
}

module.exports = {
  TestPO
}