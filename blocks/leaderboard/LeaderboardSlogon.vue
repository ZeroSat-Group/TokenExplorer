<script setup lang="ts"></script>

<template>
  <div class="slogon">
    <span class="title">
      Enter the
      <nuxt-link class="orc20" to="/leaderboard"> Leaderboard </nuxt-link>
      and Win
      <span class="orc20"> Prizes </span>
    </span>
    <span class="subtitle"> Search Addresses To Check Your Ranking </span>
  </div>
</template>

<style scoped lang="scss">
.slogon {
  @include maxWidth;
  margin-top: 125px;
  @include flexCc;

  @include phone {
    align-items: center;
  }

  .title {
    font-size: 42px;
    font-weight: 700;
    line-height: 50px;
    letter-spacing: 0em;
    color: $onBackground;
    user-select: none;

    @include phone {
      text-align: center;
    }

    .orc20 {
      color: $primary;
      cursor: pointer;
    }
  }

  .subtitle {
    margin-top: 5px;
    font-size: 20px;
    font-weight: 200;
    line-height: 24px;
    letter-spacing: 0em;
    color: $onBackground;
    text-align: center;
  }
}
</style>
