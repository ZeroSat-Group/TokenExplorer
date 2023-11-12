<script setup lang="ts">
import {
  NForm,
  NFormItem,
  NButton,
  NInput,
  NInputNumber,
  FormInst,
  NCollapseTransition,
  NTooltip
} from 'naive-ui'
import { ref } from 'vue'
import { OrcOrder } from '~/types'
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
  op: 'vote',
  tick: props.order.tick ?? '',
  id: Number(props.order.id ?? '1'),
  amt: props.order.amt,
  vote: props.order.vote,
  msg: props.order.msg,
  v: props.order.v,
  repeat: 1
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
  const progress = formValue.value.amt ?? 0 / total
  const originProgress = Number(formatNumber((minted / total) * 100, 2))
  const addedProgress = Number(formatNumber(progress * 100, 2))
  return { originProgress, addedProgress }
})

const rules: any = {
  tick: {
    required: true,
    trigger: ['input', 'blur']
  },
  amount: {
    required: true,
    type: 'number',
    trigger: ['input', 'blur']
  },
  id: {
    required: false,
    type: 'number'
  }
}
</script>

<template>
  <div class="inscribe-basic-info">
    <div class="title">Vote for Proposal #{{ formValue.v }}</div>
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
          disabled
          class="input"
          placeholder="Input ticker"
        />
      </n-form-item>
      <n-form-item label="ID" path="id" class="form-item">
        <span class="label">Token ID</span>
        <n-input
          :value="formValue.id.toString()"
          disabled
          :show-button="false"
          placeholder="Please input token ID"
          class="input"
        />
      </n-form-item>
      <n-form-item v-if="!isNaN(progress.originProgress)" class="progress">
        <span />
        <n-tooltip trigger="hover">
          <template #trigger>
            <progress-bar
              :progress-data="[{ label: 'Origin', value: progress.originProgress }, { label: 'Plus', value: progress.addedProgress! }]"
            />
          </template>
          <span> {{ `+ ${progress.addedProgress}%` }}</span>
        </n-tooltip>
      </n-form-item>
      <n-form-item path="vote" class="form-item">
        <span class="label">Vote</span>
        <div class="radio-options">
          <div class="radios">
            <check-button
              :checked="formValue.vote === 'yes'"
              class="icon"
              @click="formValue.vote = 'yes'"
            />
            <span>YES</span>
          </div>
          <div class="radios">
            <check-button
              :checked="formValue.vote === 'no'"
              class="icon"
              @click="formValue.vote = 'no'"
            />
            <span>NO</span>
          </div>
        </div>
      </n-form-item>
      <n-form-item path="amt" class="form-item">
        <span class="label">Amount</span>
        <n-input-number
          v-model:value="formValue.amt"
          class="input"
          placeholder=""
          :show-button="false"
          :default-value="1"
          :parse="parseCurrency"
          :format="formatCurrency"
          :min="1"
        />
      </n-form-item>
      <n-form-item path="msg" class="form-item">
        <span class="label">Message</span>
        <n-input
          v-model:value="formValue.msg"
          type="textarea"
          class="input"
          placeholder="Input message"
        />
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

.inscribe-basic-info {
  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    margin-bottom: 20px;
    color: $onBackground;
  }
  .info-form {
    margin-bottom: 40px;
    // padding: 0 60px;

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
    align-items: flex-start;
    .label {
      color: $onBackground;
      text-align: right;
    }

    .radio-options {
      width: 100%;
      display: flex;
      justify-content: flex-start;
    }

    .radios {
      &:first-child {
        margin-right: 20px;
        margin-left: 4px;
      }
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
