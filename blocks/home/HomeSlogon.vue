<script setup lang="ts">
const { protocol } = useApi()
function toProtocolWebsite() {
  let url = ''
  switch (protocol) {
    case 'orc-20':
      url = 'https://docs.orc20.org/'
      break
    case 'orc-cash':
      url = 'https://docs.orc.cash/'
      break
  }
  url && window.open(url, '_blank')
}
const subLabel = computed(() => {
  switch (protocol) {
    case 'orc-20':
      return 'ORC-20'
    default:
      return 'ORC-CASH'
  }
})
</script>

<template>
  <div class="slogon">
    <span class="title">
      Search
      <span class="orc20" @click="toProtocolWebsite">
        {{ subLabel }}
      </span>
      Balances by Address
    </span>
    <span class="subtitle">
      Check Transaction History of Every Deploy, Mint, Send and Upgrade
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
