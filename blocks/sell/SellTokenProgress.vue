<script lang="ts" setup>
import { useThemeVars, NProgress } from 'naive-ui'
import { Orc20SellOrderDetail } from '~/types/swagger'

defineProps<{
  token: Orc20SellOrderDetail
}>()
const themeVars = useThemeVars()
</script>

<template>
  <div class="token-progress">
    <div class="title-panel">
      <div>
        <nuxt-link
          class="title"
          :to="`/token/${token.sellOrderTokenInscriptionId}`"
        >
          {{ token.sellOrderTicker }}
        </nuxt-link>
        <span class="token-id">
          Token ID #
          {{ token.sellOrderTokenId }}
        </span>
      </div>
      <sell-buy-button v-if="token.sellOrderStatus === 0" :token-info="token" />
      <div v-else-if="token.sellOrderStatus === 2">Expried</div>
      <div v-else>Completed</div>
    </div>
    <n-progress
      type="line"
      :color="themeVars.warningColor"
      :percentage="
        Number(formatNumber(Number(token.sellOrderProgress ?? 0), 2))
      "
    />
  </div>
</template>

<style scoped lang="scss">
.token-progress {
  @include maxWidth;
  margin-bottom: 30px;
  @include flexC;
  align-items: flex-start;
  color: $onBackground;

  .title-panel {
    @include flexR;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 20px;

    .submit-button {
      height: 30px;
      color: #000;

      .loading-icon {
        height: 20px;
        width: 20px;
      }
    }

    .title {
      color: $primary;
      margin-right: 20px;
      font-size: 30px;
      line-height: 30px;
      font-weight: 500;
      letter-spacing: 0em;
      text-align: left;
    }

    .token-id {
      font-size: 14px;
      line-height: 14px;
      margin-bottom: 2px;
      font-weight: 400;
      letter-spacing: 0em;
    }
  }
}
</style>
