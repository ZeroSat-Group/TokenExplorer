<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <div class="svg-wrapper" :style="{ width: `${size}px`, height: `${size}px` }">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.svg-wrapper {
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  @include flexRc;
}
</style>
