<script setup lang="ts">
import { computed } from 'vue'
const steps = [
  { name: 'Info', key: 'info' },
  { name: 'Order', key: 'order' },
  { name: 'Quote', key: 'quote' },
  { name: 'Pay', key: 'pay' },
  { name: 'Result', key: 'result' }
]

const props = defineProps({
  activeStep: {
    type: String,
    default: 'info'
  }
})

const activeIndex = computed(() => {
  return steps.findIndex((item) => item.key === props.activeStep)
})
</script>

<template>
  <div class="inscribe-order-step">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="step-item"
      :class="{ active: activeIndex === index, completed: index < activeIndex }"
    >
      <div>
        <span class="name">{{ step.name }}</span>
        <span
          v-if="index < 4"
          class="array"
          :class="{ completed: index < activeIndex }"
          >></span
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inscribe-order-step {
  @include flexRc;
  .step-item {
    font-size: 16px;
    font-weight: 400;
    line-height: 21px;
    letter-spacing: 0em;
    text-align: left;
    color: rgba(255, 255, 255, 0.4);
    &.comleted {
      color: $onBackground;
    }
    &.active {
      color: $primary;
      .name {
        text-decoration: underline;
      }
    }
    .array {
      margin-left: 6px;
      margin-right: 6px;
      text-decoration: none !important;
      color: white;
      opacity: 0.4;
      &.completed {
        color: $onBackground;
      }
    }
  }
}
</style>
