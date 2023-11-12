<script setup lang="ts">
import { NInput, NButton, NCollapseTransition } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { useWallet } from '~/store/wallet'

const inscriber = useInscriber()
const wallet = useWallet()
const isValiding = ref(false)
const error = ref('')
const emit = defineEmits(['next'])
const props = defineProps({
  order: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})
const mode = computed(() => inscriber.textMode)
const inscribeText = ref(props.order?.join('\n') ?? '')
async function nextStep() {
  isValiding.value = true
  error.value = ''
  if (!inscribeText.value) {
    error.value = 'Please input inscribe text'
    isValiding.value = false
    return
  }
  if (inscriber.testnet) {
    wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
  } else {
    wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
  }
  const inscribeTexts =
    mode.value === 'single'
      ? [inscribeText.value]
      : inscribeText.value.split('\n').filter((a) => a !== '')
  inscribeText.value = ''
  isValiding.value = false
  error.value = ''
  await nextTick()
  emit('next', inscribeTexts)
}
</script>

<template>
  <div class="inscribe-text">
    <div class="radio-options">
      <div class="radios">
        <check-button
          :checked="mode === 'single'"
          class="icon"
          @click="inscriber.setTextMode('single')"
        />
        <span>Single</span>
      </div>
      <div class="radios">
        <check-button
          :checked="mode === 'bulk'"
          class="icon"
          @click="inscriber.setTextMode('bulk')"
        />
        <span>Bulk</span>
      </div>
    </div>
    <div class="subtitle">
      If single, we will inscribe exactly what is there. If bulk, we will
      inscribe one for every new line.
    </div>
    <n-input
      v-model:value="inscribeText"
      class="input"
      type="textarea"
      rows="7"
      placeholder="infosat
orc-cash
etc...
"
    />
    <n-collapse-transition :show="!!error">
      <div class="form-error">
        {{ error }}
      </div>
    </n-collapse-transition>
    <n-button color="#fca121" class="next-button" @click="nextStep">
      <SpinnerLoader v-if="isValiding" color="#000" class="loading-icon" />
      <span v-else>Next</span>
    </n-button>
  </div>
</template>

<style scoped lang="scss">
.inscribe-text {
  padding: 18px 20px 20px 40px;
  @include flexCc;
  width: 100%;

  .input {
    width: 100%;
    background: rgba(7, 9, 8, 1);
    border: 1px solid #28302e;
  }

  .subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0em;
    text-align: left;
    margin: 10px 0;
    color: #ffffff66;
  }

  .radio-options {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 20px;
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

  .form-error {
    font-size: 16px;
    text-align: center;
    color: #ff4d4f;
  }

  .next-button {
    margin-top: 20px;
    color: #000;

    .loading-icon {
      height: 20px;
      width: 20px;
    }
  }
}
</style>
