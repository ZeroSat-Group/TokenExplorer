<script setup lang="ts">
import { NEmpty } from 'naive-ui'
const inscriptionNumber = ref<string | undefined>(undefined)
const activeTab = ref('all')
const tokenType = ref('holding')

const tabs = [
  {
    name: 'All',
    key: 'all'
  },
  {
    name: 'In-Progress',
    key: 'progress'
  },
  {
    name: 'Completed',
    key: 'completed'
  }
]

const changeTab = (value: string) => {
  activeTab.value = value
  inscriptionNumber.value = undefined
}

const changeType = (value: string) => {
  tokenType.value = value
  inscriptionNumber.value = undefined
}
</script>

<template>
  <div class="address-page">
    <AddressSearch @select="changeType" />
    <div v-if="tokenType === 'deployed'" class="tabs">
      <div class="tabs-selector">
        <CustomTabs :tabs="tabs" :active-tab="activeTab" @select="changeTab" />
      </div>
    </div>
    <n-empty
      v-if="inscriptionNumber === ''"
      class="result-empty"
      description="No token found"
    />
    <div v-show="inscriptionNumber !== ''" class="result">
      <AddressTokens
        v-if="tokenType === 'holding'"
        @select="(value) => (inscriptionNumber = value?.toString())"
      />
      <AddressDeployedTokens
        v-else
        :active-tab="activeTab"
        @select="(value) => (inscriptionNumber = value)"
      />
      <AddressTable
        v-if="tokenType === 'holding' && inscriptionNumber"
        :inscription-number="inscriptionNumber"
      />
      <AddressTokenDetail
        v-else-if="inscriptionNumber"
        v-sticky-bottom="20"
        :inscription-number="inscriptionNumber"
      />
      <!-- <div v-else /> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
  padding-top: 96px;
  margin-right: 24px;
  .tabs {
    margin-top: 40px;
    @include maxWidth();
    @include flexR;
    .tabs-selector {
      padding: 5px 8px;
      background: $surface;
      padding: 5px 8px;
      border-radius: 6px;
    }
  }
  .result-empty {
    width: 100%;
    margin-top: 60px;
    margin-left: auto;
    margin-right: auto;
  }
  .result {
    @include maxWidth();
    margin-top: 24px;
    @include flexR;
    align-items: flex-start;
    @include phone {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
