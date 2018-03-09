function name(params) {
  this.runSomeIssue()
}

class XXXX {
  constructor() {
    this.aaaa = 'xxxxx'
  }

  runSomeIssue() {
    console.log('aaaaaa,dsadsadsadsa')
  }
}


const a = new XXXX()


name.apply(a)
