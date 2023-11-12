<script setup lang="ts">
const props = defineProps({
  method: {
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
  <div class="token-method" @click="toOrdiExplorer(props.inscriptionID)">
    {{ method }}
  </div>
</template>

<style scoped lang="scss">
.token-method {
  cursor: pointer;
  border: 1px solid #fff;
  margin: 0 auto;
  width: 155px;
  min-height: 28px;
  padding: 4px 10px;
  text-align: center;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  letter-spacing: 0em;
  @include flexCc;
}
</style>
