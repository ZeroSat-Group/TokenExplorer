<script setup lang="ts">
import { NScrollbar, NPopover } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'

const inscriber = useInscriber()
const props = defineProps({
  mintData: {
    type: Array as PropType<string[]>,
    required: true
  },
  orderId: {
    type: String,
    default: ''
  }
})
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})

const { data: txData } = useAsyncData('getTxData' + props.orderId, () =>
  api.inscribeOrderDetails({ orderId: props.orderId })
)
</script>

<template>
  <n-scrollbar style="max-height: 300px">
    <div
      v-for="(data, index) in props.mintData"
      :key="index"
      class="mint-data-item"
    >
      <div class="data-index">
        <span>
          {{ index + 1 }}
        </span>
      </div>
      <n-popover>
        <template #trigger>
          <div class="data">
            {{ data }}
          </div>
        </template>
        <div class="json-data">
          {{ data }}
        </div>
      </n-popover>
      <div v-if="txData?.items?.[index]" class="tx-links">
        <bitcoin-address
          class="tx-link"
          :address="txData?.items?.[index].orderDetailInscriptionId"
          :is-inscription="true"
        />
        <div
          v-if="txData?.items?.[index].orderDetailTxId"
          class="tx-link"
          @click="
            toExplorer({
              hash: txData?.items?.[index].orderDetailTxId,
              testnet: inscriber.testnet
            })
          "
        >
          view tx
        </div>
      </div>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="scss">
.mint-data-item {
  height: 40px;
  margin-top: 14px;
  background: rgba(36, 36, 36, 1);
  @include flexR;
  border: 1px solid rgba(36, 36, 36, 1);
  border-radius: 4px;
  overflow: hidden;

  .data-index {
    width: 66px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0em;
    color: $onBackground;
    @include flexCc;

    span {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: rgba(217, 217, 217, 0.4);
      text-align: center;
      @include flexCc;
    }
  }
  .data {
    width: 100%;
    max-width: 100%;
    padding: 4px 6px;
    color: $onBackground;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1; /* number of lines to show */
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }
  .json-data {
    white-space: pre;
  }

  .tx-links {
    @include flexR;
  }
  .tx-link {
    color: $primary;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 10px;
    text-decoration: underline;
  }
}
</style>
