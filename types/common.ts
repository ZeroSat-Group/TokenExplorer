export type OrcOrder = {
  p: string
  op: string
  tick: string
  repeat: number
  amount?: number
  id: string
  lim?: number | 'self'
  max?: number
  ug?: boolean
  dec?: number
  // If is brc20 order
  origin?: boolean
  to?: string[]
  amt?: number
  price?: number
  expire?: number | 'never'
  buyer?: string[] | 'anyone'
  seller?: string
  vote?: 'yes' | 'no'
  v?: string
  msg?: string
}
export type Order = {
  id: string
  orderNo: string
  date: number
  status: number
  receiver: string
  address: string
  amount: number
  feeRate: number
  serviceFee: number
  content: string[]
}
