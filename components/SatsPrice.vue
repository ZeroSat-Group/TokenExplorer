<script setup lang="ts">
import { NSkeleton } from 'naive-ui'
const props = defineProps({
  sats: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: '0'
  }
})
const price = computed(() => {
  if (!props.currency) {
    return
  }
  return Math.floor(Number(props.currency) * props.sats * 100) / 100
})
</script>

<template>
  <div>
    <span v-if="currency" class="price">~${{ price }}</span>
    <n-skeleton v-else height="15px" width="60px" :sharp="false" />
  </div>
</template>

<style scoped lang="scss">
.price {
  font-size: 14px;
  font-weight: 500;
  line-height: 21px;
  letter-spacing: 0em;
  text-align: left;
  color: rgba(255, 255, 255, 0.4);
}
</style>
