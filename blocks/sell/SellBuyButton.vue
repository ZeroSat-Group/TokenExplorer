<script lang="ts" setup>
import {
  NButton,
  NModal,
  NCard,
  NForm,
  NFormItem,
  FormInst,
  FormRules,
  NInputNumber,
  NProgress,
  NSkeleton,
  useThemeVars,
  NCollapseTransition,
  useMessage
} from 'naive-ui'
import { useWallet } from '~/store/wallet'
import { useInscriber } from '~/store/inscriber'
import { Orc20SellOrderWhiteLists, Orc20SellOrderDetail } from '~/types/swagger'

type WhitelistInfo = Orc20SellOrderWhiteLists['items'][0]
const props = defineProps<{
  tokenInfo: Orc20SellOrderDetail
  disabled?: boolean
}>()
const wallet = useWallet()
const inscriber = useInscriber()
const themeVars = useThemeVars()
const { api } = useApi()

const showModal = ref(false)
const pending = ref(false)
const loading = ref(false)
const showConnactModal = ref(false)
const message = useMessage()

const whiteList = ref<WhitelistInfo[]>([])
const orc20SellInfo = ref<Orc20SellOrderDetail | undefined>()

const formError = ref<string | undefined>(undefined)
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  amount: undefined
})

const rules: FormRules = {
  amount: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur']
  }
}

const address = computed(() => {
  return wallet.activeBitcoinWallet?.accounts?.[0].address
})

const isInWhitelist = computed<boolean>(() => {
  if (props.tokenInfo.sellOrderHasWhiteListed !== 'yes') {
    return true
  }
  const _address = address.value

  if (!_address) {
    return false
  }
  return whiteList.value
    .map((item) => item.sellOrderWhiteListAddress)
    .includes(_address ?? '')
})

const whitelistInfo = computed<WhitelistInfo | undefined>(() => {
  const address = wallet.activeBitcoinWallet?.accounts?.[0].address
  return whiteList.value.find(
    (item) => item.sellOrderWhiteListAddress === address
  )
})

const getData = async () => {
  try {
    pending.value = true
    const detail = await api.orc20SellOrderDetail({
      sellOrderId: props.tokenInfo.sellOrderSellOrderId!
    })

    orc20SellInfo.value = detail

    if (props.tokenInfo.sellOrderHasWhiteListed === 'yes') {
      const res = await api.orc20SellOrderWhiteLists({
        pageNo: 1,
        pageSize: 1000,
        sellOrderId: props.tokenInfo.sellOrderSellOrderId
      })

      whiteList.value = res.items ?? []

      const address = wallet.activeBitcoinWallet?.accounts?.[0].address

      if (!address) {
        formError.value = 'Not connact wallet'
        return
      }

      if (!isInWhitelist.value) {
        formError.value = 'The current account address is not in the whitelist'
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      formError.value = err.message
    }
  } finally {
    pending.value = false
  }
}

const maxAmount = computed<number>(() => {
  const list = []
  if (props.tokenInfo.sellOrderAmount) {
    list.push(Number(props.tokenInfo.sellOrderAmount))
  }

  if (whitelistInfo.value?.sellOrderWhiteListLim) {
    list.push(Number(whitelistInfo.value?.sellOrderWhiteListLim))
  }

  if (whitelistInfo.value?.sellOrderWhiteListAmountLeft) {
    list.push(Number(whitelistInfo.value.sellOrderWhiteListAmountLeft))
  }

  if (orc20SellInfo.value?.sellOrderLim) {
    list.push(Number(orc20SellInfo.value.sellOrderLim))
  }

  return Math.min(...list)
})
const isVaild = computed<boolean>(() => {
  return (
    !!formError.value ||
    !formValue.value.amount ||
    (formValue.value.amount ?? 0) > maxAmount.value
  )
})
watch(showModal, () => {
  if (showModal.value) {
    getData()
  } else {
    orc20SellInfo.value = undefined
  }
})

watch(
  formValue,
  () => {
    if (!formValue.value.amount) {
      formError.value = 'Amount cannot be empty'
    } else if (formValue.value.amount > maxAmount.value) {
      formError.value = 'Amount limit'
    } else {
      formError.value = ''
    }
  },
  {
    deep: true
  }
)

function toogleMenu() {
  showModal.value = false
  showConnactModal.value = !showConnactModal.value
  if (showConnactModal.value) {
    document.body.classList.add('stop-scrolling')
  } else {
    document.body.classList.remove('stop-scrolling')
  }
}

const onSumbit = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      try {
        formError.value = ''
        loading.value = true
        if (inscriber.testnet) {
          wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
        } else {
          wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
        }
        const address = props.tokenInfo.sellOrderSeller

        await wallet.activeBitcoinWallet?.provider.sendBitcoin(
          address,
          (formValue.value.amount ?? 0) *
            Number(props.tokenInfo.sellOrderPrice ?? '0')
        )
        showModal.value = false
        message.success('Buy order success')
      } catch (err: any) {
        if ('message' in err) {
          formError.value = err.message
        }
      } finally {
        loading.value = false
      }
    } else {
      formError.value = error[0][0].message
    }
  })
}

const infos = computed<{ name: string; key: string; value: string | number }[]>(
  () => {
    const tokenInfo = orc20SellInfo.value
    const whiteList = tokenInfo?.sellOrderHasWhiteListed ?? ''

    return [
      {
        name: 'Ticker',
        key: 'sellOrderTicker',
        value: tokenInfo?.sellOrderTicker ?? ''
      },
      {
        name: 'Token ID',
        key: 'sellOrderTokenId',
        value: tokenInfo?.sellOrderTokenId ?? ''
      },
      {
        name: 'Total',
        key: 'sellOrderAmount',
        value: formatNumber(tokenInfo?.sellOrderAmount ?? '0', -1)
      },
      {
        name: 'Amount Left',
        key: 'sellOrderAmountLeft',
        value: formatNumber(tokenInfo?.sellOrderAmountLeft ?? '0', -1)
      },
      {
        name: 'Limit',
        key: 'sellOrderLim',
        value: formatNumber(tokenInfo?.sellOrderLim ?? '0', -1)
      },
      {
        name: 'Price(Sats/Token)',
        key: 'sellOrderPrice',
        value: formatNumber(tokenInfo?.sellOrderPrice ?? '0', -1)
      },
      {
        name: '% Filled',
        key: 'sellOrderProgess',
        value: tokenInfo?.sellOrderProgress ?? '0'
      },
      {
        name: 'ACTIVATION BLK.',
        key: 'sellOrderActivationBlock',
        value: tokenInfo?.sellOrderActivationBlock ?? '0'
      },
      {
        name: 'EXPIRE BLK.',
        key: 'sellOrderExpire',
        value:
          tokenInfo?.sellOrderExpire === 'never'
            ? tokenInfo?.sellOrderExpire.toUpperCase()
            : tokenInfo?.sellOrderExpire ?? '0'
      },
      {
        name: 'Whitelisted',
        key: 'sellOrderHasWhiteListed',
        value:
          whiteList.slice(0, 1).toUpperCase() +
          whiteList.slice(1, whiteList.length)
      }
    ]
  }
)
</script>

<template>
  <div class="sell-buy-button">
    <div v-if="tokenInfo.sellOrderProgress === '100'">Completed</div>
    <NButton
      v-else
      class="buy-button"
      type="primary"
      :disabled="disabled ?? false"
      @click.stop="
        () => {
          if (!(disabled ?? false)) {
            showModal = true
          }
        }
      "
    >
      Buy
    </NButton>
  </div>

  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    :block-scroll="false"
    :loading="pending"
  >
    <n-card
      style="width: min(100%, 600px); padding: 0 20px; position: relative"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <close-icon
        class="modal-close-icon"
        style="position: absolute; right: 19px; top: 17px; cursor: pointer"
        @click="showModal = false"
      />

      <div v-for="(item, index) in infos" :key="index" class="info-panel">
        <span class="name">{{ item.name }}:</span>
        <div v-if="!orc20SellInfo" class="data">
          <n-skeleton
            height="14px"
            :width="`${60 * Math.random()}%`"
            :sharp="false"
          />
        </div>
        <n-progress
          v-else-if="item.key === 'sellOrderProgess'"
          type="line"
          :color="themeVars.warningColor"
          :rail-color="'#3f3e28'"
          :percentage="Number(formatNumber(Number(item.value ?? 0), 2))"
        />
        <div v-else class="data">
          {{ item.value }}
        </div>
      </div>

      <NForm
        ref="formRef"
        class="info-form"
        :label-width="80"
        :model="formValue"
        :rules="rules"
        size="large"
        :show-feedback="false"
        :show-label="false"
      >
        <NFormItem path="amount" class="form-item">
          <span class="label">Amount</span>
          <NInputNumber
            v-model:value="formValue.amount"
            class="input"
            :placeholder="`Max: ${maxAmount}`"
            :show-button="false"
            :parse="parseCurrency"
            :format="formatCurrency"
            :min="1"
            :max="maxAmount"
            :disabled="!isInWhitelist"
          />
        </NFormItem>

        <n-collapse-transition :show="!!formError">
          <div class="form-error">
            {{ formError }}
          </div>
        </n-collapse-transition>
      </NForm>
      <div class="buttons">
        <n-button
          v-if="address"
          color="#fca121"
          class="next-button"
          :disabled="isVaild"
          @click="onSumbit"
        >
          <SpinnerLoader v-if="loading" color="#000" class="loading-icon" />
          <span v-else>Buy</span>
        </n-button>
        <n-button
          v-else
          color="#fca121"
          class="next-button"
          @click="
            () => {
              toogleMenu()
            }
          "
        >
          Connect Wallet
        </n-button>
      </div>
    </n-card>
  </n-modal>

  <n-modal v-model:show="showConnactModal" :block-scroll="false">
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
</template>

<style scoped lang="scss">
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}
.sell-buy-button {
  .buy-button:not(.n-button--disabled):hover {
    border-radius: 6px !important;
  }

  .buy-button {
    height: 30px;
    color: #000;
    border-radius: 6px !important;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}

:deep() .n-button__state-border {
  border-radius: 6px !important;
}

.info-form {
  margin-bottom: 40px;
  padding: 0 100px;

  @include phone {
    padding: 0 30px;
  }
}

.form-item {
  .label {
    color: $onBackground;
    text-align: right;
    white-space: nowrap;
    margin-right: 10px;
  }

  .input {
    background: $surface;
    border: 1px solid #28302e;
    width: 100%;
    border-radius: 6px;
  }
}

.input-tip {
  color: $onBackground;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.7;
}

.info-panel {
  display: grid;
  grid-template-columns: 2fr 4fr;
  grid-gap: 18px;
  color: $onBackground;
  margin-bottom: 20px;

  @include phone {
    grid-template-columns: 2fr 5fr;
  }

  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: right;
    opacity: 0.4;
  }

  .data {
    font-size: 14px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: left;
  }

  .history {
    cursor: pointer;
    color: $primary;
    text-decoration: underline;
  }
}

.form-error {
  font-size: 16px;
  text-align: center;
  color: #ff4d4f;
}

.buttons {
  margin-top: 10px;
  @include flexRc;

  .next-button {
    margin: auto;
    // width: 100px;
    height: 36px;
    color: #000;
    border-radius: 6px;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
