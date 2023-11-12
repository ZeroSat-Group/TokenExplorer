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
const activeTab = ref<string | undefined>('all')
const { api, protocol } = useApi()
const tabs = [
  {
    name: 'All',
    key: 'all'
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
  },
  {
    name: 'Transfer',
    key: 'transfer'
  },
  {
    name: 'Send',
    key: 'send'
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

const route = useRoute()
const address = computed(() => route.params.id)
const pageNo = ref(1)
const { data, pending, refresh } = useAsyncData(
  'orc20UserOperationHistories',
  () =>
    api.orc20OperationHistories({
      pageNo: pageNo.value,
      pageSize: 20,
      address: address.value as string,
      inscriptionNumber: props.inscriptionNumber,
      method: activeTab.value === 'all' ? undefined : activeTab.value,
      sort: 'id,desc'
    }),
  {
    watch: [address, pageNo],
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
  <div v-sticky-bottom="40" class="address-table">
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
      :pagination="{ page: pageNo, pageSize: 20, pageSlot: 5, itemCount: Number(data?.totalCount ?? 0), onUpdatePage: (page: number) => pageNo = page, prefix ({ itemCount }) {
        return `Total ${itemCount}`
      }}"
      :bordered="false"
      :loading="pending"
      :remote="true"
      size="large"
    />
  </div>
</template>

<style scoped lang="scss">
:deep(.n-data-table .n-data-table-table) {
  border-spacing: 0px;
}
:deep(.n-data-table .n-data-table-th) {
  border-bottom: 0 !important;
  background-color: rgba(26, 30, 29, 0.6);
}
:deep(.n-data-table .n-data-table-td) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  background-color: rgba(26, 30, 29, 0.6);
  padding: 30px 16px !important;
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
  min-width: 1000px;
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
.address-table {
  width: 100%;
  position: sticky;
  top: 70px;
  border-radius: 6px;
  border: 1px solid rgba(36, 36, 36, 1);
  overflow: hidden;
  padding-bottom: 10px;
  background-color: rgba(26, 30, 29, 0.6);
  padding: 0 26px 10px 26px;
  @include phone {
    width: calc(100vw - 24px);
  }
  .tabs {
    margin-top: 10px;
    float: right;
    @include phone {
      float: none;
      height: auto;
    }
  }
}
</style>
