import { Config } from './config'
import { ElementAWB } from './element'

interface SessionLocalStorage {
  get: (key: string) => Promise<string>
  set: (key: string, value: string) => Promise<any>
  clear: () => Promise<any>
  getAll: () => Promise<object>
}

declare class Client {
  constructor()

  sessionStorage: SessionLocalStorage
  localStorage: SessionLocalStorage

  getSize(): Promise<{ height: number, width: number }>
  refresh(): Promise<any>
  back(): Promise<any>
  forward(): Promise<any>
  takeScreenshot(): Promise<string>
  waitForUrlIncludes(): Promise<void>
  waitForTitleInclude(): Promise<void>
  resizeWindow(): Promise<any>
  startDriver(): Promise<any>
  stopDriver(): Promise<any>
  switchToFrame(selector: string | ElementAWB): Promise<any>
  getSession(): Promise<any>
  closeCurrentTab(): Promise<any>
  executeScript(): Promise<any>
  executeScriptAsync(): Promise<any>
  getUrl(): Promise<string>
  sleep(time?: number): Promise<any>
  getTitle(): Promise<string>
  goTo(url: string): Promise<any>
  getBrowserTabs(): Promise<Array<string>>
  getCurrentBrowserTab(): Promise<string>
  switchToTab(index: number): Promise<any>
  switchBack(): Promise<any>
  close(): Promise<any>
}
