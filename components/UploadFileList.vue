<script setup lang="ts">
import { NScrollbar, UploadFileInfo } from 'naive-ui'
const emit = defineEmits(['remove'])
const props = defineProps({
  files: {
    type: Array as PropType<UploadFileInfo[]>,
    required: true
  }
})
</script>

<template>
  <n-scrollbar style="max-height: 300px">
    <div
      v-for="(file, index) in props.files"
      :key="index"
      class="mint-data-item"
    >
      <div class="data-index">
        <span>
          {{ index + 1 }}
        </span>
      </div>
      <div class="data">
        {{ file.name }}
      </div>
      <div class="tx-links">
        <div>{{ file.file?.size }}</div>
        <div class="icon-button" @click="emit('remove', file.id)">
          <close-icon />
        </div>
      </div>
    </div>
  </n-scrollbar>
</template>

<style scoped lang="scss">
.mint-data-item {
  height: 40px;
  margin-top: 14px;
  background: rgba(36, 36, 36, 1);
  @include flexR;
  border: 1px solid rgba(36, 36, 36, 1);
  border-radius: 4px;
  overflow: hidden;

  .data-index {
    width: 66px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    letter-spacing: 0em;
    color: $onBackground;
    @include flexCc;

    span {
      height: 24px;
      width: 24px;
      border-radius: 50%;
      background: rgba(217, 217, 217, 0.4);
      text-align: center;
      @include flexCc;
    }
  }
  .data {
    width: 100%;
    text-align: center;
    word-break: break-all;
    padding: 0 6px;
    color: $onBackground;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0em;
    text-align: center;
  }

  .tx-links {
    @include flexR;
  }
  .icon-button {
    cursor: pointer;
  }
  .tx-link {
    color: $primary;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    margin-left: 10px;
    text-decoration: underline;
  }
}
</style>
