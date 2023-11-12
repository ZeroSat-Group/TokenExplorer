<script lang="ts" setup>
import dayjs from 'dayjs'
import { NPopover, NEmpty, NSkeleton } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { shortAddress, formatNumber } from '~/utils/index'
const tabs = [
  {
    name: 'WEEKLY',
    key: 'weekly'
  },
  {
    name: 'MONTHLY',
    key: 'monthly'
  },
  {
    name: 'ALL-TIME',
    key: 'allTime'
  }
]
const inscriber = useInscriber()

const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
const activeTab = ref(tabs[0].key)

const activerTabInfo = computed(() => {
  return tabs.find((item) => item.key === activeTab.value)
})

const getDays = computed<string | undefined>(() => {
  switch (activeTab.value) {
    case 'weekly':
      return dayjs().day().toString()
    case 'monthly':
      return dayjs().date().toString()
  }

  return undefined
})
const { data, pending, refresh } = useAsyncData(
  () =>
    api.inscribeInscribeRankingList({
      pageNo: 1,
      pageSize: 10,
      days: getDays.value
    }),
  {
    server: false
  }
)
</script>

<template>
  <div class="inscribe-tops">
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="
          () => {
            activeTab = tab.key
            refresh()
          }
        "
      >
        {{ tab.name }}
      </div>
    </div>

    <div class="tabs-content">
      <div class="tips">
        <div class="tip">
          <span style="margin-right: 6px">
            {{ `${activerTabInfo?.name ?? ''} TOP INSCRIBERS` }}
          </span>
          <NPopover>
            <template #trigger>
              <InfoIcon style="cursor: pointer; outline: none" :size="14" />
            </template>
            <span
              >The Rankings are calculated by the accumulated Services Fees +
              Fees <br />by Size paid and confirmed onchain.</span
            >
          </NPopover>
        </div>
        <nuxt-link to="/leaderboard">
          <JumpIcon :size="16" />
        </nuxt-link>
      </div>

      <div class="list">
        <template v-if="pending">
          <div v-for="i in 5" :key="i" class="list-item">
            <n-skeleton height="20px" width="50%" :sharp="false" />
            <n-skeleton height="20px" width="20%" :sharp="false" />
          </div>
        </template>
        <NEmpty
          v-else-if="!pending && !data?.items.length"
          style="margin-top: 40px"
        />
        <div
          v-for="(item, index) in data?.items ?? []"
          v-else
          :key="index"
          class="list-item"
        >
          <span>
            <span class="index">{{ `#${index + 1}` }}</span>
            <!-- <span class="address">
              </span> -->
            <nuxt-link
              class="address"
              :to="`/leaderboard/address/${item.address}`"
            >
              {{ shortAddress(item.address ?? '') }}
            </nuxt-link>
          </span>
          <span class="amount">{{ formatNumber(item.amount ?? '0', 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inscribe-tops {
  width: auto;
  margin-top: 48px;
  // height: 100px;
  border-radius: 6px;
  overflow: hidden;
  user-select: none;

  @include phone {
    width: 100%;
    margin-top: 24px;
  }

  .tabs {
    @include flexR;

    .tab {
      height: 36px;
      padding: 10px 18px;
      cursor: pointer;
      color: $onBackground;
      font-size: 16px;
      font-weight: 500;
      line-height: 21px;
      letter-spacing: 0em;
      text-align: center;
      border: 1px solid rgba(36, 36, 36, 1);
      border-bottom: none;
      transition: 0.3s;

      @include phone {
        font-size: 14px;
        padding: 10px 12px;
      }

      &:hover,
      &.active {
        border-color: $primary;
        z-index: 5;
        background-color: #1a1e1d;
        transition: 0.3s;
      }
    }

    :first-child {
      border-top-left-radius: 6px;
    }

    :last-child {
      border-top-right-radius: 6px;
    }

    :not(:first-child) {
      margin-left: -1px;
    }
  }

  .tabs-content {
    width: 100%;
    padding: 0 20px;
    background: linear-gradient(0deg, #1a1e1d, #1a1e1d),
      linear-gradient(0deg, #242424, #242424);
    border: 1px solid rgba(36, 36, 36, 1);

    .tips {
      width: 100%;
      padding: 10px 0;
      border-bottom: 1px solid rgba(36, 36, 36, 1);
      @include flexRsb;

      span {
        display: inline-flex;
      }

      .tip {
        color: $onBackground;
        @include flexRc;
        justify-content: flex-start;
      }
    }

    .list {
      width: 100%;
      padding-top: 6px;
      min-height: 220px;

      .list-item {
        padding: 10px 0;
        @include flexRsb;

        .address {
          color: $primary;
          font-size: 14px;
          font-weight: 500;
          margin-left: 10px;
        }

        .amount,
        .index {
          color: $onBackground;
          font-size: 14px;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
