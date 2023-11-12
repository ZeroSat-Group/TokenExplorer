import dayjs from 'dayjs'
import { OrcOrder } from '~/types'

// Format time
export function formatTime(
  t: number | string | undefined,
  format = 'YYYY/MM/DD HH:mm:ss'
): string {
  if (!t) {
    return ''
  }
  const d = typeof t === 'number' ? t : Number(t)
  return dayjs(d || t).format(format)
}

// Shorten address
export function shortAddress(address: string, length = 5): string {
  if (!address) {
    return ''
  }

  if (address.length <= length) {
    return address
  }
  return `${address.slice(0, length)}...${address.slice(-length + 1)}`
}

// Format number to string
export function calculateProgress(
  current: string,
  total: string,
  precision = 2
): string {
  const percent = (Number(current) / Number(total)) * 100
  return `${percent.toFixed(precision)}%`
}
export function formatNumber(
  num: number | string,
  precision = 2,
  {
    currency = true,
    withEndZero = true
  }: { currency?: boolean; withEndZero?: boolean } = {}
): string {
  const n = Number(num)
  if (Number.isNaN(n)) {
    return ''
  }
  if (n < 0.0000000001) {
    return '0'
  }

  let _precision: number | undefined = precision

  if (_precision === -1) {
    _precision = undefined
  }
  const data = n.toFixed(_precision)
  // const stripped = data.replace(/(\.[0-9]*[1-9])0+$|\.0*$/, '$1')

  if (currency) {
    if (!withEndZero) {
      return Number(data).toLocaleString('en-US')
    }
    return Number(data).toLocaleString('en-US', {
      maximumFractionDigits: _precision,
      minimumFractionDigits: _precision
    })
  }
  return data
}

export function checkBitcoinAddress(address: string) {
  const regex = /^(bc1|[13]|tb1|[mn])[a-zA-HJ-NP-Z0-9]{25,59}$/
  return regex.test(address)
}

// 跳转浏览器
export function toExplorer({
  address,
  hash,
  testnet,
  block,
  isInscription = false
}: {
  address?: string
  hash?: string
  testnet?: boolean
  block?: string
  isInscription?: boolean
}) {
  if (isInscription) {
    toOrdiExplorer(address!)
    return
  }
  let url
  const explorer = testnet
    ? 'https://mempool.space/testnet'
    : 'https://mempool.space'
  if (hash) {
    url = `${explorer}/tx/${hash}`
  } else if (address) {
    url = `${explorer}/address/${address}`
  } else {
    url = `${explorer}/block/${block}`
  }
  window.open(url, '_blank')
}

// Open ordi exporer
export function toOrdiExplorer(inscriptionID: string) {
  const url = 'https://ordinals.com/inscription/' + inscriptionID
  window.open(url, '_blank')
}

// Generate inscription json data for order
export function generateMintDataForOrder(order: OrcOrder, strinify = true) {
  const {
    p,
    op,
    tick,
    amount,
    repeat,
    id,
    lim,
    max,
    ug,
    dec,
    amt,
    to,
    price,
    expire,
    seller,
    buyer,
    v,
    vote,
    msg
  } = order
  if (op === 'deploy') {
    const inscription: { [key: string]: string | undefined } = {
      p,
      op,
      tick,
      max: max?.toString(),
      lim: lim?.toString()
    }
    if (p !== 'brc-20') {
      inscription.id = id.toString()
    }
    if (ug === false) {
      inscription.ug = 'false'
    }
    if (dec !== 18) {
      inscription.dec = dec?.toString()
    }
    return [strinify ? JSON.stringify(inscription) : inscription]
  } else if (op === 'airdrop') {
    const inscription: { [key: string]: string | string[] | undefined } = {
      p,
      op,
      tick,
      amt: (amt ?? 0).toString(),
      lim: (lim ?? 0).toString(),
      id,
      to
    }

    return [strinify ? JSON.stringify(inscription) : inscription]
  } else if (op === 'sell') {
    const inscription: { [key: string]: string | string[] | undefined } = {
      p,
      op,
      tick,
      amt: amt!.toString(),
      lim: lim ? lim.toString() : undefined,
      id: id.toString(),
      price: price!.toString(),
      expire: expire!.toString(),
      seller,
      buyer
    }

    for (const k in Object.keys(inscription)) {
      if (!inscription[k]) {
        delete inscription[k]
      }
    }
    return [strinify ? JSON.stringify(inscription) : inscription]
  } else if (op === 'vote') {
    const inscription: { [key: string]: string | string[] | undefined } = {
      p,
      op,
      tick,
      amt: (amt ?? 0).toString(),
      id,
      v,
      vote
    }
    inscription.id = id.toString()
    if (msg) {
      inscription.msg = msg
    }
    return [strinify ? JSON.stringify(inscription) : inscription]
  }
  const result = []
  for (let i = 0; i < (repeat ?? 1); i++) {
    const inscription: { [key: string]: string | undefined } = {
      p,
      op,
      tick,
      amt: amount?.toString()
    }
    if (p !== 'brc-20') {
      inscription.id = id.toString()
    }
    result.push(strinify ? JSON.stringify(inscription) : inscription)
  }
  return result
}

export async function copyText(str: string) {
  document.addEventListener('copy', (e) => {
    e.clipboardData?.setData('text/plain', str)
    e.preventDefault()
  })

  const isCopy = document.execCommand('copy')
  if (!isCopy) {
    if (!navigator.clipboard) {
      throw Error
    }
    await navigator.clipboard.writeText(str)
  }
}

// Get order status string
export function getOrderStatusString(index: number, confirmed = false) {
  switch (index) {
    case 0:
      return confirmed ? 'In Process' : 'Unpaid'
    case 1:
      return 'In Process'
    case 2:
      return 'Success'
    case 3:
      return 'Closed'
    default:
      return 'unknown'
  }
}

export const parseCurrency = (input: string) => {
  const nums = input.replace(/,/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) {
    return Number(nums)
  }
  return nums === '' ? null : Number.NaN
}

export const formatCurrency = (value: number | null) => {
  if (value === null) {
    return ''
  }
  return value.toLocaleString('en-US')
}
