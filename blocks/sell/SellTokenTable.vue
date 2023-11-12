<script setup lang="ts">
const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  }
})
const route = useRoute()
const { api } = useApi()
const orderID = computed<string>(() => {
  return route.params.id.toString()
})
const { data } = await useAsyncData(
  'sellToken',
  () => api.orc20SellOrderDetail({ sellOrderId: orderID.value }),
  {
    watch: [orderID],
    server: false,
    immediate: true
  }
)
const tabs = computed(() => {
  const tabs = [
    {
      name: 'Buyer List',
      key: 'buyer'
    }
    // {
    //   name: 'Tx History',
    //   key: 'txHistory'
    // },
  ]
  if (data.value?.sellOrderHasWhiteListed === 'yes') {
    tabs.push({
      name: 'Whitelist',
      key: 'whitelist'
    })
  }
  return tabs
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
    <sell-token-buyer-list
      v-show="activeTab === 'buyer'"
      :inscription-number="props.inscriptionNumber"
    />
    <!-- <sell-token-tx-history
      v-show="activeTab === 'txHistory'"
      :inscription-number="props.inscriptionNumber"
    /> -->
    <sell-token-whitelist
      v-show="activeTab === 'whitelist'"
      :inscription-number="props.inscriptionNumber"
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
