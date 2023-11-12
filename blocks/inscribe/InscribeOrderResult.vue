<script setup lang="ts">
import { UploadFileInfo, NButton, NModal, NCard, useMessage } from 'naive-ui'
import { useWallet } from '~/store/wallet'
import { useInscriber } from '~/store/inscriber'
import { OrcOrder, Order } from '~/types'
const { counter, pause } = useInterval(5000, { controls: true })
const isSending = ref(false)
const activateHash = ref('')
const showModal = ref(false)
const wallet = useWallet()
const message = useMessage()
const props = defineProps({
  order: {
    type: Object as PropType<Order>,
    required: true
  },
  orcOrder: {
    type: Object as PropType<OrcOrder | string[] | UploadFileInfo[]>,
    required: true
  }
})
const inscriber = useInscriber()
const BURN_ADDRESS = inscriber.testnet
  ? 'tb1qwxnml4ul8c66f96j9ak3wlk2anm9qw6fcvnax5'
  : '1BitcoinEaterAddressDontSendf59kuE'
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})

const { data } = await useAsyncData(
  'order-detail' + props.order.id,
  () => api.inscribeOrderList({ orderIds: props.order.id }),
  {
    lazy: true,
    server: false,
    watch: [counter]
  }
)

const orderStatus = computed(() => {
  return getOrderStatusString(
    data.value?.[0].orderOrderStatus ?? props.order.status,
    true
  )
})

const mintData = computed(() => {
  return props.order.content
})

const showBurnTip = computed(() => {
  if (!props.orcOrder) {
    return false
  }
  if (Array.isArray(props.orcOrder)) {
    return false
  }
  if (orderStatus.value !== 'Success') {
    return false
  }
  const isBurnOrder = ['sell', 'airdrop', 'vote'].includes(props.orcOrder.op)
  const isOwner =
    props.order.receiver === wallet.activeBitcoinWallet?.accounts[0].address
  return isBurnOrder && isOwner
})

async function burnInscription() {
  isSending.value = false
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
    const info = await api.inscribeOrderDetails({ orderId: props.order.id })
    const hash = await wallet.activeBitcoinWallet.provider.sendInscription(
      BURN_ADDRESS,
      // @ts-ignore
      info.items?.[0].orderDetailInscriptionId
    )
    isSending.value = true
    activateHash.value = hash
    message.success('Inscription activated')
  } catch (e) {
    isSending.value = false
    if (e instanceof Error) {
      message.warning(e.message)
    }
  }
}
watch(data, () => {
  if ((data.value?.[0].orderOrderStatus ?? 0) >= 2) {
    inscriber.updateOrder({
      ...props.order,
      status: data.value?.[0].orderOrderStatus ?? props.order.status
    })
    pause()
  }
})
</script>

<template>
  <div class="inscribe-order-result">
    <div class="title">
      {{ orderStatus }}
    </div>
    <div class="order-id">orderId: {{ props.order.orderNo }}</div>
    <div v-if="orderStatus !== 'Closed'" class="status">
      <check-button
        v-if="orderStatus === 'Success'"
        :checked="true"
        color="#4bb21a"
        class="success-icon"
      />
      <div v-else class="loading-icon">
        <SpinnerLoader />
      </div>
    </div>
    <div class="fee-detail">
      <div>Fee Rate: {{ props.order.feeRate }} sats/vB</div>
      <div>Service Fee: {{ props.order.serviceFee }} sats</div>
      <div>Total Amount: {{ props.order.amount }} sats</div>
    </div>
    <div v-if="showBurnTip" class="burn-tip">
      <div v-if="activateHash" class="burn-tip-text">
        Activated
        <div
          class="tx-link"
          @click="
            toExplorer({
              hash: activateHash,
              testnet: inscriber.testnet
            })
          "
        >
          view tx
        </div>
      </div>
      <span v-else class="burn-tip-text"
        >This inscription need to be sent to Burn Wallet to be activated</span
      >
      <n-button
        v-show="!activateHash"
        color="#fca121"
        class="submit-button"
        @click="burnInscription"
      >
        <SpinnerLoader v-if="isSending" color="#000" class="loading-icon" />
        <span v-else>Activate Now</span>
      </n-button>
    </div>
    <InscriptionList
      :key="orderStatus"
      :mint-data="mintData"
      :order-id="order.id"
    />
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
  </div>
</template>

<style scoped lang="scss">
.inscribe-order-result {
  margin-bottom: 30px;
  .title {
    margin-top: 24px;
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
  }

  .burn-tip {
    margin-bottom: 30px;
    @include flexCc;
    .burn-tip-text {
      color: #ffffff66;
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: center;
      @include flexR;
      .tx-link {
        color: $primary;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
        margin-left: 10px;
        text-decoration: underline;
      }
    }
    .submit-button {
      margin-top: 14px;
      height: 30px;
      color: #000;

      .loading-icon {
        height: 20px;
        width: 20px;
      }
    }
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

  .status {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 23px;
    height: 60px;

    .success-icon {
      transform: scale(2.5);
      transform-origin: top;
    }
    .loading-icon {
      transform: scale(1.5);
      transform-origin: top;
    }
  }
  .fee-detail {
    margin-top: 20px;
    margin-bottom: 24px;
    color: #ffffff66;
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: center;
  }
}
</style>
