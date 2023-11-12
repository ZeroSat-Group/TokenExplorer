<script setup lang="ts">
import { NInput, useMessage } from 'naive-ui'
import { checkBitcoinAddress } from '~/utils'

const searchValue = ref('')
const message = useMessage()
const router = useRouter()
const route = useRoute()

function submit() {
  if (!searchValue.value) {
    route.query.address && router.replace({ query: undefined })
    return
  }
  const valid = checkBitcoinAddress(searchValue.value)
  if (!valid) {
    message.warning('Please enter valid btc address')
    router.replace({ query: undefined })
    return
  }
  router.replace({ query: { address: (searchValue.value ?? '').toString() } })
}

watch(
  () => route.query,
  () => {
    searchValue.value = (route.query.address ?? '').toString()
  },
  {
    immediate: true,
    deep: true
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
      @blur="submit"
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
