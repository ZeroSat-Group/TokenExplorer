import { defineStore } from 'pinia'
import { Order } from '~/types'

interface InscriberState {
  mainnetOrders: Order[]
  testnetOrders: Order[]
  testnet: boolean
  textMode: 'single' | 'bulk'
}

export const useInscriber = defineStore('inscriber-store', {
  state: (): InscriberState => ({
    mainnetOrders: [] as Order[],
    testnetOrders: [] as Order[],
    testnet: false,
    textMode: 'single'
  }),
  persist: {
    storage: persistedState.localStorage,
    paths: ['mainnetOrders', 'testnetOrders']
  },
  getters: {
    orders: (state) =>
      state.testnet ? state.testnetOrders : state.mainnetOrders
  },
  actions: {
    addOrder(order: Order) {
      if (this.testnet) {
        this.testnetOrders.unshift(order)
      } else {
        this.mainnetOrders.unshift(order)
      }
    },
    setTextMode(mode: 'single' | 'bulk') {
      this.textMode = mode
    },
    updateOrder(order: Order) {
      if (this.testnet) {
        const index = this.testnetOrders.findIndex((o) => o.id === order.id)
        if (index !== -1) {
          this.testnetOrders.splice(index, 1, order)
        }
      } else {
        const index = this.mainnetOrders.findIndex((o) => o.id === order.id)
        if (index !== -1) {
          this.mainnetOrders.splice(index, 1, order)
        }
      }
    },
    updateStatus() {
      if (this.testnet) {
        this.testnetOrders.forEach((order) => {
          const time = Date.now() - order.date
          if (time > 3600 * 1000 && order.status === 0) {
            order.status = 3
          }
        })
      } else {
        this.mainnetOrders.forEach((order) => {
          const time = Date.now() - order.date
          if (time > 3600 * 1000 && order.status === 0) {
            order.status = 3
          }
        })
      }
    }
  }
})
