import { $Fetch } from 'ofetch'
import { Orc20Proposes, Orc20TokenInfos } from './swagger'
type _PageItem<T> = 'items' extends keyof T ? T['items'] : unknown

export type Item<T> = T extends (infer U)[] ? U : T
export type PageItem<T> = Item<_PageItem<T>>

export type Orc20TokenInfo = PageItem<Orc20TokenInfos>
export type Orc20ProposeInfo = PageItem<Orc20Proposes>

export interface ApiProvider {
  fetch: $Fetch
  baseUrl: string
}

export type Chain = {
  id: string
  token: string
  label: string
  rpcUrl: string
  imgLink: NodeRequire | string
}
