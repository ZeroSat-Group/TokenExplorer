<script lang="ts" setup>
import { NModal, NButton, NCard, NDropdown } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { useWallet } from '~/store/wallet'
import { shortAddress } from '~/utils'
import InscribeIcon from '~/components/icons/InscribeIcon.vue'

const wallet = useWallet()
const route = useRoute()
const router = useRouter()
const inscriber = useInscriber()
const showMenu = ref(false)
const { $getRouteBaseName, _route } = useNuxtApp()

const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
watch(
  () => route.path,
  (_) => {
    showMenu.value = false
    document?.body?.classList.remove('stop-scrolling')
  },
  { deep: true }
)
const options = [
  {
    label: 'My Wallet',
    key: 'my_wallet'
  },
  {
    label: 'Disconnect',
    key: 'disconnect'
  }
]
// function changeMode(orcCash: boolean) {
//   if (orcCash) {
//     if (route.path.includes('token') || route.path.includes('inscribe')) {
//       router.replace('/')
//       return
//     }
//     let path = route.path.replace('/orc-20', '')
//     if (path === '') {
//       path = '/'
//     }
//     router.replace(path)
//   } else {
//     if (route.path.includes('orc-20')) {
//       return
//     }
//     if (route.path.includes('token') || route.path.includes('inscribe')) {
//       router.replace('/orc-20')
//       return
//     }
//     const path = '/orc-20' + route.path
//     router.replace(path)
//   }
// }

const navs = [
  {
    id: 'orc-cash',
    tags: ['index', 'token', 'address'],
    title: 'ORC-CASH',
    path: '/'
  },
  // {
  //   id: 'orc-20',
  //   tags: ['orc'],
  //   title: 'ORC-20',
  //   path: '/orc-20'
  // },
  // {
  //   id: 'inscribe',
  //   tags: ['inscribe'],
  //   title: 'INSCRIBE',
  //   path: '/inscribe',
  //   icon: InscribeIcon
  // },
  {
    id: 'sell',
    tags: ['sell'],
    title: 'SELL ORDERS',
    path: '/sell'
  },
  {
    id: 'vote',
    tags: ['vote'],
    title: 'VOTE',
    path: '/vote'
  }
]

const currentNav = computed(() => {
  return $getRouteBaseName(_route)?.split('-')[0]
})
// const isInscribePage = computed(() => route.path.includes('inscribe'))
const showModal = ref(false)
const address = computed(() => {
  return wallet.activeBitcoinWallet?.accounts[0]
})
function disconnectWallet() {
  const label = wallet.activeBitcoinWallet?.label
  if (!label) {
    return
  }
  wallet.removeBitcoinWallet(label)
  localStorage.removeItem('connected-wallet')
}
function handleSelect(key: string) {
  if (key === 'my_wallet') {
    const path = '/address/' + address.value?.address
    router.push(path)
  } else if (key === 'disconnect') {
    disconnectWallet()
  }
}
const { data: ogData } = await useAsyncData(
  'checkOG',
  () => {
    if (!wallet.activeBitcoinWallet) {
      return Promise.resolve([])
    }
    return api.inscribeDiscount({
      address: wallet.activeBitcoinWallet!.accounts[0].address,
      data: ''
    })
  },
  {
    server: false,
    lazy: true,
    watch: [address]
  }
)
const isOG = computed(() => {
  return (ogData?.value?.length ?? 0) > 0
})
function toogleMenu() {
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    document.body.classList.add('stop-scrolling')
  } else {
    document.body.classList.remove('stop-scrolling')
  }
}
</script>

<template>
  <div class="layout-header blur" :class="{ fullscreen: showMenu }">
    <div class="left-panel">
      <nuxt-link to="/">
        <div class="logo">
          <img src="~/assets/images/logo.png" alt="Logo" />
        </div>
      </nuxt-link>
      <nuxt-link
        v-for="item in navs"
        :key="item.id"
        class="menu-item"
        :to="item.path"
        :class="{ active: item.tags.includes(currentNav ?? '') }"
      >
        <component :is="item.icon" v-if="item.icon" />
        <span>{{ item.title }}</span>
      </nuxt-link>

      <!-- <div
          class="title orc-cash"
          :class="{ active: !route.path.includes('orc-20') && !isInscribePage }"
          @click="changeMode(true)"
        >
          ORC-CASH
        </div>
        <div
          class="title orc-20"
          :class="{ active: route.path.includes('orc-20') && !isInscribePage }"
          @click="changeMode(false)"
        >
          ORC-20
        </div>
        <nuxt-link
          class="menu-item"
          to="/inscribe"
          :class="{ active: isInscribePage }"
        >
          <inscribe-icon />
          <span>INSCRIBE</span>
        </nuxt-link>
        <nuxt-link
          class="menu-item"
          to="/sell"
          :class="{ active: isInscribePage }"
        >
          <span>SELL ORDERS</span>
        </nuxt-link> -->
      <div class="menu-button" @click="toogleMenu">
        <menu-icon v-if="!showMenu" />
        <close-icon v-else />
      </div>
    </div>
    <div class="right-panel">
      <!-- <langs-switch /> -->
      <div v-if="wallet.activeBitcoinWallet" class="address">
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <div>
            <span v-if="isOG" class="og-badge">OG</span>
            <span>{{
              shortAddress(wallet.activeBitcoinWallet.accounts[0].address)
            }}</span>
          </div>
        </n-dropdown>
      </div>
      <n-button
        v-else
        color="#fca121"
        class="connect-button"
        @click="showModal = true"
      >
        Connect Wallet
      </n-button>
      <n-modal v-model:show="showModal" :block-scroll="false">
        <n-card
          style="width: 400px; padding: 0px; position: relative"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <wallet-panel />
        </n-card>
      </n-modal>
    </div>
    <div class="menu-list" :class="{ show: showMenu }">
      <nuxt-link
        v-for="item in navs"
        :key="item.id"
        class="menu-item"
        :to="item.path"
        :class="{ active: item.tags.includes(currentNav ?? '') }"
      >
        <component :is="item.icon" v-if="item.icon" />
        <span>{{ item.title }}</span>
      </nuxt-link>
      <!-- <div
        class="title orc-cash"
        :class="{ active: !route.path.includes('orc-20') && !isInscribePage }"
        @click="changeMode(true)"
      >
        ORC-CASH
      </div>
      <div
        class="title orc-20"
        :class="{ active: route.path.includes('orc-20') && !isInscribePage }"
        @click="changeMode(false)"
      >
        ORC-20
      </div>
      <nuxt-link
        class="menu-item"
        to="/inscribe"
        :class="{ active: isInscribePage }"
      >
        <inscribe-icon />
        <span>INSCRIBE</span>
      </nuxt-link> -->
      <div v-if="wallet.activeBitcoinWallet" class="address">
        <n-dropdown trigger="hover" :options="options" @select="handleSelect">
          <div>
            <span v-if="isOG" class="og-badge">OG</span>
            <span>{{
              shortAddress(wallet.activeBitcoinWallet.accounts[0].address)
            }}</span>
          </div>
        </n-dropdown>
      </div>
      <n-button
        v-else
        color="#fca121"
        class="connect-button"
        @click="
          () => {
            showModal = true
            toogleMenu()
          }
        "
      >
        Connect Wallet
      </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout-header {
  @include flexRsb;
  // height: 80px;
  width: 100%;
  z-index: 100;
  padding: 8px 37px;
  position: fixed;
  color: $onBackground;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  user-select: none;

  @include phone {
    padding: 4px;
    &.fullscreen {
      height: 100vh;
      @include flexC;
    }
  }

  .left-panel {
    height: 72px;
    @include flexR;
    @include phone {
      width: 100%;
      justify-content: space-between;
    }
    .logo {
      position: relative;
      margin-left: 20px;
      margin-right: 50px;

      &:after {
        position: absolute;
        right: -35px;
        font-size: 12px;
        top: 10px;
        content: 'Beta';
        color: white;
        text-align: center;
        height: 18px;
        width: 32px;
        background-image: url('~/assets/images/beta.png');
        background-repeat: no-repeat;
        background-size: 32px 18px;
      }
    }
    img {
      width: 100px;
      height: 56.75px;
      object-fit: contain;
      @include phone {
        width: 70px;
      }
    }
    .title {
      @include phone {
        display: none;
      }
    }
    .orc-cash {
      margin-left: 50px !important;
      white-space: nowrap;
    }
    .orc-20 {
      margin-left: 20px !important;
      white-space: nowrap;
    }
    .menu-item {
      margin-right: 20px;
      @include phone {
        display: none;
      }
    }
  }

  .title {
    position: relative;
    color: $onBackground;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    white-space: nowrap;
    &.active {
      color: $primary;
    }
    &:hover {
      color: $primary;
    }
  }
  .menu-item {
    font-size: 16px;
    font-weight: 500;
    @include flexR;
    color: $onBackground;
    &:hover {
      text-decoration: underline;
      color: $primary;
    }
    svg {
      margin-right: 6px;
    }
    &.active {
      color: $primary;
      text-decoration: none;
    }
  }
  .right-panel {
    @include flexR;
    // @include flexRGap(10px);
    justify-content: flex-end;
    @include phone {
      display: none;
    }
    .address {
      color: $primary;
      cursor: pointer;
      font-size: 14px;
    }
    .og-badge {
      color: $primary;
      border: 1px solid $primary;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      margin-right: 4px;
    }
  }
  .connect-button {
    height: 36px;
    color: #000;
    border-radius: 6px;
  }
  .menu-button {
    display: none;
    @include phone {
      height: 80px;
      margin-right: 10px;
      @include flexCc;
    }
  }
  .menu-list {
    display: none;
    &.show {
      @include phone {
        width: 100%;
        @include flexC;
        align-items: flex-center;
        gap: 15px;
      }
    }
  }
}
</style>
