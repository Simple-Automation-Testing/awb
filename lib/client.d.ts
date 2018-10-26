import { Config } from './config'
import { ElementAWB } from './element'
import { Keys } from './event/keys'

interface ISessionLocalStorage {
  get: (key: string) => Promise<string>
  set: (key: string, value: string) => Promise<any>
  clear: () => Promise<any>
  getAll: () => Promise<object>
}


interface IAlert {
  accept: () => Promise<void>
  dismiss: () => Promise<void>
  getText: () => Promise<string>
  sendKeys: (text: string) => Promise<void>
}

interface ICookie {
  set: () => Promise<void>
  get: () => Promise<any>
  clear: () => Promise<void>
  getAll: (text: string) => Promise<any>
}

export declare class Client {
  constructor()

  static Keys: Keys
  static sessionId: string | null

  sessionStorage: ISessionLocalStorage
  localStorage: ISessionLocalStorage
  cookie: ICookie
  eventsList: {
    mouseEnter: 'mouseEnter',
    mouseOver: 'mouseOver',
    mouseLeave: 'mouseLeave',
    mouseOut: 'mouseOut'
  }
  alert: Alert
  Keys: Keys
  pressKeys(keys: Keys | [Keys])
  getSize(): Promise<{ height: number, width: number }>
  dispatchEvent(element: ElementAWB, eventType: string): Promise<void>
  refresh(): Promise<any>
  back(): Promise<any>
  forward(): Promise<any>
  getRect(): Promise<{ height: number, width: number, x: number, y: number }>
  pageSource(): Promise<string>
  maximizeWindow(): Promise<void>
  // minimizeWindow(): Promise<void>
  doubleClick(): Promise<any>
  takeScreenshot(): Promise<string>
  waitForUrlIncludes(url: string, time: number): Promise<void>
  waitForTitleInclude(title: string, time: number): Promise<void>
  resizeWindow(width: number, height: number): Promise<any>
  startDriver(): Promise<any>
  stopDriver(): Promise<any>
  switchToFrame(element: ElementAWB): Promise<any>
  getSession(): Promise<any>
  closeCurrentTab(): Promise<any>
  executeScript(script: string | any, funcArgs?: any): Promise<any>
  executeScriptAsync(script: string | any, funcArgs?: any): Promise<any>
  getUrl(): Promise<string>
  sleep(time?: number): Promise<any>
  getTitle(): Promise<string>
  goTo(url: string): Promise<void>
  goToInNewTab(url: string): Promise<void>
  getBrowserTabs(): Promise<Array<string>>
  getCurrentBrowserTab(): Promise<string>
  switchToTab(index: number): Promise<any>
  switchBack(): Promise<any>
  close(): Promise<any>
}
