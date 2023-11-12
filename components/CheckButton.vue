<script setup lang="ts">
const props = defineProps({
  checked: {
    type: Boolean,
    required: false
  },
  color: {
    type: String,
    default: '#fca121'
  }
})

const activeStyle = () => {
  if (props.checked) {
    return {
      backgroundColor: props.color,
      borderColor: props.color
    }
  }
}
</script>

<template>
  <div class="check-button" :style="activeStyle()">
    <svg
      width="13"
      height="10"
      viewBox="0 0 13 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-show="props.checked"
        d="M1.63672 5.00002L4.90945 8.27275L11.4549 1.72729"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.check-button {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #c4c4c4;
  display: inline-block;
  text-align: center;
  transition: all 0.3s ease-in-out;
}
</style>
