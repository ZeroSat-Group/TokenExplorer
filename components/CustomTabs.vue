<template>
  <div class="tab-bar" :style="tabBarStyle">
    <div
      v-for="tab in tabs"
      :key="tab.key"
      class="tab"
      :class="{ selected: tab.key === activeTab, border }"
      :style="tabStyle"
      @click="selectTab(tab.key)"
    >
      {{ tab.name }}
    </div>
    <div class="indicator" :style="indicatorStyle" />
  </div>
</template>

<script lang="ts" setup>
interface TabType {
  key: string
  name: string
}
const props = defineProps({
  tabs: {
    type: Array as PropType<TabType[]>,
    required: true
  },
  activeTab: {
    type: String,
    default: ''
  },
  border: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['select'])
const tabBarStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${props.tabs.length}, minmax(${
      props.compact ? '36px' : '48px'
    }, auto))`,
    gap: props.compact ? '0 6px' : '0 12px'
  }
})
const tabStyle = computed(() => {
  return {
    padding: props.compact ? '2px 4px' : '2px 6px',
    height: props.compact ? '28px' : '36px'
  }
})
const indicatorStyle = computed(() => {
  const index = props.tabs.map((t) => t.key).indexOf(props.activeTab)
  const width = 100 / props.tabs.length + '%'
  const left = (100 / props.tabs.length) * index + '%'
  return {
    left,
    width
  }
})
function selectTab(value: string) {
  emit('select', value)
}
</script>

<style lang="scss" scoped>
.tab-bar {
  position: relative;
  display: grid;
  gap: 0px 12px;
  border-radius: 6px;
  .tab {
    cursor: pointer;
    height: 36px;
    padding: 2px 6px;
    color: $onSecondary;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0em;
    background: rgba(18, 22, 21, 1);
    border-radius: 4px;
    z-index: 5;
    white-space: nowrap;
    overflow: hidden;
    @include flexCc;
    &.border {
      border: 1px solid rgba(36, 36, 36, 1);
      padding: 6px 17px;
    }
    &.selected {
      color: #000;
      background: $primary;
      transition: color 0.3s ease-out;
    }
  }

  // .indicator {
  //   position: absolute;
  //   height: 32px;
  //   margin: 2px 0px;
  //   border-radius: 4px;
  //   width: 50%;
  //   left: 0%;
  //   background: $primary;
  //   transition: all 0.3s ease-out;
  // }
}
</style>
