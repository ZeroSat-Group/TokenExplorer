<script setup lang="ts">
import dayjs from 'dayjs'
import { NDataTable } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { leaderboardColumns } from '~/utils/table-columns'

const inscriber = useInscriber()
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
const pageNo = ref(1)
const sorter = ref<string | undefined>()

const tabs = computed(() => {
  return [
    {
      name: 'Weekly',
      key: 'weekly'
    },
    {
      name: 'Monthly',
      key: 'monthly'
    },
    {
      name: 'All-Time',
      key: 'allTime'
    }
  ]
})
const activeTab = ref(tabs.value[0].key)

const getDays = (): string | undefined => {
  switch (activeTab.value) {
    case 'weekly':
      return dayjs().day().toString()
    case 'monthly':
      return dayjs().date().toString()
    default:
      return undefined
  }
}
const getParmas = () => {
  let params: any = {
    pageNo: pageNo.value,
    pageSize: 20,
    sort: sorter.value
  }
  params = { ...params, days: getDays() }
  return params
}

const { data, pending, refresh } = useAsyncData(
  'leaderboard',
  async () => {
    const params = getParmas()
    return await api.inscribeInscribeRankingList(params)
  },
  {
    watch: [pageNo],
    server: false,
    immediate: true
  }
)

watch(sorter, () => {
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

const columns = computed(() => {
  return leaderboardColumns
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
    rank: 'row_num',
    amount: 'row_num'
  }
  sorter.value =
    map[sorterInfo.columnKey] +
    ',' +
    (sorterInfo.order === 'descend' ? 'desc' : 'asc')
}
</script>
<template>
  <div class="home-table leaderboard-table">
    <div class="header">
      <span class="title" />
      <div class="right-panel">
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
        :columns="columns"
        :data="data?.items"
        :pagination="{ page: pageNo, pageSize: 20, pageSlot: 5, itemCount: Number(data?.totalCount ?? 0), onUpdatePage: (page: number) => pageNo = page, prefix ({ itemCount }) {
          return `Total ${itemCount}`
        }}"
        :bordered="false"
        :loading="pending"
        :remote="true"
        size="large"
        :scroll-x="columns.reduce((sum,item) => ((item as any).width ?? 0) + sum,0).toString()"
        @update:sorter="handleUpdateSorter"
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

:deep(.n-data-table-td__ellipsis) {
  color: $primary;
}
@include phone {
  :deep(.n-data-table-wrapper) {
    overflow-x: scroll;
  }
}
:deep(.n-data-table-base-table) {
  min-width: 1000px;
}

.leaderboard-table {
  :deep(.n-data-table-base-table) {
    min-width: auto;
  }
}

:deep(.n-pagination-prefix) {
  color: $onBackground;
}
.home-table {
  margin-top: 47px;
  @include maxWidth();

  &.leaderboard-table {
    width: min(100%, 800px);
  }

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
