<script lang="ts" setup>
const route = useRoute()

const orderID = computed<string>(() => {
  return route.params.id.toString()
})
</script>

<template>
  <div class="sell-token-page">
    <SellTokenDetail />
    <SellTokenTable :inscription-number="orderID" />
  </div>
</template>

<style scoped lang="scss">
.sell-token-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
  padding-top: 100px;
}
</style>
