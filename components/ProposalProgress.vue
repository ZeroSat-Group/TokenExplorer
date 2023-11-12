<script setup lang="ts">
import { NTooltip } from 'naive-ui'
defineProps({
  voteYes: {
    type: String,
    default: '0'
  },
  voteNo: {
    type: String,
    default: '0'
  },
  quorum: {
    type: String,
    default: ''
  },
  pass: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="proposal-progress">
    <n-tooltip trigger="hover">
      <template #trigger>
        <progress-bar
          :progress-data="[
            { label: 'Yes', value: Number(voteYes) },
            { label: 'No', value: Number(voteNo) }
          ]"
        />
      </template>
      <span>
        Yes <span style="color: #439d09">{{ voteYes }}%</span> | No
        <span style="color: red">{{ voteNo }}%</span> | Pass
        <span style="color: #439d09">{{ pass }}%</span> | Quorum
        <span style="color: red">{{ quorum }}%</span>
      </span>
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}
.proposal-progress {
}
</style>
