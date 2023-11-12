<script setup lang="ts">
import { NTooltip } from 'naive-ui'
defineProps({
  message: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div class="proposal-message">
    <n-tooltip trigger="hover">
      <template #trigger>
        <span
          style="
            width: 250px;
            display: -webkit-box;
            -webkit-line-clamp: 1; /* number of lines to show */
            line-clamp: 1;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
          "
        >
          {{ message }}
        </span>
      </template>
      <span style="max-width: 200px">
        {{ message }}
      </span>
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}
.proposal-message {
}
</style>
