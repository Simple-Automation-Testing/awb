import { Element, Elements } from './element.d';
import { Config } from './config'


interface SessionLocalStorage {
  get: (key: string) => Promise<string>
  set: (key: string, value: string) => Promise<any>
  clear: () => Promise<any>
  getAll: () => Promise<object>
}

class Client {
  constructor()

  get sessionStorage(): SessionLocalStorage
  get localStorage(): SessionLocalStorage

  refresh(): Promise<any>
  back(): Promise<any>
  forward(): Promise<any>
  takeScreenshot(): Promise<string>
  waitForUrlIncludes(): Promise<any>
  resizeWindow(): Promise<any>
  startDriver(): Promise<any>
  stopDriver(): Promise<any>
  switchToFrame(): Promise<any>
  getSession(): Promise<any>
  closeCurrentTab(): Promise<any>
  executeScript(): Promise<any>
  executeScriptAsync(): Promise<any>
  getUrl(): Promise<string>
  sleep(): Promise<any>
  getTitle(): Promise<string>
  goTo(url: string): Promise<any>
  getBrowserTabs(): Promise<Array<string>>
  getCurrentBrowserTab(): Promise<string>
  switchToTab(index: number): Promise<any>
  closeBrowser(): Promise
}

interface ElementInit {
  (selector: string): Element;
}

interface ElementsInit {
  (selector: string): Elements;
}

export default function (opts: Config): {
  client: Client
  element: ElementInit
  elements: ElementsInit
}