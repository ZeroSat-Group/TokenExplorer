<script setup lang="ts">
import { NInput, useMessage } from 'naive-ui'

import { checkBitcoinAddress } from '~/utils'
const searchValue = ref('')
const { path } = useApi()
const message = useMessage()
const router = useRouter()
const route = useRoute()
function submit() {
  const valid = checkBitcoinAddress(searchValue.value)
  if (!valid) {
    message.warning('Please enter valid btc address')
    return
  }
  const url = path + '/address/' + searchValue.value
  router.push(url)
}

watch(
  route.params,
  () => {
    searchValue.value = (route.params.address ?? '').toString()
  },
  {
    immediate: true
  }
)
</script>

<template>
  <div class="search">
    <n-input
      v-model:value="searchValue"
      class="input"
      type="text"
      size="large"
      placeholder="bc1pk....ght5j"
      @keydown.enter="submit"
    >
      <template #prefix>
        <SearchIcon class="search-button" @click="submit" />
      </template>
    </n-input>
  </div>
</template>

<style scoped lang="scss">
.search-button {
  cursor: pointer;
}
.search {
  margin-top: 32px;
  .input {
    border: 1px solid $surface;
    padding: 6px 0;
    width: 800px;
    background: $surface;
    @include phone {
      width: calc(100vw - 28px);
      margin: 0 14px;
    }
  }
}
</style>
