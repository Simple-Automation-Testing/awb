const proxyActions = ['$', 'waitForElement']

function initElem(ElemClas) {
  return (...args) => {
    const [selector] = args
    args.shift()
    const argLength = args.length
    const subCall = args[argLength - 2]
    const parentElement = args[argLength - 1]
    console.log('INIT ELEMENT ')
    console.log(subCall, parentElement, args)
    console.log('INIT ELEMENT ________________________________________________')
    return new ElemClas({selector, subCall, parentElement})
  }
}

class ElementAWB {
  constructor({selector, subCall, parentElement}) {
    console.log('CONSTRUCTOR CALL')
    console.log(subCall, parentElement)
    console.log('CONSTRUCTOR CALL +++++++++++++++++++++++++++++++++++++++++++')
    // console.log(subCall, parentElement)
    this.selector = selector
    this.subCall = subCall
    this.parentElement = parentElement
    this.$ = initElem(ElementAWB)
  }


  async getTag() {
    console.log('GET TAG')
    console.log(this.subCall)
    console.log('GET TAG =====================================================')
    if(this.subCall) {await this.subCall(); this.subCall = null}
    const self = this
    return new Promise(res => setTimeout(res('selector ' + self.selector)))
  }

  waitForElement() {
    const self = this

    const thisCall = async () => {
      console.log('SUB CALL from caller ')
      if(self.subCall) {await self.subCall(); self.subCall = null}
      return new Promise(res => setTimeout(res('called' + self.selector)))
    }

    return new Proxy(self, {
      get(target, action) {
        if(!proxyActions.includes(action)) {
          return async (...args) => {
            console.log('X')
            const subCallResult = await thisCall()
            if(subCallResult) {
              args.push(subCallResult)
            }
            return target[action](...args)
          }
        } else {
          return (...args) => {
            console.log("SUB PROXY CALL")
            args.push(thisCall, self)
            console.log("SUB PROXY CALL ))))))))))))))))))))))))))))))))))))))")
            return target[action](...args)
          }
        }
      }
    })
  }
}

const elemeDiv = new ElementAWB('div').waitForElement()

const elementSpan = elemeDiv.$('span')
console.log(elementSpan.getTag(), elementSpan.parentElement)
