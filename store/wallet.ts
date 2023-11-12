import { defineStore } from 'pinia'

export interface ConnectedWallet {
  label: string
  icon: string
  chain: string
  accounts: { address: string }[]
  provider: any
  chainId?: string
}

interface WalletState {
  evmWallets: ConnectedWallet[]
  activeEvmWallet?: ConnectedWallet
  bitcoinWallets: ConnectedWallet[]
  activeBitcoinWallet?: ConnectedWallet
}

export const useWallet = defineStore('wallet', {
  state: (): WalletState => ({
    evmWallets: [],
    activeEvmWallet: undefined,
    bitcoinWallets: [],
    activeBitcoinWallet: undefined
  }),
  actions: {
    addEvmWallet(wallet?: ConnectedWallet) {
      if (wallet) {
        this.evmWallets = this.evmWallets.filter(
          (w) => w.label !== wallet.label
        )
        this.evmWallets.push(wallet)
        if (
          this.activeEvmWallet?.label === wallet.label ||
          !this.activeEvmWallet
        ) {
          this.activeEvmWallet = wallet
        }
      }
    },
    removeEvmWallet(label: string) {
      this.evmWallets = this.evmWallets.filter((w) => w.label !== label)
      if (label === this.activeEvmWallet?.label) {
        if (this.evmWallets.length > 0) {
          this.activeEvmWallet = this.evmWallets[0]
        } else {
          this.activeEvmWallet = undefined
        }
      }
    },
    setActiveEvmWallet(wallet?: ConnectedWallet) {
      this.activeEvmWallet = wallet
    },
    addBitcoinWallet(wallet?: ConnectedWallet) {
      if (wallet) {
        this.bitcoinWallets = this.bitcoinWallets.filter(
          (w) => w.label !== wallet.label
        )
        this.bitcoinWallets.push(wallet)
        if (
          this.activeBitcoinWallet?.label === wallet.label ||
          !this.activeBitcoinWallet
        ) {
          this.activeBitcoinWallet = wallet
        }
      }
    },
    removeBitcoinWallet(label: string) {
      this.bitcoinWallets = this.bitcoinWallets.filter((w) => w.label !== label)
      if (label === this.activeBitcoinWallet?.label) {
        if (this.bitcoinWallets.length > 0) {
          this.activeBitcoinWallet = this.bitcoinWallets[0]
        } else {
          this.activeBitcoinWallet = undefined
        }
      }
    },
    setActiveBitcoinWallet(wallet?: ConnectedWallet) {
      this.activeBitcoinWallet = wallet
    },
    setActiveWallet(wallet?: ConnectedWallet) {
      this.activeEvmWallet = wallet
    },
    clear() {
      this.evmWallets = []
      this.activeEvmWallet = undefined
    }
  }
})
