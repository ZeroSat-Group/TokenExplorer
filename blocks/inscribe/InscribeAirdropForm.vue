<script lang="ts" setup>
import { ref } from 'vue'
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NInputNumber,
  FormInst,
  FormItemRule,
  NCollapseTransition,
  FormRules,
  NScrollbar
} from 'naive-ui'
import { OrcOrder } from '~/types'

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

const defaultFormValue = {
  p: props.orcType,
  op: 'airdrop',
  tick: props.order.tick ?? '',
  amt: props.order.amt ?? 10000,
  lim: props.order.lim ?? 1000,
  id: Number(props.order.id ?? '1'),
  to: props.order.to ?? [],
  repeat: props.order.repeat ?? 1,
  origin: props.order.origin ?? true
}
const { $orc20api, $orccashapi } = useNuxtApp()

const isValiding = ref(false)
const formError = ref<string | undefined>(undefined)
const formRef = ref<FormInst | null>(null)
const formValue = ref({ ...defaultFormValue, batchToStr: '' })
const addressError = ref<string[]>([])

const tickValidator = (_: FormItemRule, value: string) => {
  if (!value) {
    formError.value = 'Please input ticker'
    return Error('Please input ticker')
  }
  formError.value = ''
}

function limitValidator(_: FormItemRule, value: number) {
  if (!value) {
    formError.value = 'Please input limit'
    return new Error('Please input limit')
  } else if (value > formValue.value.amt) {
    formError.value = 'Limit must be less than total amount'
    return new Error('Limit must be less than total amount')
  } else {
    formError.value = ''
    return true
  }
}

function addressValidator(_: FormItemRule, value: string[]) {
  addressError.value = []
  if (value.length === 0) {
    formError.value = 'Please input address'
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
      formError.value = 'Address invalid'
    }
  }
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
            reject(Error('Token not deloyed'))
          } else {
            formError.value = ''
            resolve()
          }
        } else {
          formError.value = 'Token not deployed'
          reject(Error('Token not deloyed'))
        }
      })
      .catch((error) => {
        reject(Error(error.message))
      })
  })
}

const rules: FormRules = {
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
    trigger: ['input', 'blur']
  },
  lim: {
    required: true,
    type: 'number',
    validator: limitValidator,
    trigger: ['input', 'blur']
  },
  to: {
    required: true,
    type: 'array',
    trigger: ['input', 'blur', 'change'],
    validator: addressValidator
  }
}

function nextStep() {
  isValiding.value = true
  formRef.value?.validate((error) => {
    isValiding.value = false
    if (!error) {
      if (addressError.value.length > 0) {
        return error
      }
      formError.value = ''
      emit('next', formValue.value)
    } else {
      formError.value = error[0][0].message
    }
  })
}
</script>

<template>
  <div class="inscribe-airdrop-form">
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
      <n-form-item path="tick" class="form-item">
        <span class="label">Ticker</span>
        <n-input
          v-model:value="formValue.tick"
          class="input"
          placeholder="Input ticker"
        />
      </n-form-item>
      <n-form-item path="id" class="form-item">
        <span class="label">Token ID</span>
        <n-input-number
          v-model:value="formValue.id"
          class="input"
          :show-button="false"
          placeholder="Input token ID"
        />
      </n-form-item>
      <n-form-item path="amt" class="form-item">
        <span class="label">Total</span>
        <n-input-number
          v-model:value="formValue.amt"
          :show-button="false"
          :parse="parseCurrency"
          :format="formatCurrency"
          class="input"
        />
      </n-form-item>
      <n-form-item path="lim" class="form-item">
        <span class="label">Limit</span>
        <n-input-number
          v-model:value="formValue.lim"
          :show-button="false"
          :parse="parseCurrency"
          :format="formatCurrency"
          :max="formValue.amt"
          class="input"
        />
      </n-form-item>

      <n-form-item path="to" class="form-item address-item">
        <span class="label address">Address ({{ formValue.to.length }})</span>

        <div class="address-list">
          <n-input
            v-model:value="formValue.batchToStr"
            type="textarea"
            class="input"
            :placeholder="`Input address\naddress \naddress \naddress`"
            @change="
              (value) => {
                formValue.to = value
                  .split('\n')
                  .filter((s) => !!s)
                  .filter((a) => !!a)
                formValue.batchToStr = formValue.to.join('\n')
              }
            "
          />
          <div v-if="formValue.to.length > 0" class="address-scrroll-container">
            <NScrollbar style="max-height: 200px" :size="0.8" trigger="none">
              <div class="address-items">
                <div
                  v-for="num in formValue.to.length"
                  :key="num"
                  class="address-item"
                >
                  <div class="value-label">{{ num }}.</div>
                  <n-input
                    v-model:value="formValue.to[num - 1]"
                    class="input"
                    :class="{
                      'address-error': addressError.includes(
                        formValue.to[num - 1]
                      ),
                      'address-done': !addressError.includes(
                        formValue.to[num - 1]
                      )
                    }"
                    placeholder="Input Address"
                    @change="
                      () => {
                        formValue.batchToStr = formValue.to.join('\n')
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
.inscribe-airdrop-form {
  width: 100%;
  padding-top: 18px;
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
    // margin-top: 20px;
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
  .divider {
    margin: 0 -100px;
    margin-bottom: 12px;
    border-top: 1px solid #28302e;
    @include phone {
      margin: 0 -20px;
    }
  }
  .radio-options {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .radios {
    .icon {
      transform: scale(0.7);
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
}
</style>
