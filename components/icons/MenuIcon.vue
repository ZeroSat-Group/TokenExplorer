<script lang="ts" setup>
withDefaults(defineProps<{ size?: string | number }>(), {
  size: 20
})
</script>
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    :width="size"
    :height="size"
    viewBox="0 0 50 50"
    class="menu-icon"
  >
    <path
      d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"
    />
  </svg>
</template>

<style lang="scss" scoped>
.menu-icon {
  fill: $onBackground;
  cursor: pointer;
}
</style>
