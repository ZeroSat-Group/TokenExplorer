<script setup lang="ts">
import {
  NUpload,
  NUploadDragger,
  NButton,
  NCollapseTransition,
  useMessage
} from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { useWallet } from '~/store/wallet'

const inscriber = useInscriber()
const wallet = useWallet()
const message = useMessage()
const isValiding = ref(false)
const error = ref('')
const emit = defineEmits(['next'])
const props = defineProps({
  order: {
    type: Array as PropType<UploadFileInfo[]>,
    default: () => []
  }
})
const files = ref<UploadFileInfo[]>(props.order)
async function nextStep() {
  isValiding.value = true
  error.value = ''
  if (files.value.length === 0) {
    error.value = 'Please select file'
    isValiding.value = false
    return
  }
  if (inscriber.testnet) {
    wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
  } else {
    wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
  }
  const inscribeFiles = files.value
  files.value = []
  isValiding.value = false
  error.value = ''
  await nextTick()
  emit('next', inscribeFiles)
}
function beforeUpdate(options: { file: UploadFileInfo }) {
  const file = options.file
  if (file.file?.size && file.file?.size > 1024 * 365) {
    message.warning('File size should be less than 365KB')
    return false
  }
  error.value = ''
  return true
}
</script>

<template>
  <div class="inscribe-text">
    <div class="subtitle">
      <span>{{ files.length }} files</span>
      <n-button quaternary class="remove-all-button" @click="files = []">
        Remove all
      </n-button>
    </div>
    <n-upload
      v-model:file-list="files"
      multiple
      directory-dnd
      :max="5"
      class="file-uploader"
      :show-file-list="false"
      @before-upload="beforeUpdate"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <upload-icon />
        </div>
        <n-text class="upload-tip">
          Click or drag a file to this area or click to select files.
        </n-text>
      </n-upload-dragger>
    </n-upload>
    <UploadFileList
      :files="files"
      @remove="(fileId: string) => files = files.filter(f => f.id !== fileId)"
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
:deep(.n-upload-dragger) {
  background-color: $background;
}

.upload-tip {
  font-size: 16px;
  color: $onBackground;
  opacity: 0.6;
}

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
    width: 100%;
    @include flexRsb;

    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      letter-spacing: 0em;
      text-align: left;
      margin: 10px 0;
      color: #ffffff66;
    }

    .remove-all-button {
      color: #ffffff66;
      height: 30px;
      border-radius: 6px;
    }
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
