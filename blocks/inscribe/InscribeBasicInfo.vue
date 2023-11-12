<script setup lang="ts">
import { NFormItem } from 'naive-ui'
import { useInscriber } from '~/store/inscriber'
import { useWallet } from '~/store/wallet'
import { OrcOrder } from '~/types'
import InscribeDeployForm from '~/blocks/inscribe/InscribeDeployForm.vue'
import InscribeAirdropForm from '~/blocks/inscribe/InscribeAirdropForm.vue'
import InscribeMintForm from '~/blocks/inscribe/InscribeMintForm.vue'
import InscribeSellForm from '~/blocks/inscribe/InscribeSellForm.vue'
import InscribeVoteForm from '~/blocks/inscribe/InscribeVoteForm.vue'

const props = defineProps({
  orcType: {
    type: String,
    required: true
  },
  order: {
    type: Object as PropType<OrcOrder>,
    default: () => ({})
  },
  hideMode: {
    type: Boolean,
    default: false
  }
})
const route = useRoute()
const inscriber = useInscriber()
const wallet = useWallet()
const emit = defineEmits(['next'])
const op = ref(props.order.op ?? route.query.op ?? 'mint')
async function nextStep(value: any) {
  op.value = value.op === 'mint' ? 'deploy' : 'mint'
  if (inscriber.testnet) {
    wallet.activeBitcoinWallet?.provider.switchNetwork('testnet')
  } else {
    wallet.activeBitcoinWallet?.provider.switchNetwork('livenet')
  }
  await nextTick()
  op.value = value.op
  emit('next', value)
}

const operations = computed(() => {
  return [
    { id: 'mint', label: 'Mint', display: true, content: InscribeMintForm },
    {
      id: 'deploy',
      label: 'Deploy',
      display: true,
      content: InscribeDeployForm
    },
    {
      id: 'airdrop',
      label: 'Airdrop',
      display: props.orcType === 'orc-cash',
      content: InscribeAirdropForm
    },
    {
      id: 'sell',
      label: 'Sell',
      display: props.orcType === 'orc-cash',
      content: InscribeSellForm
    },
    {
      id: 'vote',
      label: 'Vote',
      display: false,
      content: InscribeVoteForm
    }
  ]
})
</script>

<template>
  <div class="inscribe-basic-info">
    <div v-show="!hideMode" class="title">
      {{ props.orcType.toUpperCase() }}
    </div>
    <n-form-item
      v-show="!hideMode"
      class="form-item"
      :show-feedback="false"
      :label-width="80"
    >
      <span class="label">Operation</span>
      <div class="radio-options">
        <template v-for="item in operations" :key="item.id">
          <div v-if="item.display" class="radios">
            <check-button
              :checked="op === item.id"
              class="icon"
              @click="op = item.id"
            />
            <span>{{ item.label }}</span>
          </div>
        </template>
      </div>
    </n-form-item>
    <template v-for="item in operations" :key="item.id">
      <component
        :is="item.content"
        v-if="op === item.id"
        :orc-type="orcType"
        :order="order"
        @next="nextStep"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-form-item-label) {
  width: 160px;
}
:deep(.n-form-item-blank) {
  width: 400px;
  display: grid;
  grid-template-columns: 1fr 2.5fr 10px;
  align-items: flex-start;
  gap: 0 16px;
  margin-bottom: 12px;
  @include phone {
    width: 340px;
  }
}
.inscribe-basic-info {
  width: 100%;
  padding-top: 18px;
  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: center;
    color: $onBackground;
  }
  .form-item {
    margin-top: 20px;
    padding: 0 100px;
    @include phone {
      padding: 0 30px;
    }
    .label {
      color: $onBackground;
      text-align: right;
    }
    .repeat-setting {
      @include flexR;
      .repeat-value {
        border: 1px solid #424241;
        width: 34px;
        height: 26px;
        border-radius: 6px;
        margin-right: 10px;
        color: #ffffff66;
        font-size: 12px;
        text-align: center;
        @include flexRc;
      }
    }
  }
  .buttons {
    margin-top: 10px;
    @include flexRc;
    .next-button {
      margin: auto;
      // width: 100px;
      height: 36px;
      color: #000;
      border-radius: 6px;
      .loading-icon {
        height: 20px;
        width: 20px;
      }
    }
  }
  .input {
    background: $surface;
    border: 1px solid #28302e;
    width: 100%;
    border-radius: 6px;
  }
  .divider {
    margin: 0 -100px;
    margin-bottom: 12px;
    border-top: 1px solid #28302e;
    @include phone {
      margin: 0 -20px;
    }
  }
  .radio-options {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
  .radios {
    white-space: nowrap;
    .icon {
      transform: scale(0.7);
      cursor: pointer;
    }
    span {
      color: $onBackground;
      margin-left: 2px;
      font-size: 14px;
      font-weight: 500;
      line-height: 18px;
      letter-spacing: 0em;
      text-align: left;
    }
  }
}
</style>
