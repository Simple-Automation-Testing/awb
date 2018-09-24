function initElement(context, ElementInstance) {


  console.log(context, ElementInstance)
  const element = (...args) => {
    const [selector] = args
    args.shift()
    const argLength = args.length
    const subCall = args[argLength - 2]
    const baseElement = args[argLength - 1] || context

    console.log(baseElement)
    const selectorObj = {using: 'css selector', value: selector}

    return new ElementInstance({
      selector: selectorObj,
      subCall,
      baseElement
    })
  }

  element.css = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'css selector', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.xpath = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'xpath', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.id = (...args) => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'id', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  element.accessibilityId = () => {
    const [selector] = args
    args.shift()
    const selectorObj = {using: 'accessibility id', value: selector}
    return new ElementInstance(selectorObj, ...args)
  }
  return element
}


module.exports = {
  initElement
}