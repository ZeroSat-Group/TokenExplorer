<script setup lang="ts">
type ProgressData = {
  label: string
  value: number
}
const props = defineProps({
  progressData: {
    type: Array as PropType<ProgressData[]>,
    required: true
  }
})
const colors = ['#fca121', '#3fdd94']

const progressStyle = computed(() => {
  let colorString = `${colors[0]} 0%, `
  let progress = 0

  props.progressData.forEach((data, index) => {
    progress += data.value
    const color = colors[index % 2]
    const colorNext = colors[(index + 1) % 2]
    colorString += `${color} ${progress}%, `
    if (index !== props.progressData.length - 1) {
      colorString += `${colorNext} ${progress}%, `
    } else {
      colorString += `rgb(63, 62, 40) ${progress}%, rgb(63, 62, 40) 100%`
    }
  })
  return {
    background: `linear-gradient(to right, ${colorString})`
  }
})
const totalProgress = computed(() => {
  const total = props.progressData.reduce((total, item) => {
    return total + item.value
  }, 0)
  return formatNumber(total, 2)
})
</script>

<template>
  <div class="progress-bar">
    <div class="progress" :style="progressStyle" />
    <span class="text" :class="{ exceed: Number(totalProgress) > 100 }">{{
      totalProgress + '%'
    }}</span>
  </div>
</template>

<style scoped lang="scss">
.progress-bar {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  .progress {
    width: 100%;
    height: 6px;
    border-radius: 3px;
  }
  .text {
    white-space: nowrap;
    color: $onBackground;
    font-size: 12px;
  }
  .exceed {
    color: #ff4d4f;
  }
}
</style>
