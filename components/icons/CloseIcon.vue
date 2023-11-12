<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 22C17.5229 22 22 17.5229 22 12C22 6.47715 17.5229 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5229 6.47715 22 12 22Z"
      stroke="white"
      stroke-opacity="0.4"
      stroke-width="2"
      stroke-linejoin="round"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.5358 9.87874C15.9264 9.48821 15.9264 8.85505 15.5358 8.46452C15.1453 8.074 14.5121 8.074 14.1216 8.46452L12.0004 10.5857L9.87923 8.46452C9.4887 8.074 8.85554 8.074 8.46501 8.46452C8.07449 8.85505 8.07449 9.48821 8.46501 9.87874L10.5862 11.9999L8.46477 14.1214C8.07424 14.5119 8.07424 15.1451 8.46477 15.5356C8.85529 15.9261 9.48846 15.9261 9.87898 15.5356L12.0004 13.4141L14.1219 15.5356C14.5124 15.9261 15.1456 15.9261 15.5361 15.5356C15.9266 15.1451 15.9266 14.5119 15.5361 14.1214L13.4146 11.9999L15.5358 9.87874Z"
      fill="white"
      fill-opacity="0.4"
    />
  </svg>
</template>

<style lang="scss" scoped>
.close-icon {
  fill: $onBackground;
}
</style>
