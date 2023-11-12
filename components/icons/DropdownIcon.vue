<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number; color?: string }>(), {
  size: 20,
  color: 'white'
})
</script>
<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12 17.4142L5.29291 10.7071C4.90239 10.3166 4.90239 9.68342 5.29291 9.29289C5.68344 8.90237 6.3166 8.90237 6.70713 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289Z"
      :fill="color"
    />
  </svg>
</template>
<style lang="scss" scoped>
.close-icon {
  fill: $onBackground;
}
</style>
