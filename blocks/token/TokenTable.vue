<script setup lang="ts">
import { Orc20TokenInfos } from '~/types/swagger'

const props = defineProps<{
  inscriptionNumber: string
  tokenInfo?: Orc20TokenInfos['items'][0]
}>()

const tabs = computed(() => {
  return [
    {
      name: 'Holders',
      key: 'holders'
    },
    {
      name: 'Transactions',
      key: 'transactions'
    }
  ]
})
const activeTab = ref(tabs.value[0].key)
</script>
<template>
  <div class="token-table">
    <div class="tabs">
      <CustomTabs
        :tabs="tabs"
        :active-tab="activeTab"
        :border="true"
        @select="(value: string) => activeTab = value"
      />
    </div>
    <token-history
      v-show="activeTab === 'transactions'"
      :inscription-number="props.inscriptionNumber"
    />
    <token-holders
      v-show="activeTab === 'holders'"
      :inscription-number="props.inscriptionNumber"
      :token-info="tokenInfo"
    />
  </div>
</template>

<style scoped lang="scss">
.token-table {
  border: 1px solid #242424;
  border-radius: 6px;
  background-color: rgba(26, 30, 29, 0.6);
  overflow: hidden;
  padding-bottom: 10px;
  @include maxWidth;
  .tabs {
    padding: 16px 36px;
    @include flexR;
    @include phone {
      margin-bottom: 20px;
      margin-top: 20px;
      width: calc(100vw - 32px);
    }
  }
}
</style>
