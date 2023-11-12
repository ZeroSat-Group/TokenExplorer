<script lang="ts" setup></script>

<template>
  <div class="leaderboard-address">
    <LeaderboardSlogon />
    <LeaderboardSearch />
    <LeaderboardAddressTable />
  </div>
</template>

<style scoped lang="scss">
.leaderboard-address {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
}
</style>
