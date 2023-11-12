<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <svg viewBox="0 0 24 24" :width="size" :height="size" class="done-icon">
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m5 13l4 4L19 7"
    ></path>
  </svg>
</template>

<style lang="scss" scoped>
.done-icon {
  color: rgb(92, 222, 92);
}
</style>
