<script setup lang="ts">
import { NInput, useMessage, NDropdown } from 'naive-ui'
const emit = defineEmits(['select'])
const route = useRoute()
const router = useRouter()
const message = useMessage()
const searchValue = ref(route.params.id as string | undefined)
const tokenType = ref<'holding' | 'deployed'>('holding')

function submit() {
  const valid = checkBitcoinAddress(searchValue.value as string)
  if (!valid) {
    message.warning('Invalid valid bitcoin address')
    return
  }
  const url = '/address/' + searchValue.value
  router.replace(url)
}
const options = [
  {
    label: 'Holding',
    key: 'holding'
  },
  {
    label: 'Deployed',
    key: 'deployed'
  }
]
function selectType(type: 'holding' | 'deployed') {
  tokenType.value = type
  emit('select', type)
}
</script>

<template>
  <div class="address-search">
    <n-dropdown
      trigger="hover"
      placement="bottom-start"
      :options="options.filter((o) => o.key !== tokenType)"
      @select="selectType"
    >
      <div class="select-type">
        <div>{{ options.find((o) => o.key === tokenType)?.label }}</div>
        <dropdown-icon />
        <div class="divider" />
      </div>
    </n-dropdown>
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
.address-search {
  margin-top: 32px;
  @include flexR;
  @include phone {
    width: calc(100% - 28px);
    margin: 0 14px;
  }
  .select-type {
    @include flexR;
    border: 1px solid $surface;
    height: 43px;
    padding-left: 16px;
    background: $surface;
    color: $onBackground;
    font-size: 14px;
    font-weight: 400;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    svg {
      margin-left: 18px;
    }
    .divider {
      background-color: #fff;
      opacity: 0.1;
      width: 1px;
      height: 80%;
      margin: 4px 12.5px;
    }
  }
  .input {
    height: 43px;
    border: 1px solid $surface;
    // padding: 6px 0;
    width: 800px;
    background: $surface;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
    @include flexR;
    @include phone {
      width: 100%;
    }
  }
}
</style>
