<script setup lang="ts">
import { NModal, NCard, NSwitch, UploadFileInfo } from 'naive-ui'
import { useWallet } from '~/store/wallet'
import { useInscriber } from '~/store/inscriber'
import { OrcOrder, Order } from '~/types'
const wallet = useWallet()
const runtimeConfig = useRuntimeConfig()
const step = ref('info')
const activeTab = ref('orc-cash')
const tabs = [
  {
    name: 'ORC-CASH',
    key: 'orc-cash'
  },
  {
    name: 'ORC-20',
    key: 'orc-20'
  },
  {
    name: 'BRC-20',
    key: 'brc-20'
  },
  {
    name: 'TEXT',
    key: 'text'
  },
  {
    name: 'FILE',
    key: 'file'
  }
]
const showModal = ref(false)
const inscriber = useInscriber()
const orcOrder = ref<OrcOrder | string[] | UploadFileInfo[] | undefined>(
  undefined
)
const order = ref<Order | undefined>(undefined)
function closeModal() {
  orcOrder.value = undefined
  order.value = undefined
  step.value = 'info'
  showModal.value = false
}

watch(
  () => inscriber.testnet,
  () => {
    if (inscriber.testnet) {
      wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
    } else {
      wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
    }
  }
)

function openOrder(o: Order) {
  order.value = o
  if (order.value?.status === 0) {
    step.value = 'pay'
  } else {
    step.value = 'result'
  }
  showModal.value = true
}
</script>

<template>
  <div class="inscribe-header">
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="
          () => {
            if ($route.query.op) {
              $router
                .replace({
                  query: $route.query
                    ? { ...$route.query, op: undefined }
                    : undefined
                })
                .finally(() => {
                  activeTab = tab.key
                  orcOrder = undefined
                })
            } else {
              activeTab = tab.key
              orcOrder = undefined
            }
          }
        "
      >
        {{ tab.name }}
      </div>
    </div>
    <div v-if="runtimeConfig.public.dev === 'true'" class="network-switch">
      <span>Testnet</span>
      <n-switch v-model:value="inscriber.testnet" />
    </div>
  </div>
  <div class="input-box">
    <div class="upload-box">
      <inscribe-text
        v-if="activeTab === 'text'"
        @next="(info: any) => { orcOrder = info; step = 'order'; showModal = true }"
      />
      <inscribe-file
        v-else-if="activeTab === 'file'"
        @next="(info: any) => { orcOrder = info; step = 'order'; showModal = true }"
      />
      <inscribe-basic-info
        v-else
        :key="activeTab"
        :orc-type="activeTab"
        @next="(info: any) => {
          orcOrder = info
          step = 'order'
          showModal = true
        }
        "
      />
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
        <inscribe-text
          v-if="
            step === 'info' &&
            Array.isArray(orcOrder) &&
            typeof orcOrder[0] === 'string'
          "
          :order="orcOrder as string[]"
          @next="(info: any) => { orcOrder = info; step = 'order'; showModal = true }"
        />
        <inscribe-file
          v-if="
            step === 'info' &&
            Array.isArray(orcOrder) &&
            typeof orcOrder[0] === 'object'
          "
          :order="orcOrder as UploadFileInfo[]"
          @next="(info: any) => { orcOrder = info; step = 'order'; showModal = true }"
        />
        <inscribe-basic-info
          v-if="step === 'info' && !Array.isArray(orcOrder)"
          :order="orcOrder"
          :orc-type="activeTab"
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
  <inscribe-orders @open-order="openOrder" />
</template>

<style scoped lang="scss">
:deep(.n-card__content) {
  padding: 0;
}

.inscribe-header {
  @include flexRsb();
  width: 640px;
  margin-top: 48px;

  @include phone {
    width: calc(100% - 32px);
  }

  .tabs {
    @include flexR;
    user-select: none;

    .tab {
      height: 36px;
      padding: 10px 18px;
      cursor: pointer;
      color: $onBackground;
      font-size: 16px;
      font-weight: 500;
      line-height: 21px;
      letter-spacing: 0em;
      text-align: center;
      border: 1px solid rgba(36, 36, 36, 1);
      border-bottom: none;
      @include phone {
        font-size: 14px;
        padding: 10px 12px;
      }

      &:hover,
      &.active {
        border-color: $primary;
        background-color: #1a1e1d;
        z-index: 5;
      }
    }

    :first-child {
      border-top-left-radius: 6px;
    }

    :last-child {
      border-top-right-radius: 6px;
    }

    :not(:first-child) {
      margin-left: -1px;
    }
  }

  .network-switch {
    @include flexR;

    span {
      color: white;
      font-size: 16px;
      font-weight: 500;
      margin-right: 10px;
      line-height: 21px;
      letter-spacing: 0em;
      text-align: center;
    }
  }
}

.input-box {
  background: linear-gradient(0deg, #1a1e1d, #1a1e1d),
    linear-gradient(0deg, #242424, #242424);
  border: 1px solid rgba(36, 36, 36, 1);
  width: 640px;
  padding: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  @include flexC;

  @include phone {
    width: calc(100% - 32px);
  }

  .upload-box {
    width: 100%;
    @include flexCc;
  }
}
</style>
