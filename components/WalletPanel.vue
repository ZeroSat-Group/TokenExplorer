<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { ConnectedWallet, useWallet } from '~/store/wallet'
const { $unisat, $gosat } = useNuxtApp()
const wallet = useWallet()
const loading = ref('')
const message = useMessage()
async function connectWallet(label: string) {
  loading.value = label
  if (!(window as any)[label]) {
    if (label === 'unisat') {
      window.open('https://unisat.io/', '_blank')
    } else if (label === 'gosat') {
      window.open('https://gosat.io/', '_blank')
    }
    loading.value = ''
    return
  }
  try {
    const provider = label === 'gosat' ? $gosat : $unisat
    let accounts = await provider.getAccounts()
    if (!accounts || accounts.length === 0) {
      accounts = await provider.requestAccounts()
      localStorage.setItem('connected-wallet', label)
      await provider.switchNetwork('livenet')
    }
    const bitcoinWallet: ConnectedWallet = {
      chain: 'bitcoin',
      label,
      icon: 'label',
      accounts: [{ address: accounts[0] }],
      provider
    }
    wallet.addBitcoinWallet(Object.freeze(bitcoinWallet))
    localStorage.setItem('connected-wallet', label)
  } catch (error) {
    if (error instanceof Error) {
      message.info(error.message)
    }
  } finally {
    loading.value = ''
  }
}
</script>
<template>
  <div>
    <div class="title">Connect Wallet</div>
    <wallet-card
      v-if="wallet.activeBitcoinWallet"
      :connect-wallet="wallet.activeBitcoinWallet"
    />
    <div v-else class="connect-wallet">
      <div class="connect-wallet-button" @click="connectWallet('gosat')">
        <img class="wallet-icon unisat-icon" src="~/assets/images/gosat.png" />
        <span class="wallet-label">GoSat Wallet</span>
        <div v-if="loading === 'gosat'" class="loader">
          <spinner-loader :size="20" />
        </div>
      </div>
      <div class="connect-wallet-button" @click="connectWallet('unisat')">
        <img class="wallet-icon unisat-icon" src="~/assets/images/unisat.png" />
        <span class="wallet-label">Unisat Wallet</span>
        <div v-if="loading === 'unisat'" class="loader">
          <spinner-loader :size="20" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 500;
  line-height: 23px;
  letter-spacing: 0em;
  text-align: center;
  color: $onBackground;
}

.connect-wallet-button {
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

  .unisat-icon {
    height: 30px;
    width: 30px;
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
</style>
