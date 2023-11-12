import { ofetch } from 'ofetch'
import { Yapi } from './yapi'
import { ApiProvider } from '~/types/api'
const TESTNET_BASE_URL = 'https://dev-apiorc.infosat.io:30443/'

const api = defineNuxtPlugin((nuxtApp) => {
  const { $config } = nuxtApp
  const getProvider = (
    protocol: 'orc-20' | 'orc-cash',
    testnet = false
  ): ApiProvider => {
    const path =
      protocol === 'orc-20' ? 'ordinals-sync/' : 'ordinals-sync-orc20-cash/'
    const baseUrl = testnet
      ? TESTNET_BASE_URL
      : protocol === 'orc-20'
      ? $config.public.orc20Url
      : $config.public.orccashUrl
    return {
      baseUrl: baseUrl + path,
      fetch: ofetch.create({
        baseURL: baseUrl + path,
        headers: {
          'Content-Type': 'application/json',
          'accept-language': 'en-US'
        },
        parseResponse: (data) => {
          const response = JSON.parse(data)
          if (response.code !== '000') {
            throw new Error(response.data?.msg ?? response.msg)
          } else {
            return response.data
          }
        }
      })
    }
  }
  return {
    provide: {
      orc20api: new Yapi(getProvider('orc-20')),
      orccashapi: new Yapi(getProvider('orc-cash')),
      orc20testnetapi: new Yapi(getProvider('orc-20', true)),
      orccashtestnetapi: new Yapi(getProvider('orc-cash', true))
    }
  }
})

export default api
