<script setup lang="ts">
import { NScrollbar } from 'naive-ui'
import { toOrdiExplorer } from '~/utils'

const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  }
})

const { api } = useApi()
const { data } = await useAsyncData(
  'orc20TokenInfoHistory' + props.inscriptionNumber,
  () =>
    api.orc20OperationHistories({
      pageNo: 1,
      pageSize: 100,
      method: 'inscribe-deploy,upgrade',
      status: '1',
      inscriptionNumber: props.inscriptionNumber
    }),
  {
    watch: [props],
    server: false,
    lazy: true
  }
)
</script>

<template>
  <div class="token-history">
    <div class="title">History</div>
    <n-scrollbar scrollable max-height="380px">
      <div
        v-for="item in data?.items"
        :key="item.transfersHistoryInscriptionID"
        class="history-record"
      >
        <div class="action">
          <div
            class="inscription"
            @click="toOrdiExplorer(item.operationHistoryInscriptionID)"
          >
            {{ '#' + item.operationHistoryNumber }}
          </div>
          <div class="type">
            {{ item.operationHistoryType }}
          </div>
        </div>
        <div class="time">
          {{ formatTime(item.operationHistoryBlockTime) }}
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped lang="scss">
.token-history {
  @include flexC();
  align-items: flex-start;
  height: 400px;
  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    color: $onBackground;
    margin-bottom: 20px;
  }
  .history-record {
    color: $onBackground;
    margin-left: 40px;
    padding: 8px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      height: calc(100% - 4px);
      width: 2px;
      background-color: #fff;
      left: -8px;
      top: 2px;
    }
    &:before {
      content: '';
      position: absolute;
      height: 8px;
      width: 8px;
      border-radius: 4px;
      background-color: #fff;
      left: -11px;
      top: 0;
    }
    .action {
      @include flexR;
      .type {
        margin-left: 12px;
      }
      .inscription {
        color: $primary;
        cursor: pointer;
        text-decoration: underline;
      }
    }
    .time {
      margin-top: 4px;
      color: #fff;
      opacity: 0.4;
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0em;
      text-align: left;
    }
  }
}
</style>
