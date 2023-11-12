<script lang="ts" setup>
import { useMessage } from 'naive-ui'
import { useWallet } from '~/store/wallet'

const walletStore = useWallet()
const props = defineProps({
  connectWallet: {
    type: Object,
    required: true
  }
})
const message = useMessage()
const wallet = computed(() => props.connectWallet)
function copy() {
  try {
    copyText(props.connectWallet.accounts[0].address)
    message.success('Copied')
  } catch {
    message.error('Copy failed')
  }
}
function disconnectWallet() {
  walletStore.removeBitcoinWallet('unisat')
  localStorage.removeItem('connected-wallet')
}
</script>

<template>
  <div class="wallet-card">
    <div class="status active" />
    <template v-if="wallet.icon">
      <img
        v-if="wallet.label === 'unisat'"
        class="icon"
        src="~/assets/images/unisat.png"
      />
      <img
        v-else-if="wallet.label === 'gosat'"
        class="icon"
        src="~/assets/images/gosat.png"
      />
      <div v-else class="icon" v-html="wallet.icon" />
    </template>
    <div class="info">
      <div class="name">
        {{ wallet.label.toUpperCase() }}
      </div>
      <div class="address" @click.stop="copy">
        {{ shortAddress(wallet.accounts[0].address, 8) }}
        <copy-icon :size="14" />
      </div>
    </div>
    <div class="disconnect" @click="disconnectWallet">Disconnect</div>
  </div>
</template>

<style lang="scss" scoped>
.wallet-card {
  height: 60px;
  width: 100%;
  margin-bottom: 15px;
  border-radius: 4px;
  padding: 0 14px;
  background-color: $background;
  @include flexR;
  align-items: center;
  position: relative;
  .status {
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background: $secondary;
    margin-right: 10px;
    &.active {
      background: green;
    }
  }
  .icon {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    margin-right: 6px;
  }
  .info {
    @include flexC;
    align-items: flex-start;
    margin-left: 10px;
    color: $onSurface;
    .address {
      cursor: pointer;
      margin-top: 4px;
      font-size: 12px;
      @include flexRc;
      svg {
        margin: 0px 0 0 4px;
      }
    }
  }
  .disconnect {
    position: absolute;
    right: 10px;
    cursor: pointer;
    color: #fca121;
  }
}
</style>
