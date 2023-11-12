<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NInputNumber,
  FormInst,
  FormItemRule,
  NSwitch,
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
  op: 'deploy',
  tick: props.order.tick ?? '',
  max: props.order.max ?? 21000000,
  lim: props.order.lim === 'self' ? 1000 : props.order.lim ?? 1000,
  dec: props.order.dec ?? 18,
  ug: props.order.ug ?? true,
  id: Number(props.order.id ?? '1'),
  repeat: 1,
  origin: props.order.origin ?? true
}
const formValue = ref(defaultFormValue)
const limSelf = ref(props.order.lim === 'self')

function nextStep() {
  isValiding.value = true
  formRef.value?.validate((error) => {
    isValiding.value = false
    if (!error) {
      formError.value = ''
      // @ts-ignore
      formValue.value.lim = limSelf.value ? 'self' : formValue.value.lim
      emit('next', formValue.value)
    } else {
      formError.value = error[0][0].message
    }
  })
}
function limitValidator(_: FormItemRule, value: number) {
  if (!value) {
    formError.value = 'Please input limit'
    return new Error('Please input limit')
  } else if (value > formValue.value.max) {
    formError.value = 'Limit must be less than total supply'
    return new Error('Limit must be less than total supply')
  } else {
    formError.value = ''
    return true
  }
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
          if (index !== -1) {
            formError.value = 'Token already exists'
            reject(Error('Token already exists'))
          }
          formError.value = ''
          resolve()
        }
        formError.value = ''
        resolve()
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const rules: any = {
  tick: {
    required: true,
    trigger: ['input', 'blur'],
    validator: tickValidator
  },
  max: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur']
  },
  id: {
    required: false,
    type: 'number',
    validator: idValidator,
    trigger: 'blur'
  },
  lim: {
    required: true,
    type: 'number',
    validator: limitValidator,
    trigger: ['input', 'blur']
  },
  dec: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur']
  },
  ug: {
    required: true,
    type: 'boolean',
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
      <n-form-item label="Tick" path="tick" class="form-item">
        <span class="label">Ticker</span>
        <n-input
          v-model:value="formValue.tick"
          class="input"
          placeholder="Input ticker"
        />
      </n-form-item>
      <n-form-item label="Total Supply" path="max" class="form-item">
        <span class="label">Total Supply</span>
        <n-input-number
          v-model:value="formValue.max"
          class="input"
          :show-button="false"
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
          :min="1"
          :precision="0"
          class="input"
        />
      </n-form-item>
      <n-form-item path="lim" class="form-item">
        <span class="label">Mint Limit</span>
        <div class="lim-input">
          <n-input-number
            v-model:value="formValue.lim"
            :show-button="false"
            :parse="parseCurrency"
            :format="formatCurrency"
            class="input"
            :disabled="limSelf"
          />
          <div v-if="props.orcType === 'orc-cash'" class="self-switch">
            <n-switch v-model:value="limSelf" size="small" class="toogle" />
            <span>Self</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <info-icon :size="14" />
              </template>
              Only the wallet address holding the deploy inscription can mint
              the token supply
            </n-tooltip>
          </div>
        </div>
      </n-form-item>
      <n-form-item path="dec" class="form-item">
        <span class="label">Decimal</span>
        <n-input-number
          v-model:value="formValue.dec"
          :show-button="false"
          :max="18"
          :min="1"
          :precision="0"
          class="input"
        />
      </n-form-item>
      <n-form-item v-show="orcType !== 'brc-20'" path="ug" class="form-item">
        <span class="label">Upgradable</span>
        <n-switch v-model:value="formValue.ug" class="upgrade-switch" />
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
  align-items: flex-start;
  gap: 0 16px;
  margin-bottom: 12px;
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
    font-size: 16px;
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
    .lim-input {
      @include flexR;
      .input {
        // width: 100%;
      }
      .self-switch {
        margin: 10px 0;
        @include flexR;
        align-items: center;
        color: #fff;
        span {
          margin-right: 4px;
          font-size: 12px;
          white-space: nowrap;
        }
        .toogle {
          margin-right: 8px;
          margin-left: 8px;
        }
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
