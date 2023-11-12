import { useInscriber } from '~/store/inscriber'

export const useUpdateOrders = () => {
  const inscriber = useInscriber()
  // Update orders status every 10 seconds
  const counter = useInterval(10000)
  inscriber.updateStatus()
  const loading = ref(true)
  const request = inscriber.orders
    .filter((o) => o.status !== 2 && o.status !== 3)
    .map((o) => o.id)
  const { api } = useInscribeApi({
    protocol: 'orc-20',
    testnet: inscriber.testnet
  })
  if (request.length === 0) {
    loading.value = false
    return {
      loading
    }
  }
  watch(counter, async () => {
    const data = await api.inscribeOrderList({ orderIds: request.join(',') })
    for (const order of data) {
      const index = inscriber.orders.findIndex((o) => o.id === order.orderID)
      if (index !== -1) {
        const existOrder = inscriber.orders[index]
        let status = order.orderOrderStatus
        if (
          // @ts-ignore
          order.orderOrderConfirmed === true &&
          order.orderOrderStatus === 0
        ) {
          status = 1
        }
        inscriber.updateOrder({
          ...existOrder,
          status
        })
      }
    }
  })
  onMounted(async () => {
    try {
      const data = await api.inscribeOrderList({ orderIds: request.join(',') })
      for (const order of data) {
        const index = inscriber.orders.findIndex((o) => o.id === order.orderID)
        if (index !== -1) {
          const existOrder = inscriber.orders[index]
          let status = order.orderOrderStatus
          if (
            // @ts-ignore
            order.orderOrderConfirmed === true &&
            order.orderOrderStatus === 0
          ) {
            status = 1
          }
          inscriber.updateOrder({
            ...existOrder,
            status
          })
        }
      }
    } catch (error) {
    } finally {
      loading.value = false
    }
  })
  return {
    loading
  }
}
