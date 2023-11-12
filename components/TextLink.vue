<script setup lang="ts">
const props = defineProps({
  to: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: ''
  }
})
const router = useRouter()
function onClick() {
  router.push(props.to)
}
</script>
<template>
  <div class="text-link" @click.stop="onClick">
    {{ props.text }}
  </div>
</template>
<style lang="scss" scoped>
.text-link {
  color: $primary;
  cursor: pointer;
}
</style>
