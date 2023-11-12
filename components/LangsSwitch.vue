<script lang="ts" setup>
import { NDropdown, NButton } from 'naive-ui'
const { locale, setLocale } = useI18n()
const options = [
  {
    label: '繁體中文',
    key: 'zh'
  },
  {
    label: 'English',
    key: 'en'
  }
]

const selected = computed(() => {
  return options.find((option) => option.key === locale.value)?.label
})
</script>

<template>
  <div>
    <n-dropdown trigger="hover" :options="options" @select="setLocale">
      <n-button strong round secondary>
        {{ selected }}
      </n-button>
    </n-dropdown>
  </div>
</template>
