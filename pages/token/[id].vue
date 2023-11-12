<script setup lang="ts">
const route = useRoute()
const { api } = useApi()

const inscriptionNumber = computed(() => {
  return route.params.id as string
})
const { data, pending } = await useAsyncData(
  'orc20TokenInfoDetail',
  () =>
    api.orc20TokenInfos({
      pageNo: 1,
      pageSize: 1,
      inscription: inscriptionNumber.value
    }),
  {
    watch: [inscriptionNumber],
    server: false
  }
)

const orc20TokenInfo = computed(() => {
  return data.value?.items[0]
})
</script>

<template>
  <div class="token-detail-page">
    <token-progress v-if="orc20TokenInfo" :token-info="orc20TokenInfo" />
    <token-overview :token-info="orc20TokenInfo" :pending="pending" />
    <token-table
      :inscription-number="inscriptionNumber"
      :token-info="orc20TokenInfo"
    />
  </div>
</template>

<style lang="scss" scoped>
.token-detail-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
  padding-top: 100px;
}
</style>
