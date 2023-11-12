<script lang="ts" setup>
const props = defineProps({
  size: {
    type: [String, Number],
    default: 24
  }
})
</script>
<template>
  <svg
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.5 15C12.9853 15 15 12.9853 15 10.5C15 8.01472 12.9853 6 10.5 6C8.01472 6 6 8.01472 6 10.5C6 12.9853 8.01472 15 10.5 15ZM10.5 17C14.0899 17 17 14.0899 17 10.5C17 6.91015 14.0899 4 10.5 4C6.91015 4 4 6.91015 4 10.5C4 14.0899 6.91015 17 10.5 17Z"
      fill="white"
    />
    <path
      d="M13.7071 13.7071C14.0976 13.3166 14.7308 13.3166 15.1213 13.7071L19.8744 18.4602C20.2649 18.8508 20.2649 19.4839 19.8744 19.8744C19.4839 20.265 18.8507 20.265 18.4602 19.8744L13.7071 15.1213C13.3166 14.7308 13.3166 14.0976 13.7071 13.7071Z"
      fill="white"
    />
  </svg>
</template>

<style lang="scss" scoped>
.close-icon {
  fill: $onBackground;
}
</style>
