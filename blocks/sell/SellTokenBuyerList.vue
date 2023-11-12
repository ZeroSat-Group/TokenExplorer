<script setup lang="ts">
import { NDataTable } from 'naive-ui'
import { TableColumn } from 'naive-ui/es/data-table/src/interface'
import { sellTokenBuyerListColumns } from '~/utils/table-columns'

const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  }
})

const inscriptionNumber = computed(() => {
  return props.inscriptionNumber
    ? props.inscriptionNumber
    : (route.params.id as string)
})
const { api } = useApi()
const route = useRoute()
const pageNo = ref(1)
const { data, pending, refresh } = useAsyncData(
  'sellTokenBuyer',
  () =>
    api.orc20SellOrderDetails({
      pageNo: pageNo.value,
      pageSize: 20,
      sellOrderId: inscriptionNumber.value
    }),
  {
    watch: [pageNo],
    server: false
  }
)

watch(props, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})

const indexCol: TableColumn = {
  title: '#',
  key: 'index',
  width: 120,
  align: 'center',
  render(_: any, index: number) {
    return index + 1 + (pageNo.value - 1) * 20
  }
}

const columns = computed(() => [indexCol, ...sellTokenBuyerListColumns])
</script>

<template>
  <div class="token-buyer-list">
    <n-data-table
      :columns="columns"
      :data="data?.items"
      :pagination="{page: pageNo, pageSlot: 5, pageSize: 20, pageCount: data?.totalPage, itemCount: Number(data?.totalCount ?? '0'), 'onUpdate:page': (value: number) => pageNo = value, prefix ({ itemCount }) {
        return `Total ${itemCount}`}
      }"
      :bordered="false"
      :loading="pending"
      :remote="true"
      size="large"
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
:deep(.n-data-table .n-data-table-th) {
  background-color: rgba(26, 30, 29, 0.6);
  border-bottom: 0 !important;
}
:deep(.n-data-table .n-data-table-td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  background-color: rgba(26, 30, 29, 0.6);
  padding: 30px 16px !important;
}
:deep(.n-data-table .n-data-table-table) {
  border-spacing: 0px;
}
:deep(.n-data-table .n-data-table-tr) {
  border-bottom: 0 !important;
}
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}

@include phone {
  :deep(.n-data-table-wrapper) {
    overflow-x: scroll;
  }
}
:deep(.n-data-table-base-table) {
  min-width: 960px;
}
:deep(.n-pagination-prefix) {
  color: $onBackground;
}
.token-buyer-list {
  overflow: hidden;
  padding: 0 26px 10px 26px;
}
</style>
