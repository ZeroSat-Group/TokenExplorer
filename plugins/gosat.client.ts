import { ConnectedWallet, useWallet } from '~/store/wallet'

const gosatPlugingin = defineNuxtPlugin(() => {
  const store = useWallet()
  // const { testnet } = useInscriber()
  const gosat = (window as any).gosat
  if (!gosat) {
    return
  }
  async function connectgosatWallet() {
    try {
      const accounts = await gosat.getAccounts()
      if (accounts && accounts.length > 0) {
        const wallet: ConnectedWallet = {
          chain: 'bitcoin',
          label: 'gosat',
          icon: 'gosat',
          accounts: [{ address: accounts[0] }],
          provider: gosat
        }
        store.addBitcoinWallet(Object.freeze(wallet))
        // if (testnet) {
        //   gosat.switchNetwork('testnet')
        // } else {
        //   gosat.switchNetwork('livenet')
        // }
      }
    } catch (error) {}
  }
  const connected = localStorage.getItem('connected-wallet')
  if (connected === 'gosat') {
    connectgosatWallet()
  }

  gosat.on('accountsChanged', (accounts: string[]) => {
    if (accounts && accounts.length > 0) {
      const wallet: ConnectedWallet = {
        chain: 'bitcoin',
        label: 'gosat',
        icon: gosat.icon,
        accounts: [{ address: accounts[0] }],
        provider: gosat
      }
      store.addBitcoinWallet(Object.freeze(wallet))
    } else {
      store.removeBitcoinWallet('gosat')
    }
  })

  return {
    provide: {
      gosat
    }
  }
})

export default gosatPlugingin
