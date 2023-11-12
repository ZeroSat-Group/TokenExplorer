<script setup lang="ts">
import { shortAddress, toExplorer } from '~/utils'
const props = defineProps({
  address: {
    type: String,
    default: ''
  },
  compact: {
    type: String,
    default: 'small'
  },
  isInscription: {
    type: Boolean,
    default: false
  }
})
const { path } = useApi()
</script>
<template>
  <nuxt-link
    v-if="props.address && !isInscription"
    class="bitcoin-address"
    :to="`${path}/address/${props.address}`"
  >
    {{
      props.compact === 'large'
        ? props.address
        : props.compact === 'small'
        ? shortAddress(props.address)
        : shortAddress(props.address, 10)
    }}
  </nuxt-link>
  <div
    v-else
    class="bitcoin-address"
    @click="
      toExplorer({ address: props.address, isInscription: props.isInscription })
    "
  >
    {{
      props.compact === 'small' ? shortAddress(props.address) : props.address
    }}
  </div>
</template>

<style scoped lang="scss">
.bitcoin-address {
  cursor: pointer;
  color: $primary;
  text-decoration: underline;
  font-size: 14px;
  word-break: break-all;
}
</style>
