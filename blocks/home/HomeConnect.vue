<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useVfm } from 'vue-final-modal'

function open() {
  const vfm = useVfm()
  vfm.open('wallet-panel-dialog')
}
</script>

<template>
  <div class="home-connect">
    <NButton type="primary" @click="open">
      {{ $t('connect') }}
    </NButton>
  </div>
</template>

<style lang="scss" scoped>
.home-connect {
}
</style>
