<script setup lang="ts">
import { NSkeleton, NProgress } from 'naive-ui'
import { formatNumber } from '~/utils'
const route = useRoute()
const address = computed(() => route.params.id)
const emit = defineEmits(['select'])
const { api } = useApi()

const props = defineProps({
  activeTab: {
    type: String,
    default: 'all'
  }
})
const { data, pending } = await useAsyncData(
  'orc20UserDeployedTokenInfos',
  () =>
    api.orc20TokenInfos({
      pageNo: 1,
      pageSize: 999,
      deployer: address.value as string,
      sort: 'id,asc',
      complete:
        props.activeTab === 'all'
          ? undefined
          : props.activeTab === 'completed'
          ? 'true'
          : 'false'
    }),
  {
    watch: [address, props],
    server: false
  }
)
const selectedTokenID = ref<string | undefined>('')

function selectToken(value: string | undefined) {
  selectedTokenID.value = value
  emit('select', selectedTokenID.value)
}
function updateSelectedToken() {
  if (data.value) {
    if (data.value?.items.length > 0) {
      selectToken(data.value?.items[0].tokenInfoInscriptionNumber)
    } else {
      selectToken('')
    }
  } else {
    selectToken(undefined)
  }
}

watch(data, updateSelectedToken, { immediate: true })
</script>

<template>
  <div class="address-deployed-tokens">
    <template v-if="pending">
      <div v-for="i in 3" :key="i">
        <n-skeleton height="134px" width="100%" :sharp="false" />
      </div>
    </template>
    <div
      v-for="(token, index) in data?.items"
      v-else
      :key="index"
      class="token-card"
      :class="{
        selected: token.tokenInfoInscriptionNumber === selectedTokenID
      }"
      @click="selectToken(token.tokenInfoInscriptionNumber)"
    >
      <div class="top-panel">
        <div class="ticker">
          {{ token.tokenInfoTicker }}
        </div>
        <n-progress
          type="line"
          class="progress"
          color="#fca121"
          :percentage="
            Number(formatNumber(Number(token.tokenInfoProgress ?? 0) * 100, 2))
          "
        />
      </div>
      <div class="info">
        <span class="name">Token ID</span>
        <span class="value">{{ token.tokenInfoOrc20Id }}</span>
      </div>
      <div class="info">
        <span class="name">Inscription #</span>
        <span class="value">{{ '#' + token.tokenInfoInscriptionNumber }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.address-deployed-tokens {
  margin-right: 24px;
  width: 212px;
  > :not(:last-child) {
    margin-bottom: 24px;
  }
  @include phone {
    width: 100vw;
    overflow-x: scroll;
    display: flex;
    margin-right: 0px;
    margin-left: 14px;
    margin-bottom: 20px;
    flex-shrink: 0;
    flex-direction: row;
    > :not(:last-child) {
      margin-bottom: 0px;
      margin-right: 24px;
    }
  }
  .token-card {
    width: 212px;
    min-width: 212px;
    padding: 17px 16px;
    position: relative;
    overflow: hidden;
    border: 1px solid $background;
    &:hover,
    &.selected {
      background: $surface;
      border-radius: 6px;
      border: 1px solid rgba(36, 36, 36, 1);
    }

    &.selected::after {
      content: '';
      position: absolute;
      height: 100%;
      left: 0px;
      top: 0;
      background-color: $primary;
      width: 4px;
      border-radius: 4px;
    }
    .top-panel {
      @include flexRsb;
      margin-bottom: 12.45px;

      .ticker {
        color: $primary;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0em;
        text-align: left;
      }
      .progress {
        width: 100px;
      }
    }

    .info {
      width: 100%;
      @include flexRsb;
      color: $onBackground;
      margin-bottom: 3px;

      .name {
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: left;
        opacity: 0.5;
      }

      .value {
        font-size: 14px;
        font-weight: 400;
        line-height: 17px;
        letter-spacing: 0em;
        text-align: right;
        color: $onBackground;
      }
    }
  }
}
</style>
