import { Yapi } from '~/plugins/api/yapi'
export const useApi = (): {
  protocol: 'orc-20' | 'orc-cash'
  api: Yapi
  path: string
} => {
  const { $orc20api, $orccashapi, $getRouteBaseName } = useNuxtApp()
  const route = useRoute()

  const getProtocal = () => {
    const base = $getRouteBaseName(route)
    switch (base) {
      case 'orc-20':
      case 'orc-20-token-id':
      case 'orc-20-address-id':
        return 'orc-20'
      default:
        return 'orc-cash'
    }
  }

  const getPath = () => {
    const protocol = getProtocal()
    switch (protocol) {
      case 'orc-20':
        return '/orc-20'
      case 'orc-cash':
        return ''
    }
  }

  const getApi = () => {
    const protocol = getProtocal()
    switch (protocol) {
      case 'orc-20':
        return $orc20api
      case 'orc-cash':
        return $orccashapi
    }
  }

  return {
    api: getApi(),
    protocol: getProtocal(),
    path: getPath()
  }
}

export const useInscribeApi = ({
  protocol,
  testnet
}: {
  protocol: 'orc-20' | 'orc-cash'
  testnet: boolean
}) => {
  const { $orc20api, $orccashapi, $orc20testnetapi, $orccashtestnetapi } =
    useNuxtApp()
  const api =
    protocol === 'orc-20'
      ? testnet
        ? $orc20testnetapi
        : $orc20api
      : testnet
      ? $orccashtestnetapi
      : $orccashapi
  return {
    api
  }
}
