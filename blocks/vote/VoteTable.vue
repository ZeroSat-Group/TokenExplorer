<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { NDataTable, NInput } from 'naive-ui'
import { RowData } from 'naive-ui/es/data-table/src/interface'
import { voteProposalColumns } from '~/utils/table-columns'

const { api } = useApi()
const router = useRouter()

const searchType = ref('ticker')
const searchValue = ref('')
const pageNo = ref(1)
const sorter = ref<string | undefined>()

const tabs = computed(() => {
  return [
    {
      name: 'All',
      key: 'all'
    },
    {
      name: 'Active',
      key: '1'
    },
    {
      name: 'Completed',
      key: '2'
    },
    {
      name: 'Expired',
      key: '3'
    }
  ]
})
const activeTab = ref(tabs.value[0].key)

const filter = ref<{
  tokenId?: string
  upgradable?: string
  protocol?: string
  status?: string
  hasWhiteList?: string
}>({
  tokenId: undefined,
  upgradable: undefined,
  protocol: undefined,
  status: undefined,
  hasWhiteList: undefined
})

const getParmas = () => {
  let params: any = {
    pageNo: pageNo.value,
    pageSize: 20,
    sort: sorter.value
  }

  const filterParams = JSON.parse(JSON.stringify(filter.value))

  Object.keys(filterParams).forEach((k) => {
    if (!filterParams[k]) {
      delete filterParams[k]
    }
  })

  const complete = activeTab.value === 'all' ? undefined : activeTab.value

  params = {
    ...params,
    ticker:
      searchValue.value && searchType.value === 'ticker'
        ? searchValue.value.trim()
        : undefined,
    status: complete,
    ...filterParams
  }
  return params
}

const { data, pending, refresh } = useAsyncData(
  'vote-proposals',
  async () => {
    const params = getParmas()
    return await api.orc20Proposes(params)
  },
  {
    watch: [pageNo],
    server: false,
    immediate: true
  }
)

const rowProps = (row: RowData) => {
  return {
    style: 'cursor: pointer;',
    onClick: () => {
      router.push('/vote/' + row.inscriptionId)
    }
  }
}

watch(sorter, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})
watch(
  filter,
  () => {
    if (pageNo.value === 1) {
      refresh()
    } else {
      pageNo.value = 1
    }
  },
  {
    deep: true
  }
)

watchDebounced(
  searchValue,
  () => {
    if (pageNo.value === 1) {
      refresh()
    } else {
      pageNo.value = 1
    }
  },
  {
    debounce: 500,
    maxWait: 1000
  }
)

watch(activeTab, () => {
  if (pageNo.value === 1) {
    refresh()
  } else {
    pageNo.value = 1
  }
})

const columns = computed(() => {
  return sellColumns
})

function handleUpdateSorter(sorterInfo: any) {
  columns.value.forEach((column: any) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) {
      return
    }
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorterInfo.columnKey) {
      column.sortOrder = sorterInfo.order
    } else {
      column.sortOrder = false
    }
  })
  const map: { [key: string]: string } = {
    sellOrderAmount: 'amount',
    sellOrderSoldAmount: 'amountLeft',
    sellOrderPrice: 'price',
    sellOrderProgress: 'progress',
    sellOrderActivationBlock: 'height',
    sellOrderExpire: 'expireBlock'
  }
  sorter.value =
    map[sorterInfo.columnKey] +
    ',' +
    (sorterInfo.order === 'descend' ? 'desc' : 'asc')
}

function handleUpdateFilters(filterInfo: any) {
  const tokenId = [
    ...(filterInfo.tokenInfoOrc20Id ?? filterInfo.sellOrderTokenId ?? [])
  ]
  filter.value.tokenId = !tokenId.includes('1') ? undefined : '1'
  filter.value.hasWhiteList = filterInfo.sellOrderHasWhiteListed
  filter.value.status = filterInfo.sellOrderStatus
}
</script>
<template>
  <div class="vote-table">
    <div class="header">
      <span class="title" />
      <div class="right-panel">
        <n-input
          v-model:value="searchValue"
          class="input"
          type="text"
          size="large"
          placeholder="Search ticker"
        >
          <template #prefix>
            <SearchIcon size="18" />
          </template>
        </n-input>
        <div class="tabs">
          <CustomTabs
            :tabs="tabs"
            :active-tab="activeTab"
            @select="(value: string) => activeTab = value"
          />
        </div>
      </div>
    </div>
    <div class="table">
      <n-data-table
        :row-props="rowProps"
        :columns="voteProposalColumns"
        :data="data?.items"
        :pagination="{
        page: pageNo, pageSize: 20, pageSlot: 5, itemCount: Number(data?.totalCount ?? 0), onUpdatePage: (page: number) => pageNo = page, prefix({ itemCount }) {
          return `Total ${itemCount}`
        }
      }"
        :bordered="false"
        :loading="pending"
        :remote="true"
        size="large"
        @update:sorter="handleUpdateSorter"
        @update:filters="handleUpdateFilters"
      >
        <template #loading>
          <div class="loading">
            <SpinnerLoader />
          </div>
        </template>
      </n-data-table>
    </div>
  </div>
</template>
<style lang="scss"></style>
<style lang="scss" scoped>
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

:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
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

.vote-table {
  margin-top: 47px;
  @include maxWidth();

  .header {
    @include flexRsb;

    @include phone {
      @include flexC;
    }

    .title {
      color: $onBackground;
      font-size: 24px;
      font-weight: 600;
      line-height: 29px;
      letter-spacing: 0em;
      text-align: left;

      @include phone {
        display: none;
        height: 0;
      }
    }

    .right-panel {
      @include flexR;

      @include phone {
        @include flexC;
        flex-direction: column-reverse;
      }

      .input-bar {
        @include flexR;

        @include phone {
          width: 100%;
        }
      }

      .input {
        border: 1px solid $surface;
        background: $surface;
        margin-right: 11px;
        padding: 2px 0;
        width: 256px;
        height: 36px;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0em;
        text-align: left;

        @include phone {
          width: 100%;
          // margin: 0 14px;
          margin: 0;
        }
      }

      .tabs {
        background: $surface;
        padding: 5px 8px;
        border-radius: 6px;

        @include phone {
          margin-bottom: 10px;
          margin-top: 10px;
          width: calc(100vw - 28px);
        }
      }
    }
  }

  .table {
    margin-top: 40px;

    @include phone {
      margin-top: 20px;
    }
  }
}
</style>
