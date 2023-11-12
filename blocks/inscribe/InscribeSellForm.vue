<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NInputNumber,
  FormInst,
  FormItemRule,
  NScrollbar,
  NCollapseTransition,
  FormRules
} from 'naive-ui'
import { ref } from 'vue'
import { OrcOrder } from '~/types'

const { $orc20api, $orccashapi } = useNuxtApp()
const formError = ref<string | undefined>(undefined)
const formRef = ref<FormInst | null>(null)
const isValiding = ref(false)
const addressError = ref<string[]>([])

const props = defineProps({
  orcType: {
    type: String,
    required: true
  },
  order: {
    type: Object as PropType<OrcOrder>,
    default: () => ({})
  }
})

const emit = defineEmits(['next'])

const defaultFormValue: any = {
  p: props.orcType,
  op: 'sell',
  tick: props.order.tick ?? '',
  amt: props.order.amt,
  lim: props.order.lim,
  price: props.order.price,
  expire: props.order.expire === 'never' ? undefined : props.order.expire,
  seller: props.order.seller,
  buyer: props.order.buyer ?? 'anyone',
  id: Number(props.order.id ?? 1),
  repeat: 1,
  origin: props.order.origin ?? true
}
const formValue = ref({ ...defaultFormValue, batchToStr: '' })

function nextStep() {
  isValiding.value = true
  formRef.value?.validate((error) => {
    isValiding.value = false
    if (!error) {
      formError.value = ''

      if (!formValue.value.expire) {
        formValue.value.expire = 'never'
      }
      emit('next', formValue.value)
    } else {
      formError.value = error[0][0].message
    }
  })
}
// function limitValidator(_: FormItemRule, value: number) {
//   if (!value) {
//     formError.value = 'Please input limit'
//     return new Error('Please input limit')
//   } else if (value > (formValue.value.amt ?? 0)) {
//     formError.value = 'Limit must be less than total supply'
//     return new Error('Limit must be less than total supply')
//   } else {
//     formError.value = ''
//     return true
//   }
// }
const tickValidator = (_: FormItemRule, value: string) => {
  if (!value) {
    formError.value = 'Please input ticker'
    return Error('Please input ticker')
  }
  if (
    value.length !== 4 &&
    formValue.value.p === 'brc-20' &&
    defaultFormValue.origin
  ) {
    formError.value = 'Ticker must be 4 letter'
    return Error('Ticker must be 4 letter')
  }
  formError.value = ''
}

function idValidator(_: FormItemRule, value: number) {
  return new Promise<void>((resolve, reject) => {
    if (!formValue.value.tick) {
      resolve()
    }
    const api =
      props.orcType === 'orc-20' && defaultFormValue.origin
        ? $orc20api
        : $orccashapi
    api
      .orc20TokenInfos({
        pageNo: 1,
        pageSize: 100,
        ticker: formValue.value.tick,
        tokenId: value.toString()
      })
      .then((tokenInfo) => {
        if (tokenInfo.items.length > 0) {
          const index = tokenInfo.items.findIndex(
            (item) =>
              Number(item.tokenInfoOrc20Id) === value &&
              item.tokenInfoTicker.toLowerCase() ===
                formValue.value.tick.toLowerCase()
          )
          if (index === -1) {
            formError.value = 'Token not deployed'
            reject(Error('Token not deployed'))
          }
          formError.value = ''
          resolve()
        } else {
          formError.value = 'Token not deployed'
          reject(Error('Token not deployed'))
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// buyer address
function addressValidator(_: FormItemRule, value: string[] | string) {
  if (!Array.isArray(value)) {
    formError.value = ''
    return true
  }
  addressError.value = []
  if (value.length === 0) {
    formError.value = 'Please input buyer address or select anyone'
    return false
  } else {
    value.forEach((s) => {
      if (!checkBitcoinAddress(s)) {
        if (!addressError.value.includes(s)) {
          addressError.value.push(s)
        }
      }
    })

    if (addressError.value?.length === 0) {
      formError.value = ''
    } else {
      formError.value = 'Buyer address invalid'
    }
  }
}

// seller address
function sellerAddressValidator(_: FormItemRule, value: string) {
  if (!value) {
    formError.value = 'Please input seller address'
    return false
  } else if (!checkBitcoinAddress(value)) {
    formError.value = 'Seller address invalid'
  } else {
    formError.value = ''
  }
}

const rules = computed<FormRules>(() => {
  return {
    tick: {
      required: true,
      trigger: ['input', 'blur'],
      validator: tickValidator
    },
    id: {
      required: false,
      type: 'number',
      validator: idValidator,
      trigger: 'blur'
    },
    amt: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: 'Amount is required'
    },
    price: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      message: 'Price is required'
    },
    seller: {
      required: true,
      type: 'number',
      trigger: ['input', 'blur'],
      validator: sellerAddressValidator
    },
    buyer: {
      key: 'buyer',
      required: true,
      type: Array.isArray(formValue.value.buyer) ? 'array' : 'string',
      trigger: ['input', 'blur', 'change'],
      validator: addressValidator
    }
  }
})
</script>

<template>
  <div class="inscribe-basic-info">
    <n-form
      ref="formRef"
      class="info-form"
      :label-width="80"
      :model="formValue"
      :rules="rules"
      size="large"
      :show-feedback="false"
      :show-label="false"
    >
      <n-form-item label="Tick" path="tick" class="form-item">
        <span class="label">Ticker</span>
        <n-input
          v-model:value="formValue.tick"
          class="input"
          placeholder="Input ticker"
        />
      </n-form-item>
      <n-form-item
        v-show="orcType !== 'brc-20'"
        label="ID"
        path="id"
        class="form-item"
      >
        <span class="label">Token ID</span>
        <n-input-number
          v-model:value="formValue.id"
          :show-button="false"
          :min="1"
          :precision="0"
          class="input"
        />
      </n-form-item>
      <n-form-item path="amt" class="form-item">
        <span class="label">Amount</span>
        <n-input-number
          v-model:value="formValue.amt"
          class="input"
          placeholder="Input amount"
          :show-button="false"
          :parse="parseCurrency"
          :format="formatCurrency"
          :min="1"
        />
      </n-form-item>
      <n-form-item path="lim" class="form-item">
        <span class="label">Limit</span>
        <n-input-number
          v-model:value="formValue.lim"
          :show-button="false"
          :max="formValue.amt ?? 0"
          :parse="parseCurrency"
          :format="formatCurrency"
          class="input"
        />
      </n-form-item>
      <n-form-item path="price" class="form-item">
        <span class="label"> Price </span>
        <n-input-number
          v-model:value="formValue.price"
          :show-button="false"
          :parse="parseCurrency"
          :format="formatCurrency"
          :precision="0"
          class="input"
          placeholder="Sats / Token"
        >
          <template v-if="formValue.price" #suffix> sats </template>
        </n-input-number>
      </n-form-item>
      <n-form-item path="expire" class="form-item">
        <span class="label"> Expire </span>
        <n-input-number
          v-model:value="formValue.expire"
          :show-button="false"
          :parse="parseCurrency"
          class="input"
          placeholder="Default never / expire block"
        />
      </n-form-item>
      <n-form-item path="seller" class="form-item">
        <span class="label"> Seller </span>
        <n-input
          v-model:value="formValue.seller"
          class="input"
          placeholder="Input seller address"
        />
      </n-form-item>
      <n-form-item path="buyer" class="form-item">
        <span class="label"> Buyer </span>
        <div class="radio-options">
          <div class="radios">
            <check-button
              :checked="formValue.buyer === 'anyone'"
              class="icon"
              @click="
                () => {
                  formValue.buyer = 'anyone'

                  formRef?.validate(
                    () => {},
                    (rule) => {
                      return rule?.key === 'buyer'
                    }
                  )
                }
              "
            />
            <span>Anyone</span>
          </div>
          <div class="radios">
            <check-button
              :checked="Array.isArray(formValue.buyer)"
              class="icon"
              @click="formValue.buyer = []"
            />
            <span>Multiple</span>
          </div>
        </div>
      </n-form-item>
      <n-form-item
        v-if="Array.isArray(formValue.buyer)"
        path="buyer"
        class="form-item address-item"
      >
        <span class="label address">
          Buyer Address ({{ formValue.buyer.length }})
        </span>

        <div class="address-list">
          <n-input
            v-model:value="formValue.batchToStr"
            type="textarea"
            class="input"
            :placeholder="`Input address\naddress \naddress \naddress`"
            @change="
              (value) => {
                formValue.buyer = value
                  .split('\n')
                  .filter((s) => !!s)
                  .filter((a) => !!a)
                formValue.batchToStr = formValue.buyer.join('\n')
              }
            "
          />
          <div
            v-if="formValue.buyer.length > 0"
            class="address-scrroll-container"
          >
            <NScrollbar style="max-height: 200px" :size="0.8" trigger="none">
              <div class="address-items">
                <div
                  v-for="num in formValue.buyer.length"
                  :key="num"
                  class="address-item"
                >
                  <div class="value-label">{{ num }}.</div>
                  <n-input
                    v-model:value="formValue.buyer[num - 1]"
                    class="input"
                    :class="{
                      'address-error': addressError.includes(
                        formValue.buyer[num - 1]
                      ),
                      'address-done': !addressError.includes(
                        formValue.buyer[num - 1]
                      )
                    }"
                    placeholder="Input Address"
                    @change="
                      () => {
                        formValue.batchToStr = Array.isArray(formValue.buyer)
                          ? formValue.buyer.join('\n')
                          : ''
                      }
                    "
                  />
                </div>
              </div>
            </NScrollbar>
          </div>
        </div>
      </n-form-item>
      <n-collapse-transition :show="!!formError">
        <div class="form-error">
          {{ formError }}
        </div>
      </n-collapse-transition>
      <div class="buttons">
        <n-button color="#fca121" class="next-button" @click="nextStep">
          <SpinnerLoader v-if="isValiding" color="#000" class="loading-icon" />
          <span v-else>Next</span>
        </n-button>
      </div>
    </n-form>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-form-item-label) {
  width: 160px;
}
:deep(.n-form-item-blank) {
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 2.5fr 50px;
  align-items: center;
  gap: 0 16px;
  margin-bottom: 12px;

  @include phone {
    width: 340px;
  }
}
.inscribe-basic-info {
  width: 100%;
  padding-top: 18px;
  //   .info-form {
  //     margin-bottom: 40px;
  //     padding: 0 100px;
  //     @include phone {
  //       padding: 0 30px;
  //     }
  //   }

  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
  }
  .form-error {
    font-size: 16px;
    text-align: center;
    color: #ff4d4f;
  }
  .form-item {
    padding: 0 100px;
    @include phone {
      padding: 0 24px;
    }
    &.address-item {
      padding: 0 24px;
      :deep().n-form-item-blank {
        width: 100%;
        @include flexRc;
        justify-content: center;
        flex-direction: column;
        align-items: flex-start;
      }
    }
    .label {
      color: $onBackground;
      text-align: right;

      &.address {
        height: 100%;
        margin-left: 10px;
        margin-bottom: 4px;
      }
    }
    .repeat-setting {
      @include flexR;
      .repeat-value {
        border: 1px solid #424241;
        width: 34px;
        height: 26px;
        border-radius: 6px;
        margin-right: 10px;
        color: #ffffff66;
        font-size: 12px;
        text-align: center;
        @include flexRc;
      }
    }
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
  .input {
    background: $surface;
    border: 1px solid #28302e;
    width: 100%;
    border-radius: 6px;
  }
  .upgrade-switch {
    @include flexRsb;
  }
  .divider {
    margin: 0 -100px;
    margin-bottom: 12px;
    border-top: 1px solid #28302e;
  }
  .radio-options {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .radios {
    .icon {
      transform: scale(0.7);
      cursor: pointer;
    }
    span {
      color: $onBackground;
      margin-left: 4px;
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      letter-spacing: 0em;
      text-align: left;
    }
  }

  .address-list {
    width: 100%;
    @include flexCc;

    .input {
      margin-right: 14px;
      width: 94%;
      &.address-error {
        border-color: #ff4d4f;
      }

      &.address-done {
        border-color: green;
      }
    }

    .address-scrroll-container {
      width: 100%;
      margin-top: 10px;
      background-color: #121615;
      padding: 4px;
      padding-right: 0px;
      border-radius: $radius;
      overflow: hidden;
      .address-items {
        width: 100%;
        margin-top: 10px;
        .address-item {
          width: 100%;
          @include flexRc;
          justify-content: flex-start;
          margin-bottom: 10px;
          justify-content: space-between;
          .value-label {
            font-size: 12px;
            font-weight: 500;
            color: $onBackground;
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
