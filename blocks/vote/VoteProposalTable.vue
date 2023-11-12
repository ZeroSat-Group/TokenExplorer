<script setup lang="ts">
const route = useRoute()

const proposalID = computed<string>(() => {
  return route.params.id.toString()
})
const tabs = [
  {
    name: 'Votes',
    key: 'votes'
  }
]
const activeTab = ref(tabs[0].key)
</script>
<template>
  <div class="vote-proposal-table">
    <div class="tabs">
      <CustomTabs
        :tabs="tabs"
        :active-tab="activeTab"
        :border="true"
        @select="(value: string) => activeTab = value"
      />
    </div>
    <VoteProposalVotes
      v-show="activeTab === 'votes'"
      :proposal-i-d="proposalID"
    />
  </div>
</template>

<style scoped lang="scss">
.vote-proposal-table {
  border: 1px solid #242424;
  border-radius: 6px;
  background-color: rgba(26, 30, 29, 0.6);
  overflow: hidden;
  padding-bottom: 10px;
  @include maxWidth;

  .tabs {
    padding: 16px 36px;
    @include flexR;

    @include phone {
      margin-bottom: 20px;
      margin-top: 20px;
      width: calc(100vw - 32px);
    }
  }
}
</style>
