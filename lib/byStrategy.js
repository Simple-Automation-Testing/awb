function elementConstructorArgs(context, strategy, args) {
  const [selector] = args
  args.shift()
  const argLength = args.length
  const subCall = args[argLength - 2]
  const baseElement = args[argLength - 1] || context

  return {
    selector: {using: strategy, value: selector},
    subCall,
    baseElement
  }
}

function initElement(context, ElementInstance) {
  const element = (...args) => new ElementInstance(elementConstructorArgs(context, 'css selector', args))
  // find element options
  element.css = (...args) => new ElementInstance(elementConstructorArgs(context, 'css', args))
  element.xpath = (...args) => new ElementInstance(elementConstructorArgs(context, 'xpath', args))
  element.id = (...args) => new ElementInstance(elementConstructorArgs(context, 'id', args))
  element.accessibilityId = (...args) => new ElementInstance(elementConstructorArgs(context, 'accessibility id', args))

  return element
}

module.exports = {
  initElement
}