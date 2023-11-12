<script setup lang="ts">
import { NTooltip } from 'naive-ui'
import { formatTime } from '~/utils'
const props = defineProps({
  status: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    default: ''
  },
  inscription: {
    type: String,
    default: ''
  }
})
const tooltip = computed(() => {
  switch (props.status) {
    case 0:
      return 'This transaction is invalid'
    case 1:
      return 'Confirmed'
    case 2:
      return 'This transaction is not effective'
    default:
      return ''
  }
})

const colorStyle = computed(() => {
  switch (props.status) {
    case 0:
      return { color: '#ff4d4f', textDecorationColor: '#ff4d4f' }
    case 1:
      return { color: '#fff' }
    default:
      return ''
  }
})
</script>

<template>
  <div
    class="create-date-with-status"
    :style="colorStyle"
    @click.stop="
      toExplorer({
        hash: props.hash,
        address: inscription,
        isInscription: !!inscription
      })
    "
  >
    <span>{{ formatTime(props.timestamp) }}</span>
    <n-tooltip v-if="props.status !== 1" trigger="hover">
      <template #trigger>
        <info-icon size="14" />
      </template>
      {{ tooltip }}
    </n-tooltip>
  </div>
</template>

<style scoped lang="scss">
.create-date-with-status {
  cursor: pointer;
  text-decoration: underline;
  span {
    margin-right: 4px;
  }
}
</style>
