import { ConnectedWallet, useWallet } from '~/store/wallet'

const unisatPlugingin = defineNuxtPlugin(() => {
  const store = useWallet()
  // const { testnet } = useInscriber()
  const unisat = (window as any).unisat
  if (!unisat) {
    return
  }
  async function connectUnisatWallet() {
    try {
      const accounts = await unisat.getAccounts()
      if (accounts && accounts.length > 0) {
        const wallet: ConnectedWallet = {
          chain: 'bitcoin',
          label: 'unisat',
          icon: 'unisat',
          accounts: [{ address: accounts[0] }],
          provider: unisat
        }
        store.addBitcoinWallet(Object.freeze(wallet))
        // if (testnet) {
        //   unisat.switchNetwork('testnet')
        // } else {
        //   unisat.switchNetwork('livenet')
        // }
      }
    } catch (error) {}
  }
  const connected = localStorage.getItem('connected-wallet')
  if (connected === 'unisat') {
    connectUnisatWallet()
  }

  unisat.on('accountsChanged', (accounts: string[]) => {
    if (accounts && accounts.length > 0) {
      const wallet: ConnectedWallet = {
        chain: 'bitcoin',
        label: 'unisat',
        icon: unisat.icon,
        accounts: [{ address: accounts[0] }],
        provider: unisat
      }
      store.addBitcoinWallet(Object.freeze(wallet))
    } else {
      store.removeBitcoinWallet('unisat')
    }
  })

  return {
    provide: {
      unisat
    }
  }
})

export default unisatPlugingin
