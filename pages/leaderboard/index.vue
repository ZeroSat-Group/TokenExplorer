<script lang="ts" setup></script>

<template>
  <div class="leaderboard-page">
    <LeaderboardSlogon />
    <LeaderboardSearch />
    <LeaderboardTable />
  </div>
</template>

<style scoped lang="scss">
.leaderboard-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
}
</style>
