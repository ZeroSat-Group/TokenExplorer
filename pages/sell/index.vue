<script lang="ts" setup></script>

<template>
  <div class="sell-page">
    <SellSlogon />
    <SellSearch />
    <SellTable />
  </div>
</template>

<style lang="scss" scoped>
.sell-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
}
</style>
