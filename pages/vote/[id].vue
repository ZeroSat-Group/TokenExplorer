<script setup lang="ts"></script>

<template>
  <div class="proposal-detail-page">
    <VoteProposalDetail />
    <VoteProposalTable />
  </div>
</template>

<style lang="scss" scoped>
.proposal-detail-page {
  @include flexC;
  width: 100%;
  background: $background;
  min-height: calc(100vh - 1px);
  padding-top: 100px;
}
</style>
