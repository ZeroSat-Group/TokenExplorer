<script setup lang="ts">
import { NEmpty, NSkeleton } from 'naive-ui'
import { formatTime, getOrderStatusString } from '../../utils'
import { useInscriber } from '../../store/inscriber'
const inscriber = useInscriber()
inscriber.updateStatus()
const emit = defineEmits(['openOrder'])
const { loading } = useUpdateOrders()
</script>

<template>
  <div class="inscribe-orders">
    <div class="title">Order History</div>
    <n-empty
      v-if="inscriber.orders.length === 0"
      class="result-empty"
      description="No order found"
    />
    <div
      v-for="item in inscriber.orders"
      v-else
      :key="item.id"
      class="order-card"
      @click="emit('openOrder', item)"
    >
      <div class="info">
        <div>{{ item.orderNo }}</div>
        <div class="date">
          {{ formatTime(item.date) }}
        </div>
      </div>
      <n-skeleton
        v-if="loading && item.status < 2"
        height="20px"
        width="80px"
        :sharp="false"
      />
      <div v-else class="status">
        {{ getOrderStatusString(item.status) }}
      </div>
    </div>
    <!-- <div class="pagination">
      <n-pagination v-model:page="pageNo" :page-count="app.orders.length" />
    </div> -->
  </div>
</template>

<style scoped lang="scss">
.inscribe-orders {
  @include flexC;
  margin-top: 20px;
  width: 640px;
  padding: 34px 30px;
  border-radius: 10px;
  background: linear-gradient(0deg, #1a1e1d, #1a1e1d),
    linear-gradient(0deg, #242424, #242424);
  @include phone {
    width: calc(100% - 32px);
    padding: 34px 10px;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    line-height: 23px;
    letter-spacing: 0em;
    text-align: left;
    color: white;
  }

  .order-card {
    cursor: pointer;
    margin-top: 20px;
    width: 100%;
    background: linear-gradient(0deg, #242424, #242424),
      linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1));
    border: 1px solid #242424;
    color: $onBackground;
    padding: 14px 20px;
    @include flexRsb;
    .info {
      @include flexCc;
      .date {
        color: #ffffff66;
      }
    }
  }

  .result-empty {
    width: 100%;
    margin: 40px auto;
  }

  .pagination {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
