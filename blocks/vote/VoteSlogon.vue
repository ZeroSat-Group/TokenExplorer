<script setup lang="ts">
function toProtocolWebsite() {
  const url = 'https://docs.orc.cash/'
  url && window.open(url, '_blank')
}
</script>

<template>
  <div class="slogon">
    <span class="title">
      <span class="orc20" @click="toProtocolWebsite"> ORC-CASH </span>
      Vote Proposals
    </span>
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
