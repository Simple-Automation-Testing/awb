import { ElementAWB, ElementsAWB } from './lib/element'
import { Client } from './lib/client'
import { Config } from './lib/config'

interface ElementInit {
  (selector: string): ElementAWB;
}

interface ElementsInit {
  (selector: string): ElementsAWB;
}

export = AWB;

declare function AWB(conf?: Config): { element: ElementInit, elements: ElementsInit, client: Client, $: ElementInit, $$: ElementsInit }

declare namespace AWB {
  export class Element extends ElementAWB {
  }
  export class Elements extends ElementsAWB {
  }
  export type Conf = Config
}
