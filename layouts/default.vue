<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
import { NConfigProvider, NMessageProvider } from 'naive-ui'
import { themeOverrides } from '~/utils'
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <div>
        <NuxtLoadingIndicator color="#fca121" />
        <LayoutHeader />
        <slot />
        <ModalsContainer />
        <LayoutFooter />
      </div>
    </n-message-provider>
  </n-config-provider>
</template>
