<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
import { formatNumber } from '~/utils'

const route = useRoute()
const { api } = useApi()

const orderID = computed<string>(() => {
  return route.params.id.toString()
})
const { data, pending } = await useAsyncData(
  'sellToken',
  () => api.orc20SellOrderDetail({ sellOrderId: orderID.value }),
  {
    watch: [orderID],
    server: false,
    immediate: true
  }
)

const tokenInfo = computed(() => {
  return data.value
})
const infos = computed<{ name: string; key: string; value: string | number }[]>(
  () => {
    const whiteList = tokenInfo.value?.sellOrderHasWhiteListed ?? ''

    return [
      {
        name: 'Ticker',
        key: 'sellOrderTicker',
        value: tokenInfo.value?.sellOrderTicker ?? ''
      },
      {
        name: 'Token ID',
        key: 'sellOrderTokenId',
        value: tokenInfo.value?.sellOrderTokenId ?? ''
      },
      {
        name: 'Total',
        key: 'sellOrderAmount',
        value: formatNumber(tokenInfo.value?.sellOrderAmount ?? '0', -1)
      },
      {
        name: 'Amount Left',
        key: 'sellOrderAmountLeft',
        value: formatNumber(tokenInfo.value?.sellOrderAmountLeft ?? '0', -1)
      },
      {
        name: 'Limit',
        key: 'sellOrderLim',
        value: formatNumber(tokenInfo.value?.sellOrderLim ?? '0', -1)
      },
      {
        name: 'Price(Sats/Token)',
        key: 'sellOrderPrice',
        value: formatNumber(tokenInfo.value?.sellOrderPrice ?? '0', -1)
      },
      {
        name: '% Filled',
        key: 'sellOrderProgress',
        value: tokenInfo.value?.sellOrderProgress ?? '0'
      },
      {
        name: 'Seller Address',
        key: 'sellOrderSeller',
        value: tokenInfo.value?.sellOrderSeller ?? ''
      },
      {
        name: 'Activation Block',
        key: 'sellOrderActivationBlock',
        value: tokenInfo.value?.sellOrderActivationBlock ?? '-'
      },
      {
        name: 'Expire Block',
        key: 'sellOrderExpire',
        value:
          tokenInfo.value?.sellOrderExpire === 'never'
            ? tokenInfo.value?.sellOrderExpire.toUpperCase()
            : tokenInfo.value?.sellOrderExpire ?? '-'
      },
      {
        name: 'Whitelisted',
        key: 'sellOrderHasWhiteListed',
        value:
          whiteList.slice(0, 1).toUpperCase() +
          whiteList.slice(1, whiteList.length)
      }
    ]
  }
)
</script>

<template>
  <SellTokenProgress v-if="tokenInfo" :token="tokenInfo" />

  <div class="token-overview">
    <div class="title">Order Detail</div>

    <div v-for="(item, index) in infos" :key="index" class="info-panel">
      <span class="name">{{ item.name }}:</span>
      <div v-if="pending" class="data">
        <n-skeleton
          height="14px"
          :width="`${60 * Math.random()}%`"
          :sharp="false"
        />
      </div>
      <div v-else-if="item.key === 'sellOrderSeller'" class="data">
        <TextLink
          :text="item.value.toString()"
          :to="`/sell?seller=${item.value}`"
        />
      </div>
      <div v-else class="data">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.token-overview {
  @include maxWidth;
  padding: 24px;
  margin: 0px 0 20px 0;
  border: 1px solid #242424;
  border-radius: 6px;
  background-color: rgba(26, 30, 29, 0.6);

  .title {
    font-size: 20px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    color: $onBackground;
    margin-bottom: 24px;
  }

  .progress {
    margin-bottom: 24px;
  }

  .info-panel {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 18px;
    color: $onBackground;
    margin-bottom: 20px;

    @include phone {
      grid-template-columns: 2fr 5fr;
    }

    .name {
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: right;
      opacity: 0.4;
    }

    .data {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
    }

    .history {
      cursor: pointer;
      color: $primary;
      text-decoration: underline;
    }
  }
}
</style>
