<script setup lang="ts">
import { useWallet } from '~/store/wallet'
const walletStore = useWallet()

const activeEvmWallet = computed(() => !!walletStore.activeEvmWallet)
</script>

<template>
  <basic-dialog name="wallet-panel-dialog" :fullscreen="true">
    <div class="wallet-panel" :class="{ expand: !activeEvmWallet }">
      <div v-show="!activeEvmWallet" id="sbtauth-login" ref="sbtauth-login" />
    </div>
  </basic-dialog>
</template>

<style scoped lang="scss">
.wallet-panel {
  @include flexC();
  align-items: center;
  margin-top: 20px;
  &.expand {
    min-height: 450px;
  }

  .top-tab-bar {
    width: 200px;
  }

  #sbtauth-login {
    height: 400px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }

  .connect-button-list {
    padding: 0px 17px 17px 17px;
    box-sizing: border-box;
    width: 100%;

    @include phone() {
      padding: 35px 0px 21px 0px;
    }

    .wallet-type-header {
      @include flexRsb;
      align-items: center;
      color: $onBackground;

      .wallet-type {
        font-size: 16px;
        font-weight: 600;
        margin: 12px 0;
      }

      .disconnect {
        font-size: 12px;
        cursor: pointer;
      }
    }

    .connect-button {
      height: 60px;
      width: 100%;
      margin-bottom: 15px;
      border-radius: 4px;
      padding: 0 14px;
      background-color: $background;
      cursor: pointer;

      &:hover {
        background-color: $secondary;
      }

      @include flexR();

      .wallet-icon {
        height: 40px;
        width: 40px;
        margin-right: 10px;
        @include flexRc();
      }

      .wallet-label {
        width: 100%;
        text-align: left;
        font-size: 14px;
        font-weight: 500;
        color: $onSecondary;
      }

      .loader {
        height: 40px;
        width: 40px;
        @include flexRc();
      }
    }
  }
}
</style>
