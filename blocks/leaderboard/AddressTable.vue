<script lang="ts" setup>
import { NDataTable } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { leaderboardAddressColumns } from '~/utils/table-columns'

const inscriber = useInscriber()
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
const route = useRoute()

const { data, pending } = await useAsyncData(
  'leaderboardAddress',
  () =>
    api.inscribeInscribeRankingSearch({
      address: route.params.address.toString()
    }),
  {
    server: false,
    immediate: true
  }
)
</script>

<template>
  <div class="leaderboard-address-table">
    <div class="table-title">The Address Is Ranked:</div>
    <n-data-table
      :columns="leaderboardAddressColumns"
      :data="data ? [data] : []"
      :bordered="false"
      :loading="pending"
      :remote="true"
      size="large"
      :scroll-x="leaderboardAddressColumns.reduce((sum,item) => ((item as any).width ?? 0) + sum,0).toString()"
    >
      <template #loading>
        <div class="loading">
          <SpinnerLoader />
        </div>
      </template>
    </n-data-table>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-data-table .n-data-table-table) {
  border-spacing: 0 10px;
}
:deep(.n-data-table .n-data-table-th) {
  border-bottom: 0 !important;
}
:deep(.n-data-table .n-data-table-td) {
  border-bottom: 0 !important;
  padding: 21px 16px !important;
  background-color: #1b1f1e;
}
:deep(.n-data-table .n-data-table-tr) {
  border-bottom: 0 !important;
  :first-child {
    border-radius: 6px 0 0 6px;
  }
  :last-child {
    border-radius: 0px 6px 6px 0px;
  }
}

:deep(.n-data-table-td__ellipsis) {
  color: $primary;
}
@include phone {
  :deep(.n-data-table-wrapper) {
    overflow-x: scroll;
  }
}
:deep(.n-data-table-base-table) {
  // min-width: 1000px;
}

:deep(.n-pagination-prefix) {
  color: $onBackground;
}
.leaderboard-address-table {
  // @include maxWidth();
  width: min(100%, 800px);
  @include flexCc;

  .table-title {
    font-size: 16px;
    font-weight: 500;
    color: $onBackground;
    margin: 50px 0;
  }
}
</style>
