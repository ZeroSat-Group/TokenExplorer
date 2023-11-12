<script setup lang="ts">
const props = defineProps({
  inscriptionNumber: {
    type: String,
    default: ''
  }
})
const { api } = useApi()

const { data, pending } = await useAsyncData(
  'orc20TokenInfoDetail',
  () =>
    api.orc20TokenInfos({
      pageNo: 1,
      pageSize: 1,
      inscription: props.inscriptionNumber
    }),
  {
    watch: [props],
    server: false
  }
)

const orc20TokenInfo = computed(() => {
  return data.value?.items[0]
})
</script>

<template>
  <div class="token-detail">
    <token-progress
      v-if="orc20TokenInfo"
      :inscription-number="props.inscriptionNumber"
      :token-info="orc20TokenInfo"
    />
    <token-overview
      :inscription-number="props.inscriptionNumber"
      :token-info="orc20TokenInfo"
      :pending="pending"
    />
    <token-table
      :inscription-number="props.inscriptionNumber"
      :token-info="orc20TokenInfo"
    />
  </div>
</template>

<style lang="scss" scoped>
.token-detail {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
}
</style>
