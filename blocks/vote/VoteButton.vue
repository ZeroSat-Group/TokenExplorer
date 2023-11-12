<script lang="ts" setup>
import { NButton, NModal, NCard } from 'naive-ui'
import { useWallet } from '~/store/wallet'
import { OrcOrder, Order } from 'types'
import { Orc20Propose } from 'types/swagger'

const props = defineProps<{
  proposal: Orc20Propose
}>()
const wallet = useWallet()
const defaultOrder: OrcOrder = {
  p: 'orc-cash',
  op: 'vote',
  tick: props.proposal.proposeTicker!,
  id: '1',
  amt: 1000,
  vote: 'yes',
  msg: '',
  repeat: 1,
  v: props.proposal.proposeProposeVersion
}
const orcOrder = ref<OrcOrder | undefined>(defaultOrder)
const order = ref<Order | undefined>(undefined)

const step = ref('info')
const showModal = ref(false)
const showConnactModal = ref(false)

const address = computed(() => {
  return wallet.activeBitcoinWallet?.accounts?.[0].address
})

function clearModal() {
  showModal.value = false
  step.value = 'info'
  orcOrder.value = defaultOrder
}
</script>

<template>
  <div class="vote-button">
    <NButton
      v-if="proposal.proposeIsActived === '1'"
      class="vote-primary-button"
      type="primary"
      @click.stop="
        () => {
          if (!address) showConnactModal = true
          else showModal = true
        }
      "
    >
      Vote
    </NButton>
    <span v-else> Closed </span>
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
        @click="clearModal"
      />
      <inscribe-order-step :active-step="step" />
      <inscribe-basic-info
        v-if="step === 'info'"
        :order="orcOrder"
        :hide-mode="true"
        orc-type="orc-cash"
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

  <n-modal v-model:show="showConnactModal" :block-scroll="false">
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
</template>

<style scoped lang="scss">
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}

.vote-button {
  .buy-button:not(.n-button--disabled):hover {
    border-radius: 6px !important;
  }

  .vote-primary-button {
    height: 30px;
    color: #000;
    border-radius: 6px !important;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}

:deep() .n-button__state-border {
  border-radius: 6px !important;
}

.info-form {
  margin-bottom: 40px;
  padding: 0 100px;

  @include phone {
    padding: 0 30px;
  }
}

.form-item {
  .label {
    color: $onBackground;
    text-align: right;
    white-space: nowrap;
    margin-right: 10px;
  }

  .input {
    background: $surface;
    border: 1px solid #28302e;
    width: 100%;
    border-radius: 6px;
  }
}

.input-tip {
  color: $onBackground;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.7;
}

.info-panel {
  display: grid;
  grid-template-columns: 2fr 4fr;
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

.form-error {
  font-size: 16px;
  text-align: center;
  color: #ff4d4f;
}

.buttons {
  margin-top: 10px;
  @include flexRc;

  .next-button {
    margin: auto;
    // width: 100px;
    height: 36px;
    color: #000;
    border-radius: 6px;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
