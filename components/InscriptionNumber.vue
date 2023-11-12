<script setup lang="ts">
import { toExplorer } from '~/utils'
const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  },
  inscriptionID: {
    type: String,
    default: ''
  }
})
</script>
<template>
  <div
    class="inscription-number"
    @click="toExplorer({ address: props.inscriptionID, isInscription: true })"
  >
    {{ '#' + inscriptionNumber }}
  </div>
</template>

<style scoped lang="scss">
.inscription-number {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
  font-size: 14px;
  word-break: break-all;
}
</style>
