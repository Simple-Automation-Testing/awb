export class Element {
  constructor(selector: string, sessionId: string | null, elementId: string | null, baseElement: Element)

  waitForElement(time: number): ProxyHandler<Element>
  waitForClicable(time: number): ProxyHandler<Element>
  waitForElementVisible(time: number): ProxyHandler<Element>
  waitForElementPresent(time: number): ProxyHandler<Element>

  size(): Promise<{ width: number, height: number }>
  location(): Promise<{ x: number, y: number }>
  locationView(): Promise<{ x: number, y: number }>
  clear(): Promise<any>
  getElementHTML(): Promise<string>
  getText(): Promise<string>
  element(selector: string): Element
  elements(selector: string): Elements
  sendKeys(keys: string | Array<string>): Promise<any>
  getAttribute(attribute: string): Promise<string>
  click(): Promise<any>
  toElement(): Promise<any>
  isDisplayed(): Promise<boolean>
  mouseDownAndMove(position: { x: number, y: number }): Promise<any>

}

export class Elements {
  constructor(selector: string, sessionId: string | null, baseElement: Element)
  get(index: number): Promise<Element>
  count(): Promise<number>
  filter(cb: Promise<any>): Promise<any>
  map(cb: Promise<any>): Promise<any>
  forEach(cb: Promise<any>): Promise<any>
  waitForElements(time: number): ProxyHandler<Elements>
}