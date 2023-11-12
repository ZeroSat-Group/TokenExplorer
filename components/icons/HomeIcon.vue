<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 18
})
</script>
<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.375 6.75V15.75H14.625V6.75L9 2.25L3.375 6.75Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.125 10.875V15.75H10.875V10.875H7.125Z"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linejoin="round"
    />
    <path
      d="M3.375 15.75H14.625"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
</template>

<style lang="scss" scoped></style>
