<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <svg
    width="104"
    height="104"
    viewBox="0 0 104 104"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M52 17.3334C67.7733 17.3334 80.9033 28.5567 83.85 43.5067C95.1167 44.2867 104 53.56 104 65C104 76.96 94.2933 86.6667 82.3333 86.6667H26C11.6567 86.6667 0 75.01 0 60.6667C0 47.2767 10.14 36.2267 23.1833 34.84C28.6 24.44 39.4767 17.3334 52 17.3334ZM60.6667 56.3334V73.6667H43.3333V56.3334H30.3333L52 34.6667L73.6667 56.3334H60.6667Z"
      fill="#606060"
    />
  </svg>
</template>
