<script setup lang="ts">
import { NSkeleton, NModal, NCard } from 'naive-ui'
import { Orc20TokenInfo } from '~/types/api'
import TokenHistoryDialog from '~/components/dialogs/TokenHistoryDialog.vue'
import { formatTime, formatNumber } from '~/utils'
import { Orc20TokenInfos } from '~/types/swagger'

const { protocol } = useApi()

const showModal = ref(false)
const props = defineProps<{
  tokenInfo?: Orc20TokenInfos['items'][0]
  pending: boolean
}>()

const orc20TokenInfo = computed(() => {
  return props.tokenInfo
})

const infos: { name: string; key: keyof Orc20TokenInfo | undefined }[] = [
  {
    name: 'Inscription ID',
    key: 'tokenInfoInscriptionID'
  },
  {
    name: 'Inscription Number',
    key: 'tokenInfoInscriptionNumber'
  },
  {
    name: 'Supply',
    key: 'tokenInfoMaxNumber'
  },
  {
    name: 'Minted',
    key: 'tokenInfoTotalMinted'
  },
  {
    name: 'Limit per mint',
    key: 'tokenInfoLimitNumber'
  },
  {
    name: 'Decimal',
    key: 'tokenInfoTokenDecimal'
  },
  {
    name: 'Deploy By',
    key: 'tokenInfoDeployer'
  },
  {
    name: 'Deploy Time',
    key: 'tokenInfoDeployTimes'
  },
  {
    name: 'Inscription Number Start',
    key: 'tokenInfoInscriptionNumber'
  },
  {
    name: 'Inscription Number End',
    key: 'tokenInfoInscriptionNumberEnd'
  },
  {
    name: 'Holders',
    key: 'tokenInfoHolders'
  },
  {
    name: 'Total Transactions',
    key: 'tokenInfoTransactions'
  },
  {
    name: 'Upgradable',
    key: 'tokenInfoUpgradable'
  },
  {
    name: 'History',
    key: undefined
  }
]
if (protocol === 'orc-cash') {
  infos.splice(1, 0, {
    name: 'Protocol',
    // @ts-ignore
    key: 'tokenInfoProtocol'
  })
}
</script>

<template>
  <div class="token-overview">
    <div class="title">Overview</div>
    <div v-for="item in infos" :key="item.key" class="info-panel">
      <span class="name">{{ item.name }}:</span>
      <div v-if="!orc20TokenInfo || pending" class="data">
        <n-skeleton
          height="14px"
          :width="`${60 * Math.random()}%`"
          :sharp="false"
        />
      </div>
      <div v-else-if="item.name === 'Upgradable'" class="data">
        {{ orc20TokenInfo.tokenInfoUpgradable ? 'Yes' : 'No' }}
      </div>
      <div
        v-else-if="item.name === 'History'"
        class="data history"
        @click="showModal = true"
      >
        View
      </div>
      <div v-else-if="item.name === 'Deploy Time'" class="data">
        {{ formatTime(orc20TokenInfo.tokenInfoDeployTimes) }}
      </div>
      <div v-else-if="item.name === 'Minted'" class="data">
        {{ formatNumber(orc20TokenInfo.tokenInfoTotalMinted ?? 0, 0) }}
      </div>
      <div
        v-else-if="item.name.includes('Inscription Number Start')"
        class="data"
      >
        {{ '#' + orc20TokenInfo.tokenInfoInscriptionNumber }}
      </div>
      <div
        v-else-if="item.name.includes('Inscription Number End')"
        class="data"
      >
        {{ '#' + (orc20TokenInfo.tokenInfoInscriptionNumberEnd ?? '') }}
      </div>
      <div v-else-if="item.name === 'Inscription Number'" class="data">
        {{ '#' + orc20TokenInfo.tokenInfoInscriptionNumber }}
      </div>
      <div v-else-if="item.name === 'Deploy By'" class="data">
        <bitcoin-address
          :address="orc20TokenInfo.tokenInfoDeployer"
          compact="large"
        />
      </div>
      <div v-else-if="item.name === 'Inscription ID'" class="data">
        <bitcoin-address
          :address="orc20TokenInfo.tokenInfoInscriptionID"
          :is-inscription="true"
          compact="medium"
        />
      </div>
      <div v-else-if="item.name === 'Supply'" class="data">
        {{ formatNumber(orc20TokenInfo.tokenInfoMaxNumber ?? '', 0) }}
      </div>
      <div v-else-if="item.name === 'Limit per mint'" class="data">
        {{ formatNumber(orc20TokenInfo.tokenInfoLimitNumber ?? '', 0) }}
      </div>
      <div v-else-if="item.name === 'Holders'" class="data">
        {{ formatNumber(orc20TokenInfo.tokenInfoHolders ?? '', -1) }}
      </div>
      <div v-else-if="item.name === 'Total Transactions'" class="data">
        {{ formatNumber(orc20TokenInfo.tokenInfoTransactions ?? '', -1) }}
      </div>
      <div v-else-if="item.name === 'Protocol'" class="data">
        {{ orc20TokenInfo.tokenInfoProtocol?.toUpperCase() ?? 'ORC-CASH' }}
      </div>
      <span v-else class="data">{{ orc20TokenInfo[item.key!] }}</span>
    </div>
    <n-modal v-model:show="showModal" :block-scroll="false">
      <n-card
        style="width: 600px; padding: 0px; position: relative"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <close-icon
          class="modal-close-icon"
          style="position: absolute; right: 19px; top: 17px; cursor: pointer"
          @click="showModal = false"
        />
        <token-history-dialog
          :inscription-number="orc20TokenInfo!.tokenInfoInscriptionNumber"
        />
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped lang="scss">
.token-overview {
  @include maxWidth;
  padding: 24px;
  margin: 0px 0 20px 0;
  border: 1px solid #242424;
  border-radius: 6px;
  background-color: rgba(26, 30, 29, 0.6);
  .title {
    font-size: 20px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    color: $onBackground;
    margin-bottom: 24px;
  }
  .progress {
    margin-bottom: 24px;
  }

  .info-panel {
    display: grid;
    grid-template-columns: 1fr 4fr;
    grid-gap: 18px;
    color: $onBackground;
    margin-bottom: 20px;
    @include phone {
      grid-template-columns: 2fr 5fr;
    }
    .name {
      font-size: 14px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: right;
      opacity: 0.4;
    }

    .data {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0em;
      text-align: left;
    }
    .history {
      cursor: pointer;
      color: $primary;
      text-decoration: underline;
    }
  }
}
</style>
