<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <svg
    width="14"
    height="14"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.875 4.66185V2.92969C4.875 2.3472 5.3472 1.875 5.92969 1.875H15.0703C15.6528 1.875 16.125 2.3472 16.125 2.92969V12.0703C16.125 12.6528 15.6528 13.125 15.0703 13.125H13.3186"
      stroke="#FCA121"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.0703 4.875H2.92969C2.3472 4.875 1.875 5.3472 1.875 5.92969V15.0703C1.875 15.6528 2.3472 16.125 2.92969 16.125H12.0703C12.6528 16.125 13.125 15.6528 13.125 15.0703V5.92969C13.125 5.3472 12.6528 4.875 12.0703 4.875Z"
      stroke="#FCA121"
      stroke-width="2"
      stroke-linejoin="round"
    />
  </svg>
</template>

<style lang="scss" scoped></style>
