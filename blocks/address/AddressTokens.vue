<script setup lang="ts">
import { NSkeleton, NButton, NModal, NCard } from 'naive-ui'
import { OrcOrder, Order } from '~/types/common'
import { useWallet } from '~/store/wallet'
import { formatNumber } from '~/utils'
const route = useRoute()
const wallet = useWallet()
const step = ref('info')
const showModal = ref(false)
const orcOrder = ref<OrcOrder | undefined>(undefined)
const order = ref<Order | undefined>(undefined)
const address = computed(() => route.params.id)
const emit = defineEmits(['select'])
const { api, path, protocol } = useApi()
const isHolder = computed(
  () =>
    wallet.activeBitcoinWallet?.accounts[0]?.address === address.value &&
    protocol === 'orc-cash'
)
const { data, pending, refresh } = await useAsyncData(
  'orc20UserTokenBalances',
  () =>
    api.orc20UserTokenBalances({
      pageNo: 1,
      pageSize: 999,
      address: address.value as string,
      sort: 'balance,desc'
    }),
  {
    watch: [address],
    server: false
  }
)
const selectedTokenID = ref<string | undefined>('')

watch(route, () => {
  refresh()
})
function selectToken(value?: string) {
  selectedTokenID.value = value
  emit('select', selectedTokenID.value)
}

function updateSelectedToken() {
  if (data.value) {
    if (data.value?.items.length > 0) {
      selectToken(data.value?.items[0].userTokenBalanceInscriptionNumber)
    } else {
      selectToken('')
    }
  } else {
    selectToken(undefined)
  }
}

function openModal(tokenInfo: any) {
  step.value = 'info'
  orcOrder.value = {
    p: 'orc-cash',
    op: 'sell',
    tick: tokenInfo.userTokenBalanceTicker,
    id: tokenInfo.userTokenBalanceOrc20ID,
    repeat: 1,
    amount: Math.floor(Number(tokenInfo.userTokenBalanceLockCredits)),
    amt: Math.floor(Number(tokenInfo.userTokenBalanceLockCredits)),
    origin: false
  }
  showModal.value = true
}

function closeModal() {
  orcOrder.value = undefined
  order.value = undefined
  step.value = 'info'
  showModal.value = false
}

watch(data, updateSelectedToken, { immediate: true })
</script>

<template>
  <div class="address-tokens">
    <template v-if="pending">
      <div v-for="i in 3" :key="i">
        <n-skeleton height="134px" width="100%" :sharp="false" />
      </div>
    </template>
    <div
      v-for="(token, index) in data?.items"
      v-else
      :key="index"
      class="token-card"
      :class="{
        selected: token.userTokenBalanceInscriptionNumber === selectedTokenID
      }"
      @click="selectToken(token.userTokenBalanceInscriptionNumber)"
    >
      <div class="ticker">
        <nuxt-link
          :to="path + '/token/' + token.userTokenBalanceInscriptionNumber"
        >
          {{ token.userTokenBalanceTicker }}
        </nuxt-link>
        <n-button
          v-if="isHolder"
          color="#fca121"
          class="sell-button"
          @click="openModal(token)"
        >
          Sell
        </n-button>
      </div>
      <div class="info">
        <span class="name">TokenID</span>
        <span class="value">{{ token.userTokenBalanceOrc20ID }}</span>
      </div>
      <div class="info">
        <span class="name">Inscription</span>
        <span class="value">{{
          '#' + token.userTokenBalanceInscriptionNumber
        }}</span>
      </div>
      <div class="info asset" style="margin-top: 8px">
        <span class="name">Cash</span>
        <span class="value balance">
          {{
            formatNumber(token.userTokenBalanceTransferableBalance, 6, {
              withEndZero: false
            })
          }}
        </span>
      </div>
      <div class="info asset">
        <span class="name">Credit</span>
        <span class="value balance">
          {{
            formatNumber(token.userTokenBalanceAvailable, 6, {
              withEndZero: false
            })
          }}
        </span>
      </div>
      <div class="info asset">
        <span class="name">Frozen</span>
        <span class="value balance">
          {{
            formatNumber(token.userTokenBalanceLockCredits ?? '0', 6, {
              withEndZero: false
            })
          }}
        </span>
      </div>
      <div class="info">
        <span class="name total-balance">Total</span>
        <span class="value balance total-balance">{{
          formatNumber(token.userTokenBalanceBalance, 6, {
            withEndZero: false
          })
        }}</span>
      </div>
    </div>
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      :block-scroll="false"
    >
      <n-card
        style="width: min(100%, 600px); padding: 0 20px; position: relative"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <close-icon
          class="modal-close-icon"
          style="position: absolute; right: 19px; top: 17px; cursor: pointer"
          @click="closeModal"
        />
        <inscribe-order-step :active-step="step" />
        <inscribe-basic-info
          v-if="step === 'info'"
          :order="orcOrder"
          orc-type="orc-cash"
          :hide-mode="true"
          @next="
            (info) => {
              orcOrder = info
              step = 'order'
            }
          "
        />
        <inscribe-content
          v-if="step === 'order'"
          :order="orcOrder!"
          @next="step = 'quote'"
          @previous="step = 'info'"
        />
        <inscribe-order-fee
          v-if="step === 'quote'"
          :order="orcOrder!"
          @next="
            (info) => {
              order = info
              step = 'pay'
            }
          "
        />
        <inscribe-order-pay
          v-if="step === 'pay'"
          :orc-order="orcOrder!"
          :order="order!"
          @next="step = 'result'"
        />
        <inscribe-order-result
          v-if="step === 'result'"
          :order="order!"
          :orc-order="orcOrder!"
        />
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.address-tokens {
  margin-right: 24px;
  width: 212px;

  > :not(:last-child) {
    margin-bottom: 24px;
  }

  @include phone {
    width: 100vw;
    overflow-x: scroll;
    display: flex;
    margin-right: 0px;
    margin-left: 14px;
    margin-bottom: 20px;
    flex-shrink: 0;
    flex-direction: row;

    > :not(:last-child) {
      margin-bottom: 0px;
      margin-right: 24px;
    }
  }

  .token-card {
    width: 214px;
    min-width: 212px;
    padding: 17px 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid $background;

    &:hover,
    &.selected {
      background: $surface;
      border-radius: 6px;
      border: 1px solid rgba(36, 36, 36, 1);
    }

    &.selected::after {
      content: '';
      position: absolute;
      height: 100%;
      left: 0px;
      top: 0;
      background-color: $primary;
      width: 4px;
      border-radius: 4px;
    }

    .ticker {
      color: $primary;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0em;
      text-align: left;
      margin-bottom: 12.45px;
      @include flexRsb;
    }

    .sell-button {
      height: 24px;
      color: #000;
      font-size: 12px;

      .loading-icon {
        height: 20px;
        width: 20px;
      }
    }

    .divider {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin: 10px 0 4px 0;
    }

    .info {
      width: 100%;
      @include flexRsb;
      align-items: flex-start;
      color: $onBackground;
      margin-bottom: 3px;

      &.asset {
        position: relative;
        padding-left: 6px;

        &:before {
          content: '';
          position: absolute;
          width: 2px;
          height: 80%;
          border-radius: 1px;
          left: 0;
          top: 15%;
          background-color: $primary;
        }
      }

      .name {
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        color: rgba(255, 255, 255, 0.5);
      }

      .total-balance {
        font-size: 15px;
      }

      .value {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: right;
        word-break: break-all;
        color: $onBackground;
      }

      .balance {
        color: $primary;
      }
    }
  }
}
</style>
