<script setup lang="ts">
import { NButton, NSpace, UploadFileInfo } from 'naive-ui'
import { computed } from 'vue'
import { generateMintDataForOrder } from '../../utils'
import { OrcOrder } from '~/types'
const emits = defineEmits(['previous', 'next'])
const props = defineProps({
  order: {
    type: Object as PropType<OrcOrder | string[] | UploadFileInfo[]>,
    required: true
  }
})
const mintData = computed(() => {
  if (Array.isArray(props.order)) {
    if (typeof props.order[0] === 'object') {
      return (props.order as UploadFileInfo[]).map((f) => f.name)
    }
    return props.order as string[]
  }
  return generateMintDataForOrder(props.order) as string[]
})

function nextStep() {
  emits('next')
}
function preStep() {
  emits('previous')
}
</script>

<template>
  <div class="inscribe-mint-data">
    <div class="title">
      Please double check your text below before continuing:
    </div>
    <!-- <div class="subtitle">
      You are about to inscribe {{ mintData.length }} ordianls.
    </div> -->
    <InscriptionList :mint-data="mintData" />
    <n-space justify="space-between" class="buttons">
      <n-button color="#171A1F" class="button prev" @click="preStep">
        Previous
      </n-button>
      <n-button color="#fca121" class="button" @click="nextStep">
        Next
      </n-button>
    </n-space>
  </div>
</template>

<style scoped lang="scss">
.inscribe-mint-data {
  .title {
    margin-top: 18px;
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
  }

  .subtitle {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
    margin-bottom: 16px;
  }

  .buttons {
    margin-top: 40px;
    margin-bottom: 30px;
    width: 100%;

    .button {
      height: 36px;
      color: #000;
      width: 200px;
      @include phone {
        width: 160px;
      }
    }
  }

  .prev {
    color: #fff !important;
    border: 1px solid white !important;
  }
}
</style>
