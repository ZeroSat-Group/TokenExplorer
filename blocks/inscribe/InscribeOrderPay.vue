<script setup lang="ts">
import {
  NCollapseTransition,
  NButton,
  NModal,
  NCard,
  useMessage
} from 'naive-ui'
import { ref } from 'vue'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { Order } from '~/types'
import { useWallet } from '~/store/wallet'
import { useInscriber } from '~/store/inscriber'
const VALID_SECONDS = 3600
const inscriber = useInscriber()
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
const showModal = ref(false)
const emit = defineEmits(['next'])
const now = useNow()
const props = defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true
  }
})
const message = useMessage()
const wallet = useWallet()
const qrcode = useQRCode(props.order.address)
const payMethod = ref('wallet')
const paidWithWallet = ref(false)
const isSending = ref(false)
const counter = useInterval(2000)
const timeString = computed(() => {
  const seconds =
    VALID_SECONDS - Math.floor((now.value.valueOf() - props.order.date) / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (seconds <= 0) {
    inscriber.updateOrder({ ...props.order, status: 3 })
    emit('next')
  }
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`
})

watch(timeString, () => {
  if (timeString.value === '00:00' || timeString.value.startsWith('-')) {
    inscriber.updateOrder({ ...props.order, status: 3 })
    emit('next')
  }
})

const { data } = await useAsyncData(
  'order-detail',
  () => api.inscribeOrderList({ orderIds: props.order.id }),
  {
    lazy: true,
    server: false,
    watch: [counter]
  }
)

const totalBtcAmount = computed(() => {
  return props.order.amount / 1e8
})

function copy() {
  try {
    copyText(props.order.address)
    message.success('Copied')
  } catch {
    message.error('Copy failed')
  }
}
function copyAmount() {
  try {
    copyText(totalBtcAmount.value.toString())
    message.success('Copied')
  } catch {
    message.error('Copy failed')
  }
}

watch(data, () => {
  // @ts-ignore
  if (data.value?.[0].orderOrderConfirmed === true) {
    isSending.value = false
    inscriber.updateOrder({ ...props.order, status: 1 })
    emit('next')
  }
})
async function payWithWallet() {
  paidWithWallet.value = false
  try {
    if (!wallet.activeBitcoinWallet) {
      showModal.value = true
      return
    }
    isSending.value = true
    if (inscriber.testnet) {
      wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
    } else {
      wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
    }
    await wallet.activeBitcoinWallet.provider.sendBitcoin(
      props.order.address,
      props.order.amount
    )
    paidWithWallet.value = true
    inscriber.updateOrder({ ...props.order, status: 1 })
  } catch (e) {
    isSending.value = false
    if (e instanceof Error) {
      message.warning(e.message)
    }
  }
}
</script>

<template>
  <div class="inscribe-order-pay">
    <div class="pay-countdown">Waiting on Payment in {{ timeString }}</div>
    <div class="order-id">orderid: {{ props.order.orderNo }}</div>
    <div class="fee-detail">
      <div>Fee Rate: {{ props.order.feeRate }} sats/vB</div>
      <div>Service Fee: {{ props.order.serviceFee }} sats</div>
      <div class="total-amount">
        Total Amount: <span class="btc-amount">{{ totalBtcAmount }}</span>
        <CopyIcon
          style="cursor: pointer; margin: 0 4px"
          @click="copyAmount"
        />BTC({{ props.order.amount }} sats)
      </div>
    </div>
    <div class="pay-methods">
      <div
        class="method-header"
        @click="
          payMethod === 'wallet' ? (payMethod = '') : (payMethod = 'wallet')
        "
      >
        <check-button :checked="payMethod === 'wallet'" />
        <span style="margin-left: 10px">Pay with wallet</span>
      </div>
      <n-collapse-transition
        class="method-content"
        :show="payMethod === 'wallet'"
      >
        <n-button
          v-if="!paidWithWallet"
          color="#fca121"
          class="submit-button"
          @click="payWithWallet"
        >
          <SpinnerLoader v-if="isSending" color="#000" class="loading-icon" />
          <span v-else>Pay With Wallet</span>
        </n-button>
        <SpinnerLoader v-else color="#fca121" class="loading-icon" />
      </n-collapse-transition>
      <div class="divider" />
      <div
        class="method-header"
        @click="payMethod === 'btc' ? (payMethod = '') : (payMethod = 'btc')"
      >
        <check-button :checked="payMethod === 'btc'" />
        <span style="margin-left: 10px">Pay with BTC</span>
      </div>
      <n-collapse-transition class="method-content" :show="payMethod === 'btc'">
        <div class="qrcode-title">Scan the QRCode to pay:</div>
        <img class="qrcode-img" :src="qrcode" alt="QR Code" />
        <div class="qrcode-title">Or pay to the address below:</div>
        <div>
          {{ order.address }}
          <CopyIcon @click="copy" />
        </div>
      </n-collapse-transition>
    </div>
    <InscriptionList :mint-data="props.order.content" />
    <n-modal v-model:show="showModal" :block-scroll="false">
      <n-card
        style="width: 400px; padding: 0px; position: relative"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <wallet-panel />
      </n-card>
    </n-modal>
    <!-- <n-scrollbar style="max-height: 300px">
      <div
        v-for="(data, index) in mintData"
        :key="index"
        class="mint-data-item"
      >
        <div class="index">
          <span>
            {{ index + 1 }}
          </span>
        </div>
        <div class="data">
          {{ data }}
        </div>
      </div>
    </n-scrollbar> -->
  </div>
</template>

<style scoped lang="scss">
.inscribe-order-pay {
  padding-bottom: 22px;
  .pay-countdown {
    margin-top: 24px;
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
  }

  .order-id {
    margin-top: 12px;
    color: #ffffff66;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: center;
  }

  .fee-detail {
    margin-top: 20px;
    color: #ffffff66;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: center;
    .total-amount {
      margin-top: 10px;
      .btc-amount {
        color: $onBackground;
        font-size: 16px;
      }
    }
  }

  .pay-methods {
    margin-top: 28px;
    margin-bottom: 20px;
    overflow: hidden;
    background: linear-gradient(0deg, #444444, #444444),
      linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
    border: 1px solid #444444;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    .method-header {
      padding: 13px 16px;
    }
    .method-content {
      background: #070908;
      padding: 13px 0;
      @include flexCc;
      .qrcode-img {
        margin: 20px 0;
        border-radius: 4px;
      }
      .qrcode-title {
        color: #ffffff66;
      }
    }

    .divider {
      border-top: 1px solid #ffffff14;
      margin: 0 -16px;
    }
  }
  .submit-button {
    color: #000;
    height: 30px;
    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
