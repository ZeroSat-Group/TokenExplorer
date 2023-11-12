<script setup lang="ts">
import {
  NInput,
  NButton,
  NForm,
  NFormItem,
  NInputNumber,
  NCollapseTransition,
  NSlider,
  NSkeleton,
  useMessage,
  FormInst,
  FormItemRule,
  UploadFileInfo
} from 'naive-ui'
import { ofetch } from 'ofetch'
import { ref } from 'vue'
import { useWallet } from '~/store/wallet'
import { useInscriber } from '~/store/inscriber'
import { generateMintDataForOrder } from '~/utils'
import { OrcOrder, Order } from '~/types'
const SERVICE_BASE_FEE = 1999
const wallet = useWallet()
const inscriber = useInscriber()
type FeeRate = {
  title: string
  desc: string
  feeRate: number
}
type FeeSummaryResult = {
  status: string
  result: {
    list: FeeRate[]
  }
}
const props = defineProps({
  order: {
    type: Object as PropType<OrcOrder | string[] | UploadFileInfo[]>,
    required: true
  }
})
const { api } = useInscribeApi({
  protocol: 'orc-20',
  testnet: inscriber.testnet
})
const emit = defineEmits(['next'])
const formRef = ref<FormInst | null>(null)
const formValue = ref({
  receiver: ''
})
const rules: any = {
  receiver: [
    {
      validator(_: FormItemRule, value: string) {
        if (!value) {
          return new Error('Address is required')
        } else if (!checkBitcoinAddress(value)) {
          return new Error('Address invalid')
        }
        return true
      },
      trigger: ['input', 'blur']
    }
  ]
}
const feeTags = ['Economy', 'Normal', 'Custom']
const message = useMessage()
const feeRate = ref({
  tag: 'Normal',
  value: 0
})
const customFee = ref(0)
const size = ref(546)
const apiUrl = inscriber.testnet
  ? 'https://mempool.space/testnet/api/v1/fees/recommended'
  : 'https://mempool.space/api/v1/fees/recommended'
const showSizeSlider = ref(false)
const isSending = ref(false)
const { data } = await useAsyncData(
  'bitcoinFeeRate',
  () =>
    ofetch<FeeSummaryResult>(apiUrl, {
      mode: 'cors',
      parseResponse: (result) => {
        const data = JSON.parse(result)
        return {
          result: {
            list: [
              {
                title: 'Slow',
                desc: 'About 1 hours',
                feeRate: data.hourFee
              },
              {
                title: 'Avg',
                desc: 'About 30 mins',
                feeRate: data.halfHourFee
              },
              {
                title: 'Fast',
                desc: 'About 10 mins',
                feeRate: data.fastestFee
              }
            ]
          }
        }
      }
    }),
  {
    lazy: true,
    server: false
  }
)
const { data: dataSize, pending } = await useAsyncData(
  'txDataSize',
  () => {
    if (Array.isArray(props.order) && typeof props.order[0] === 'object') {
      const formData = new FormData()
      ;(props.order as UploadFileInfo[]).forEach((file) => {
        formData.append('files', file.file!)
      })
      const baseUrl = api.apiProvider.baseUrl
      return ofetch(baseUrl + '/inscribe/file:dataSize', {
        method: 'POST',
        body: formData,
        parseResponse: (data) => {
          const response = JSON.parse(data)
          if (response.code !== '000') {
            throw new Error(response.data?.msg ?? response.msg)
          } else {
            return response.data
          }
        }
      })
    }
    return api.inscribeDataSizePost({
      // @ts-ignore
      data: Array.isArray(props.order)
        ? props.order
        : generateMintDataForOrder(props.order, true)
    })
  },
  {
    server: false,
    lazy: true
  }
)
const { data: ogData } = await useAsyncData(
  'checkOG',
  () =>
    api.inscribeDiscount({
      address: formValue.value.receiver,
      data: ''
    }),
  {
    server: false,
    lazy: true,
    watch: [formValue.value]
  }
)
const { data: currency } = await useAsyncData(
  'satPrice',
  () => api.inscribeSetsPrice(undefined),
  {
    server: false,
    lazy: true
  }
)

const isOG = computed(() => {
  return (ogData?.value?.length ?? 0) > 0
})

watch(
  wallet,
  () => {
    if (wallet.activeBitcoinWallet) {
      if (!formValue.value.receiver) {
        formValue.value.receiver =
          wallet.activeBitcoinWallet.accounts[0].address
      }
    }
  },
  {
    immediate: true
  }
)
watch(
  data,
  () => {
    if (data.value) {
      customFee.value = data.value.result.list[2].feeRate
      feeRate.value.value = data.value.result.list[1].feeRate
    }
  },
  {
    immediate: true
  }
)

watch(customFee, () => {
  if (feeRate.value.tag === 'Custom') {
    feeRate.value.value = customFee.value
  }
})

const networkFee = computed(() => {
  if (!dataSize.value) {
    return 0
  }
  return Math.floor(dataSize.value * feeRate.value.value)
})
const repeat = computed(() => {
  return Array.isArray(props.order) ? props.order.length : props.order.repeat
})

const feeBySize = computed(() => {
  if (!dataSize.value) {
    return 0
  }
  return Math.floor(dataSize.value * feeRate.value.value * 0.05)
})

const serviceFee = computed(() => {
  return SERVICE_BASE_FEE * Math.min(repeat.value, 25)
})

const discountServiceFee = computed(() => {
  const discounts = ogData.value?.map((item) =>
    Number(item.discount ?? '1')
  ) ?? [1]
  const minDiscount = Math.min(...discounts) // 取最小折率

  return Math.floor(serviceFee.value * minDiscount)
})

const totalFee = computed(() => {
  return (
    (isOG.value ? discountServiceFee.value : serviceFee.value) +
    networkFee.value +
    feeBySize.value +
    size.value * repeat.value
  )
})
const discountTotalFee = computed(() => {
  return Math.floor(totalFee.value / 1000) * 1000
})
const disabled = computed(() => {
  if (
    !networkFee.value ||
    !formValue.value.receiver ||
    !feeRate.value ||
    !checkBitcoinAddress(formValue.value.receiver)
  ) {
    return true
  }
  return false
})
const mintData = computed(() => {
  if (Array.isArray(props.order)) {
    if (typeof props.order[0] === 'object') {
      return (props.order as UploadFileInfo[]).map((f: any) => f.name)
    }
    return props.order as string[]
  }
  return generateMintDataForOrder(props.order) as string[]
})
async function pay() {
  const error = await formRef.value?.validate()
  if (error) {
    return
  }
  isSending.value = true
  try {
    let order
    if (Array.isArray(props.order) && typeof props.order[0] === 'object') {
      const formData = new FormData()
      ;(props.order as UploadFileInfo[]).forEach((file) => {
        formData.append('files', file.file!)
      })
      formData.append('receiveAddress', formValue.value.receiver)
      formData.append('feeRate', feeRate.value.value.toString())
      formData.append('satsInInscription', size.value.toString())
      formData.append('totalAmount', discountTotalFee.value.toString())
      const baseUrl = api.apiProvider.baseUrl
      order = await ofetch(baseUrl + '/inscribe/file:order', {
        method: 'POST',
        body: formData,
        parseResponse: (data) => {
          const response = JSON.parse(data)
          if (response.code !== '000') {
            throw new Error(response.data?.msg ?? response.msg)
          } else {
            return response.data
          }
        }
      })
    } else {
      order = await api.inscribeOrderPost({
        receiveAddress: formValue.value.receiver,
        feeRate: feeRate.value.value.toString(),
        // @ts-ignore
        contentList: Array.isArray(props.order)
          ? props.order
          : generateMintDataForOrder(props.order as OrcOrder, true),
        satsInInscription: size.value.toString(),
        totalAmount: discountTotalFee.value.toString()
      })
    }
    const savedOrder: Order = {
      id: order.orderID,
      orderNo: order.orderOrderNo,
      date: Date.now(),
      address: order.orderPayAddress,
      status: 0,
      amount: discountTotalFee.value,
      receiver: formValue.value.receiver,
      feeRate: feeRate.value.value,
      serviceFee: isOG.value ? discountServiceFee.value : serviceFee.value,
      content: mintData.value
    }
    inscriber.addOrder(savedOrder)
    emit('next', savedOrder)
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    }
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div class="inscribe-order-fee">
    <section class="receiver-panel">
      <div class="title">Provide the address to receive the inscription:</div>
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        size="large"
        :show-feedback="true"
        :show-label="false"
      >
        <n-form-item path="receiver">
          <n-input
            v-model:value="formValue.receiver"
            class="address-input"
            placeholder="Receive btc address"
          />
        </n-form-item>
      </n-form>
    </section>
    <section class="network-fee-panel">
      <div class="title">Select the network fee you want to pay:</div>
      <div v-if="data" class="fee-selector-list">
        <div
          v-for="(item, index) in data.result.list"
          :key="item.title"
          class="fee-selector"
          :class="{ active: feeRate.tag === feeTags[index] }"
          @click="
            () => {
              feeRate.value = item.feeRate
              feeRate.tag = feeTags[index]
            }
          "
        >
          <div class="fee-tag">
            {{ feeTags[index] }}
          </div>
          <div class="subtitle">
            <span class="fee-rate">{{
              index === 2 ? customFee : item.feeRate
            }}</span
            ><span style="margin-left: 4px">sats/vb</span>
          </div>
          <div
            v-if="index !== 2 || item.feeRate === customFee"
            class="subtitle"
          >
            {{ item.desc }}
          </div>
        </div>
      </div>
      <div v-else class="fee-selector-list">
        <div v-for="i in 3" :key="i" class="fee-selector">
          <div class="fee-tag">
            <n-skeleton height="16px" width="60px" :sharp="false" />
          </div>
          <div class="subtitle">
            <span class="fee-rate">
              <n-skeleton
                height="14px"
                width="100px"
                :sharp="false"
                style="margin-top: 10px"
              />
            </span>
          </div>
        </div>
      </div>
      <n-collapse-transition :show="feeRate.tag === 'Custom'">
        <n-input-number
          v-model:value="customFee"
          class="custom-fee"
          :show-button="false"
          :min="1"
          placeholder="Custom feerate"
        />
      </n-collapse-transition>

      <div class="subtitle">Times shown are not guaranteed.</div>
    </section>
    <section class="fee-summary">
      <div class="fee-info">
        <div class="property">Sats In Inscription:</div>
        <div class="value">{{ repeat }} x {{ size }} sats</div>
        <SatsPrice :sats="repeat * size" :currency="currency ?? '0'" />
        <div class="customize-button" @click="showSizeSlider = !showSizeSlider">
          Customize
        </div>
      </div>
      <n-collapse-transition :show="showSizeSlider">
        <div class="size-slider">
          <!-- <span class="size-value">546</span> -->
          <n-slider
            v-model:value="size"
            :step="1"
            :default-value="546"
            :min="330"
            :max="10000"
          >
            <template #thumb>
              <svg
                width="15"
                height="15"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="5"
                  cy="5"
                  r="4"
                  fill="#232726"
                  stroke="#FCA121"
                  stroke-width="2"
                />
              </svg>
            </template>
          </n-slider>
          <n-input-number
            v-model:value="size"
            :show-button="false"
            :min="330"
            placeholder=""
            :max="10000"
            class="size-input-value"
          />
          <!-- <span class="size-value">1000</span> -->
        </div>
      </n-collapse-transition>
      <div class="fee-info">
        <div>Network Fee:</div>
        <div v-if="dataSize && !pending">~{{ networkFee }} sats</div>
        <div v-else class="skeleton">
          <n-skeleton height="20px" width="80px" :sharp="false" />
        </div>
        <SatsPrice :sats="networkFee" :currency="currency ?? '0'" />
      </div>
      <div class="divider" />
      <div class="fee-info">
        <div>Fee by Size:</div>
        <div v-if="dataSize">~{{ feeBySize }} sats</div>
        <div v-else class="skeleton">
          <n-skeleton height="20px" width="80px" :sharp="false" />
        </div>
        <SatsPrice :sats="feeBySize" :currency="currency ?? '0'" />
      </div>
      <div class="fee-info">
        <div>Service Fee:</div>
        <div :class="{ discount: isOG }">~{{ serviceFee }} sats</div>
        <SatsPrice :sats="serviceFee" :currency="currency ?? '0'" />
      </div>
      <div v-if="isOG" class="fee-info">
        <div>OG Pass</div>
        <div class="discount-fee">~{{ discountServiceFee }} sats</div>
        <SatsPrice :sats="discountServiceFee" :currency="currency ?? '0'" />
      </div>
      <div class="divider" />
      <div class="fee-info">
        <div>Total:</div>
        <div class="discount">~{{ totalFee }} sats</div>
        <SatsPrice :sats="totalFee" :currency="currency ?? '0'" />
      </div>
      <div class="fee-info">
        <div />
        <div class="discount-fee">~{{ discountTotalFee }} sats</div>
        <SatsPrice :sats="discountTotalFee" :currency="currency ?? '0'" />
      </div>
    </section>
    <div class="subtitle note">
      Please note the inscribing transaction delivers the inscription to the
      receiving address directly.
    </div>
    <div class="footer">
      <n-button
        color="#fca121"
        class="submit-button"
        :disabled="disabled"
        @click="pay"
      >
        <SpinnerLoader v-if="isSending" color="#000" class="loading-icon" />
        <span v-else>Submit & Pay invoice</span>
      </n-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-input__input-el) {
  color: rgba(255, 255, 255, 0.4);
  margin: 4px;
}

.inscribe-order-fee {
  .address-input {
    margin-top: 14px;
    background: rgba(7, 9, 8, 1);
    border: 1px solid #28302e;
    height: 40px;
    width: 100%;

    :deep(.n-input__input) {
      @include flexCc;
    }
  }

  .receiver-panel {
    margin-top: 26px;
  }

  .title {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: left;
    color: white;
  }

  .subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
    color: #ffffff66;
  }

  .network-fee-panel {
    margin: 24px 44px 0 44px;

    @include phone {
      margin: 32px 12px 0 12px;
    }
  }

  .fee-selector-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0px 14px;
    margin-bottom: 12px;

    .fee-selector {
      height: 100px;
      border: 1px solid #424241;
      border-radius: 6px;
      margin-top: 20px;
      cursor: pointer;
      color: white;
      @include flexCc;

      &:hover,
      &.active {
        border: 1px solid #fca121;
        color: #fff;
      }

      .fee-rate {
        color: $primary;
        font-size: 20px;
      }

      .fee-tag {
        font-size: 16px;
      }
    }
  }

  .custom-fee {
    margin-bottom: 10px;
    background: rgba(7, 9, 8, 1);
    border: 1px solid #28302e;
    border-radius: 4px;
    width: 100%;
  }

  .fee-summary {
    margin: 32px 44px 0 44px;

    @include phone {
      margin: 32px 12px 0 12px;
    }

    .size-slider {
      margin-top: 10px;
      @include flexR;

      .size-value {
        border: 1px solid #424241;
        min-width: 34px;
        height: 26px;
        border-radius: 6px;
        margin-right: 10px;
        margin-left: 10px;
        color: #ffffff66;
        font-size: 12px;
        text-align: center;
        @include flexRc;
      }

      .size-input-value {
        width: 60px;
        margin-left: 10px;
        color: #ffffff66;
      }

      :deep(.n-input .n-input-wrapper) {
        padding: 2px;
        font-size: 12px;
        text-align: center;
        border: 1px solid #424241;
        border-radius: 6px;
        min-width: 34px;
      }

      :deep(.n-input .n-input__input-el) {
        line-height: 1 !important;
        height: 20px;
      }
    }
  }

  .divider {
    margin-top: 10px;
    border-top: 1px solid #ffffff14;
  }

  .fee-info {
    margin-top: 10px;
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 80px;
    gap: 0 20px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: right;

    @include phone {
      gap: 0 10px;
    }

    .skeleton {
      @include flexR;
      justify-content: flex-end;
    }

    .discount {
      text-decoration: line-through;
    }

    .discount-fee {
      color: $primary;
    }

    .customize-button {
      text-align: left;
      font-size: 14px;
      color: $primary;
      cursor: pointer;
      text-decoration: underline;
    }

    .value {
      min-width: 100px;
    }
  }

  .note {
    text-align: center;
    margin: 30px 44px 0 44px;

    @include phone {
      margin: 32px 12px 0 12px;
    }
  }

  .footer {
    @include flexRc;
  }

  .submit-button {
    margin: 24px auto 30px auto;
    height: 36px;
    color: #000;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
