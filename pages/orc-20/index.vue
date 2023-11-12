<script lang="ts" setup></script>
<template>
  <div class="homepage">
    <HomeSlogon />
    <HomeSearch />
    <HomeTable />
  </div>
</template>

<style lang="scss" scoped>
.homepage {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
}
</style>
