<script setup lang="ts">
import { NDataTable } from 'naive-ui'
import { formatNumber } from '~/utils'
import BitcoinAddress from '~/components/BitcoinAddress.vue'
import CreateDateWithStatus from '~/components/CreateDateWithStatus.vue'
import TokenMethod from '~/components/TokenMethod.vue'
import InscriptionNumber from '~/components/InscriptionNumber.vue'

const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  }
})
const { api, protocol } = useApi()

const activeTab = ref<string | undefined>('all')
const tabs = [
  {
    name: 'All',
    key: 'all'
  },
  {
    name: 'Send',
    key: 'send'
  },
  {
    name: 'Transfer',
    key: 'transfer'
  },
  {
    name: 'Inscribe-Deploy',
    key: 'inscribe-deploy'
  },
  {
    name: 'Inscribe-Mint',
    key: 'inscribe-mint'
  },
  {
    name: 'Inscribe-Send',
    key: 'inscribe-send'
  },
  {
    name: 'Inscribe-Upgrade',
    key: 'inscribe-upgrade'
  },
  {
    name: 'Upgrade',
    key: 'upgrage'
  }
]
if (protocol === 'orc-20') {
  tabs.splice(5, 0, {
    name: 'Inscribe-Cancel',
    key: 'inscribe-cancel'
  })
  tabs.splice(7, 0, {
    name: 'Inscribe-Remaining',
    key: 'inscribe-remaining-balance'
  })
}

const inscriptionNumber = computed(() => {
  return props.inscriptionNumber
    ? props.inscriptionNumber
    : (route.params.id as string)
})
const route = useRoute()
const pageNo = ref(1)
const { data, pending, refresh } = useAsyncData(
  'orc20TokenOperationHistories',
  () =>
    api.orc20OperationHistories({
      pageNo: pageNo.value,
      pageSize: 20,
      inscriptionNumber: inscriptionNumber.value,
      method: activeTab.value === 'all' ? undefined : activeTab.value,
      sort: 'id,desc'
    }),
  {
    watch: [pageNo],
    server: false
  }
)

watch(inscriptionNumber, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})
watch(activeTab, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})

const columns: any = [
  {
    title: 'INSCRIPTION #',
    key: 'operationHistoryNumber',
    render(row: any) {
      return h(InscriptionNumber, {
        inscriptionNumber: row.operationHistoryNumber,
        inscriptionID: row.operationHistoryInscriptionID
      })
    }
  },
  {
    title: 'OPERATION',
    key: 'operationHistoryType',
    align: 'center',
    render(row: any) {
      return h(TokenMethod, {
        method: row.operationHistoryType,
        inscriptionID: row.operationHistoryInscriptionID
      })
    }
  },
  {
    title: 'QUANTITY',
    key: 'operationHistoryAmount',
    align: 'center',
    render(row: any) {
      return formatNumber(row.operationHistoryAmount, 6, { withEndZero: false })
    }
  },
  {
    title: 'FROM',
    key: 'operationHistoryFromAddress',
    align: 'center',
    render(row: any) {
      if (
        ['INSCRIBE_MINT', 'INSCRIBE_DEPLOY'].includes(row.operationHistoryType)
      ) {
        return '-'
      }
      return h(BitcoinAddress, {
        address: row.operationHistoryFromAddress
      })
    }
  },
  {
    title: 'TO',
    key: 'operationHistoryToAddress',
    align: 'center',
    render(row: any) {
      return h(BitcoinAddress, {
        address: row.operationHistoryToAddress
      })
    }
  },
  {
    title: 'TIMESTAMP',
    key: 'operationHistoryBlockTime',
    align: 'center',
    render(row: any) {
      return h(CreateDateWithStatus, {
        timestamp: row.operationHistoryBlockTime,
        hash: row.operationHistoryTxHash,
        status: Number(row.operationHistoryStatus)
      })
    }
  }
]
</script>

<template>
  <div class="token-history">
    <div class="header">
      <div class="tabs">
        <CustomTabs
          :compact="true"
          :tabs="tabs"
          :active-tab="activeTab"
          @select="(value: string) => activeTab = value"
        />
      </div>
    </div>
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
@include phone {
  :deep(.tab-bar) {
    grid-template-columns: repeat(2, minmax(26px, auto)) !important;
    gap: 12px 12px !important;
  }
}
.token-history {
  overflow: hidden;
  padding: 0 26px 10px 26px;
  .tabs {
    float: right;
    @include phone {
      float: none;
      height: auto;
    }
  }
}
</style>
