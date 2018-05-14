import { ElementAWB as ElAWB, ElementsAWB as ElsAWB } from './lib/element'
import { Client } from './lib/client'
import { Config } from './lib/config'

interface ElementInit {
  (selector: string): ElAWB;
}

interface ElementsInit {
  (selector: string): ElsAWB;
}

export = AWB;

declare function AWB(conf?: Config): { element: ElementInit, elements: ElementsInit, client: Client, $: ElementInit, $$: ElementsInit }

declare namespace AWB {
  export type Conf = Config
  export type ElementAWB = ElAWB
  export type ElementsAWB = ElsAWB
}
