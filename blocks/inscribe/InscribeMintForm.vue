<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NSlider,
  NInputNumber,
  FormInst,
  FormItemRule,
  NCollapseTransition,
  NTooltip
} from 'naive-ui'
import { ref } from 'vue'
import { OrcOrder } from '~/types'
const { $orc20api, $orccashapi } = useNuxtApp()
const formError = ref<string | undefined>(undefined)
const formRef = ref<FormInst | null>(null)
const isValiding = ref(false)
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
  op: 'mint',
  tick: props.order.tick ?? '',
  amount: props.order.amount ?? 1000,
  repeat: props.order.repeat ?? 1,
  id: Number(props.order.id ?? '1'),
  origin: props.order.origin ?? true
}
const formValue = ref(defaultFormValue)

function nextStep() {
  isValiding.value = true
  formRef.value?.validate((error) => {
    isValiding.value = false
    if (!error) {
      formError.value = ''
      emit('next', formValue.value)
    } else {
      formError.value = error[0][0].message
    }
  })
}

const progressInfo = ref({
  total: '0',
  minted: '0'
})
const progress = computed(() => {
  const total = Number(progressInfo.value.total)
  if (total === 0) {
    return { originProgress: NaN, addedPorgress: 0 }
  }
  const minted = Number(progressInfo.value.minted)
  const progress = (formValue.value.amount * formValue.value.repeat) / total
  const originProgress = Number(formatNumber((minted / total) * 100, 2))
  const addedProgress = Number(formatNumber(progress * 100, 2))
  return { originProgress, addedProgress }
})

watchDebounced(
  [
    () => formValue.value.tick,
    () => formValue.value.amount,
    () => formValue.value.repeat,
    () => formValue.value.id
  ],
  () => {
    const api =
      props.orcType === 'orc-20' && defaultFormValue.origin
        ? $orc20api
        : $orccashapi
    api
      .orc20TokenInfos({
        pageNo: 1,
        pageSize: 100,
        ticker: formValue.value.tick,
        tokenId: formValue.value.id.toString()
      })
      .then((tokenInfo) => {
        if (tokenInfo.items.length > 0) {
          const index = tokenInfo.items.findIndex(
            (item) =>
              Number(item.tokenInfoOrc20Id) === formValue.value.id &&
              item.tokenInfoTicker.toLowerCase() ===
                formValue.value.tick.toLowerCase()
          )
          if (index !== -1) {
            progressInfo.value = {
              total: tokenInfo.items[0].tokenInfoMaxNumber,
              minted: tokenInfo.items[0].tokenInfoTotalMinted
            }
          } else {
            progressInfo.value = {
              total: '0',
              minted: '0'
            }
          }
        } else {
          progressInfo.value = {
            total: '0',
            minted: '0'
          }
        }
      })
  },
  { debounce: 500, immediate: true }
)
watchDebounced(
  [() => formValue.value.tick, () => formValue.value.id],
  () => {
    const api =
      props.orcType === 'orc-20' && defaultFormValue.origin
        ? $orc20api
        : $orccashapi
    api
      .orc20TokenInfos({
        pageNo: 1,
        pageSize: 100,
        ticker: formValue.value.tick,
        tokenId: formValue.value.id.toString()
      })
      .then((tokenInfo) => {
        if (tokenInfo.items.length > 0) {
          const index = tokenInfo.items.findIndex(
            (item) =>
              Number(item.tokenInfoOrc20Id) === formValue.value.id &&
              item.tokenInfoTicker.toLowerCase() ===
                formValue.value.tick.toLowerCase()
          )
          if (index !== -1) {
            formValue.value.amount = Number(
              tokenInfo.items[index].tokenInfoLimitNumber
            )
          } else {
            formValue.value.amount = 1000
          }
        } else {
          formValue.value.amount = 1000
        }
      })
  },
  { debounce: 500, immediate: true }
)
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

function amountValidator(_: FormItemRule, value: number) {
  return new Promise<void>((resolve, reject) => {
    if (!formValue.value.tick) {
      resolve()
    }
    if (!value) {
      formError.value = 'Please input amount'
      throw new Error('Please input amount')
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
        tokenId: formValue.value.id.toString()
      })
      .then((tokenInfo) => {
        if (tokenInfo.items.length > 0) {
          const index = tokenInfo.items.findIndex(
            (item) =>
              Number(item.tokenInfoOrc20Id) === formValue.value.id &&
              item.tokenInfoTicker.toLowerCase() ===
                formValue.value.tick.toLowerCase()
          )
          if (index !== -1) {
            const limit = tokenInfo.items[index].tokenInfoLimitNumber
            const max = tokenInfo.items[index].tokenInfoMaxNumber
            if (value > Number(limit)) {
              formError.value = 'Amount exceeds limit'
              return reject(Error('Amount exceeds limit'))
            }
            const minted = tokenInfo.items[index].tokenInfoTotalMinted
            const left = Number(max) - Number(minted)
            if (left < value * formValue.value.repeat) {
              formError.value = `Token only has ${left} left to mint`
              return reject(Error(`Token only has ${left} left to mint`))
            }
            formError.value = ''
            resolve()
          } else {
            formError.value = ''
            resolve()
          }
        } else {
          formError.value = ''
          resolve()
        }
      })
      .catch((error) => {
        reject(Error(error.message))
      })
  })
}

const rules: any = {
  tick: {
    required: true,
    trigger: ['input', 'blur'],
    validator: tickValidator
  },
  amount: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur'],
    validator: amountValidator
  },
  id: {
    required: false,
    type: 'number',
    validator: idValidator,
    trigger: 'blur'
  },
  repeat: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur']
  }
}
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
      <n-form-item path="tick" class="form-item">
        <span class="label">Ticker</span>
        <n-input
          v-model:value="formValue.tick"
          class="input"
          placeholder="Input ticker"
        />
      </n-form-item>
      <n-form-item v-if="!isNaN(progress.originProgress)" class="progress">
        <span />
        <n-tooltip trigger="hover">
          <template #trigger>
            <progress-bar
              :progress-data="[{label: 'Origin', value: progress.originProgress}, {label: 'Plus', value: progress.addedProgress!}]"
            />
          </template>
          <span> {{ `+ ${progress.addedProgress}%` }}</span>
        </n-tooltip>
      </n-form-item>
      <n-form-item path="amount" class="form-item">
        <span class="label">Amount</span>
        <n-input-number
          v-model:value="formValue.amount"
          class="input"
          placeholder=""
          :show-button="false"
          :default-value="1"
          :parse="parseCurrency"
          :format="formatCurrency"
          :min="1"
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
          placeholder="Please input token ID"
          class="input"
        />
      </n-form-item>
      <div class="divider" />
      <n-form-item label="Repeat Mint" path="repeat" class="form-item">
        <span class="label"> Repeat Mint </span>
        <div class="repeat-setting">
          <n-input-number
            v-model:value="formValue.repeat"
            :show-button="false"
            :min="1"
            placeholder=""
            :max="1000"
            class="repeat-value"
          />
          <n-slider
            v-model:value="formValue.repeat"
            :step="1"
            :default-value="1"
            :min="1"
            :max="1000"
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
    width: 300px;
  }
}

.inscribe-basic-info {
  .info-form {
    margin-bottom: 40px;
    padding: 0 100px;

    @include phone {
      padding: 0 30px;
    }
  }

  .form-error {
    font-size: 14px;
    text-align: center;
    color: #ff4d4f;
  }

  .form-item {
    .label {
      color: $onBackground;
      text-align: right;
    }

    .repeat-setting {
      @include flexR;

      .repeat-value {
        width: 34px;
        margin-right: 10px;
        color: #ffffff66;
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
  }
  .progress {
    :deep(.n-form-item-blank) {
      min-height: 0px;
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
      margin: 0 -30px;
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
