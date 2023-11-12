<script setup lang="ts">
import {
  useThemeVars,
  NProgress,
  NButton,
  NModal,
  NCard,
  NTooltip
} from 'naive-ui'
import { ofetch } from 'ofetch'
import { OrcOrder, Order } from '~/types'
import { formatNumber } from '~/utils'
import { Orc20TokenInfos } from '~/types/swagger'

const themeVars = useThemeVars()
const { protocol } = useApi()
const step = ref('info')
const showModal = ref(false)
const orcOrder = ref<OrcOrder | undefined>(undefined)
const order = ref<Order | undefined>(undefined)
const props = defineProps<{
  tokenInfo: Orc20TokenInfos['items'][0]
}>()

const orc20TokenInfo = computed(() => {
  return props.tokenInfo
})

const apiUrl = 'https://mempool.space/api/v1/blocks/tip/height'
const { data: height, pending } = await useAsyncData(
  'bitcoinBlockHeight',
  () =>
    ofetch<number>(apiUrl, {
      mode: 'cors',
      parseResponse: (t) => Number(t)
    }),
  {
    lazy: true,
    server: false
  }
)
function openModal() {
  step.value = 'info'
  if (!orc20TokenInfo.value) {
    return
  }
  orcOrder.value = {
    p: orc20TokenInfo.value.tokenInfoProtocol ?? protocol,
    op: 'mint',
    tick: orc20TokenInfo.value.tokenInfoTicker,
    id: orc20TokenInfo.value.tokenInfoOrc20Id,
    repeat: 1,
    amount: Math.floor(Number(orc20TokenInfo.value.tokenInfoLimitNumber)),
    origin: protocol === 'orc-20'
  }
  showModal.value = true
}

function closeModal() {
  orcOrder.value = undefined
  order.value = undefined
  step.value = 'info'
  showModal.value = false
}
</script>

<template>
  <div class="token-progress">
    <div class="title-panel">
      <div>
        <span class="title">{{ orc20TokenInfo.tokenInfoTicker }}</span>
        <span class="token-id"
          >Token ID #{{ orc20TokenInfo.tokenInfoOrc20Id }}</span
        >
        <n-tooltip v-if="!pending" trigger="hover">
          <template #trigger>
            <span
              class="loader"
              :class="{
                delay:
                  (height ?? 0) > Number(orc20TokenInfo.tokenInfoSyncHeight),
                sync:
                  (height ?? 0) === Number(orc20TokenInfo.tokenInfoSyncHeight)
              }"
            ></span>
          </template>
          {{
            (height ?? 0) === Number(orc20TokenInfo.tokenInfoSyncHeight)
              ? 'Latest block'
              : `Syncing...${
                  (height ?? 0) - Number(orc20TokenInfo.tokenInfoSyncHeight)
                } blocks to latest`
          }}
        </n-tooltip>
      </div>
      <div v-if="Number(orc20TokenInfo.tokenInfoProgress) === 1">Completed</div>
      <n-button v-else color="#fca121" class="submit-button" @click="openModal">
        Mint Directly
      </n-button>
    </div>
    <n-progress
      type="line"
      :color="themeVars.warningColor"
      :percentage="
        Number(
          formatNumber(Number(orc20TokenInfo.tokenInfoProgress ?? 0) * 100, 2)
        )
      "
    />
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
          :orc-type="orc20TokenInfo.tokenInfoProtocol ?? protocol"
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
:deep(.n-card__content) {
  padding: 0;
}
.loader {
  width: 20px;
  height: 20px;
  display: inline-block;
  position: relative;
  margin-left: 4px;
  margin-top: 4px;
}
.loader::after,
.loader::before {
  content: '';
  box-sizing: border-box;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 8px;
  animation: animloader 1.5s linear infinite;
}
.delay::before {
  background: rgb(243, 0, 0);
}
.sync::before {
  background: rgb(94, 203, 94);
}
.loader::after {
  animation-delay: 1s;
}

@keyframes animloader {
  0% {
    transform: scale(0.2);
    opacity: 1;
  }
  70% {
    transform: scale(0.7);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

.token-progress {
  @include maxWidth;
  margin-bottom: 30px;
  @include flexC;
  align-items: flex-start;
  color: $onBackground;

  .title-panel {
    @include flexR;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    .submit-button {
      height: 30px;
      color: #000;

      .loading-icon {
        height: 20px;
        width: 20px;
      }
    }

    .title {
      color: $primary;
      margin-right: 20px;
      font-size: 30px;
      line-height: 30px;
      font-weight: 500;
      letter-spacing: 0em;
      text-align: left;
    }

    .token-id {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 2px;
      font-weight: 400;
      letter-spacing: 0em;
    }
  }
}
</style>
