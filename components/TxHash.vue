<script setup lang="ts">
import { shortAddress, toExplorer } from '~/utils'
const props = defineProps({
  hash: {
    type: String,
    default: ''
  },
  compact: {
    type: String,
    default: 'small'
  }
})
</script>
<template>
  <div class="tx-hash" @click="toExplorer({ hash: props.hash })">
    {{ props.compact === 'small' ? shortAddress(props.hash, 8) : props.hash }}
  </div>
</template>

<style scoped lang="scss">
.tx-hash {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
  font-size: 14px;
  word-break: break-all;
}
</style>
