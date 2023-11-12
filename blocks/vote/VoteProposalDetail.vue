<script setup lang="ts">
import { NSkeleton, NProgress } from 'naive-ui'

const route = useRoute()
const { api } = useApi()

const proposalID = computed<string>(() => {
  return route.params.id.toString()
})
const { data: proposal, pending } = await useAsyncData(
  'orc20Proposal',
  () => api.orc20Propose({ proposeInscriptionId: proposalID.value }),
  {
    watch: [proposalID],
    server: false,
    immediate: true
  }
)

function toBlockPage() {
  const blockHeight = proposal.value?.proposeExpire
  if (!blockHeight) return
  toExplorer({
    block: blockHeight
  })
}
function toInscriptionPage() {
  const inscription = proposal.value?.proposeInscriptionId
  if (!inscription) return
  toOrdiExplorer(inscription)
}

function voteProgress(input: string) {
  if (!proposal.value) return '0'
  const progress =
    (Number(input) / Number(proposal.value.proposeVoteQuorumAmount)) *
    Number(proposal.value.proposePass)
  return progress
}
</script>

<template>
  <div class="title-panel">
    <div>
      <nuxt-link class="title">
        {{ proposal?.proposeTicker }}
      </nuxt-link>
      <span class="token-id"> Token ID #{{ proposal?.proposeTokenId }} </span>
    </div>
    <VoteButton v-if="proposal" :proposal="proposal" />
  </div>
  <div class="token-overview">
    <div class="title">Proposal #{{ proposal?.proposeProposeVersion }}</div>
    <div v-if="pending" class="content">
      <n-skeleton height="16px" width="100%" :sharp="false" />
      <n-skeleton
        height="16px"
        width="100%"
        :sharp="false"
        style="margin-top: 12px"
      />
      <n-skeleton
        height="16px"
        width="40%"
        :sharp="false"
        style="margin-top: 12px"
      />
    </div>
    <div v-else class="content">{{ proposal?.proposeMsg }}</div>
    <div class="divider" />
    <div class="vote-panels">
      <div class="vote-result">
        <div class="title">Results</div>
        <div class="progress-detail">
          <div v-if="proposal" class="progress-top">
            <div class="progress-top-result">
              <span>YES</span>
              <done-icon
                v-if="
                  Number(proposal.proposeVoteAmount) >=
                  Number(proposal.proposeVoteQuorumAmount)
                "
                style="margin-left: 4px"
              ></done-icon>
            </div>
            <span
              >{{ formatNumber(proposal?.proposeVoteYes ?? '0') }}
              {{ proposal?.proposeTicker }}
              {{
                formatNumber(voteProgress(proposal?.proposeVoteYes ?? '0'), 2) +
                '%'
              }}
            </span>
          </div>
          <n-skeleton
            v-else
            class="progress-top"
            height="16px"
            width="100%"
            :sharp="false"
          />
          <n-progress
            type="line"
            class="progress"
            color="#fca121"
            :show-indicator="false"
            :rail-color="'#3f3e28'"
            :height="12"
            :percentage="
              Number(
                formatNumber(voteProgress(proposal?.proposeVoteYes ?? '0'), 2)
              )
            "
          />
        </div>
        <div class="progress-detail">
          <div v-if="proposal" class="progress-top">
            <span>NO</span>
            <span
              >{{ formatNumber(proposal.proposeVoteNo) }}
              {{ proposal?.proposeTicker }}
              {{
                formatNumber(voteProgress(proposal?.proposeVoteNo ?? '0'), 2) +
                '%'
              }}
            </span>
          </div>
          <n-skeleton
            v-else
            class="progress-top"
            height="16px"
            width="100%"
            :sharp="false"
          />
          <n-progress
            type="line"
            class="progress"
            color="#fca121"
            :show-indicator="false"
            :rail-color="'#3f3e28'"
            :height="12"
            :percentage="
              Number(
                formatNumber(voteProgress(proposal?.proposeVoteNo ?? '0'), 2)
              )
            "
          />
        </div>
      </div>
      <div class="divider" />
      <div class="vote-info">
        <div class="title">Information</div>
        <div class="vote-info-item">
          <div class="name">Quorum</div>
          <div v-if="pending" class="data">
            <n-skeleton height="16px" width="100px" :sharp="false" />
          </div>
          <div v-else class="data">{{ proposal?.proposeQuorum }}%</div>
        </div>
        <div class="vote-info-item">
          <div class="name">Pass</div>
          <div v-if="pending" class="data">
            <n-skeleton height="16px" width="100px" :sharp="false" />
          </div>
          <div v-else class="data">{{ proposal?.proposePass }}%</div>
        </div>
        <div class="vote-info-item">
          <div class="name">Create</div>
          <div v-if="pending" class="data">
            <n-skeleton height="16px" width="100px" :sharp="false" />
          </div>
          <div v-else class="data">
            {{ formatTime(proposal?.proposeChainTime) }}
          </div>
        </div>
        <div class="vote-info-item">
          <div class="name">Expire</div>
          <div v-if="pending" class="data">
            <n-skeleton height="16px" width="100px" :sharp="false" />
          </div>
          <div v-else-if="proposal?.proposeExpire === 'never'" class="data">
            Never
          </div>
          <div v-else class="data expire" @click="toBlockPage">
            BLOCK {{ proposal?.proposeExpire }}
          </div>
        </div>
        <div class="vote-info-item">
          <div class="name">Inscription</div>
          <div v-if="pending" class="data">
            <n-skeleton height="16px" width="100px" :sharp="false" />
          </div>
          <div v-else class="data expire" @click="toInscriptionPage">
            {{ shortAddress(proposal?.proposeInscriptionId!) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.n-progress.n-progress--line .n-progress-icon.n-progress-icon--as-text) {
  white-space: nowrap;
}
.title-panel {
  @include maxWidth;
  @include flexR;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;

  .title {
    color: $primary;
    margin-right: 20px;
    font-size: 30px;
    line-height: 30px;
    font-weight: 500;
    letter-spacing: 0em;
    text-align: left;
  }

  .token-id {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 2px;
    font-weight: 400;
    letter-spacing: 0em;
    color: $onBackground;
  }
}
.token-overview {
  @include maxWidth;
  padding: 24px;
  margin: 0px 0 20px 0;
  border: 1px solid #242424;
  border-radius: 6px;
  background-color: rgba(26, 30, 29, 0.6);

  .divider {
    margin-bottom: 10px;
    border-top: 1px solid #ffffff14;
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0em;
    text-align: left;
    color: $onBackground;
    margin-bottom: 24px;
  }
  .content {
    font-size: 16px;
    font-weight: 500;
    line-height: 17px;
    letter-spacing: 0.5px;
    text-align: left;
    color: $onBackground;
    margin-bottom: 24px;
    opacity: 0.4;
  }
  .vote-panels {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 2px 1fr;
    gap: 0px 20px;
    @include phone {
      grid-template-columns: 1fr;
      gap: 20px 0;
    }
  }
  .vote-info {
    .title {
      font-size: 16px;
      font-weight: 500;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: $onBackground;
      margin-bottom: 12px;
    }
    .vote-info-item {
      color: $onBackground;
      width: 400px;
      color: $onBackground;
      margin-bottom: 20px;
      @include flexRsb;

      @include phone {
        width: 100%;
      }
      .name {
        font-size: 14px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0em;
        opacity: 0.4;
      }

      .data {
        font-size: 14px;
        font-weight: 400;
        line-height: 16px;
        letter-spacing: 0em;
        text-align: right;
      }
      .expire {
        color: $primary;
        cursor: pointer;
      }
    }
  }
  .vote-result {
    color: $onBackground;
    .title {
      font-size: 16px;
      font-weight: 500;
      line-height: 17px;
      letter-spacing: 0em;
      text-align: left;
      color: $onBackground;
      margin-bottom: 20px;
    }
    .progress-detail {
      @include flexC;
      align-items: flex-start;
      max-width: 400px;
      .progress-top {
        @include flexRsb;
        align-items: center;
        width: 100%;
        margin: 10px 0;
        span {
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0em;
          text-align: left;
        }
        .progress-top-result {
          @include flexR;
          align-items: flex-end;
        }
      }
    }
  }
}
</style>
