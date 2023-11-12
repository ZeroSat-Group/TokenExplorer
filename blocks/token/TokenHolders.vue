<script setup lang="ts">
import { NDataTable, NProgress } from 'naive-ui'
import { formatNumber } from '~/utils'
import BitcoinAddress from '~/components/BitcoinAddress.vue'
import { Orc20TokenInfos } from '~/types/swagger'

const props = defineProps<{
  inscriptionNumber?: string
  tokenInfo?: Orc20TokenInfos['items'][0]
}>()

const inscriptionNumber = computed(() => {
  return props.inscriptionNumber
    ? props.inscriptionNumber
    : (route.params.id as string)
})
const { api } = useApi()
const route = useRoute()
const pageNo = ref(1)
const { data, pending, refresh } = useAsyncData(
  'orc20TokenHolders',
  () =>
    api.orc20UserTokenBalances({
      pageNo: pageNo.value,
      pageSize: 20,
      sort: 'balance,desc',
      holder: 'true',
      inscriptionNumber: inscriptionNumber.value
    }),
  {
    watch: [pageNo],
    server: false
  }
)
// const { data: tokenInfo } = await useAsyncData(
//   'orc20TokenInfoDetail',
//   () =>
//     api.orc20TokenInfos({
//       pageNo: 1,
//       pageSize: 1,
//       inscription: inscriptionNumber.value
//     }),
//   {
//     watch: [props],
//     server: false
//   }
// )

const supply = computed(() => props.tokenInfo?.tokenInfoMaxNumber ?? 0)

watch(props, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})

const columns: any = [
  {
    title: 'RANK',
    key: 'rank',
    width: 180,
    align: 'center',
    render(_: any, index: number) {
      return index + 1 + (pageNo.value - 1) * 20
    }
  },
  {
    title: 'ADDRESS',
    key: 'userTokenBalanceAddress',
    align: 'center',
    render(row: any) {
      return h(BitcoinAddress, {
        address: row.userTokenBalanceAddress,
        compact: 'medium'
      })
    }
  },
  {
    title: 'PERCENTAGE',
    key: 'percentage',
    align: 'center',
    width: 300,
    render(row: any) {
      return h(NProgress, {
        type: 'line',
        color: '#fca121',
        percentage: Number(
          formatNumber(
            (Number(row.userTokenBalanceBalance) / Number(supply.value)) * 100
          )
        ),
        indicatorTextColor: '#ffffff',
        railColor: '#3F3E28'
      })
    }
  },
  {
    title: 'HOLDING',
    key: 'userTokenBalanceBalance',
    width: 350,
    align: 'center',
    render(row: any) {
      return formatNumber(row.userTokenBalanceBalance, -1)
    }
  }
]
</script>

<template>
  <div class="token-holders">
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
.token-holders {
  overflow: hidden;
  padding: 0 26px 10px 26px;
}
</style>
