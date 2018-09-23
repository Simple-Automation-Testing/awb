function initElement(ElementInstance) {
  const element = (...args) => {
    const [selector, subCall, baseElement] = args
    args.shift()
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