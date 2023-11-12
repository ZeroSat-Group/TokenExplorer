<script setup lang="ts">
import { VueFinalModal, useVfm } from 'vue-final-modal'
const porps = defineProps<{
  name: string
  title?: string
  beforeClose?: Function
  fullscreen?: boolean
}>()

const vfm = useVfm()
function close() {
  vfm.close(porps.name)
}
</script>

<template>
  <vue-final-modal
    :modal-id="name"
    class="dialog-container fullscreen"
    content-class="dialog-content"
    overlay-transition="vfm-fade"
    content-transition="vfm-fade"
  >
    <div class="container" :class="{ 'fullscreen-container': fullscreen }">
      <div class="header">
        <!-- <div class="title">
          {{ title }}
        </div> -->
        <div class="icon" @click.stop="close">
          <icon-wrapper>
            <close-icon class="close-icon" />
          </icon-wrapper>
        </div>
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </vue-final-modal>
</template>

<style lang="scss">
.dialog-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed !important;

  @include phone() {
    .fullscreen {
      width: 100%;
      height: 100%;
    }
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  .container {
    width: 800px;
    background: rgba(18, 22, 21, 1);
    border-radius: 8px;
    @include flexCc();
    @include phone {
      width: calc(100vw - 10px);
      margin: 0;
      @include flexC();
      &.fullscreen-container {
        width: 100%;
        height: 100%;
        margin: 0;
      }
    }
    .header {
      position: relative;
      width: calc(100% - 28px);
      text-align: center;
      // margin: 0 14px;
      // padding: 24px 4px 14px 4px;

      .title {
        font-size: 15px;
        font-weight: bold;
        color: $onBackground;
        line-height: 21px;
        overflow: hidden;
      }
      .icon {
        position: absolute;
        width: 24px;
        height: 24px;
        right: 0px;
        top: 10px;
        bottom: 0;
        cursor: pointer;
      }
    }
    .overlay-scrollbars {
      max-height: calc(100vh - 60px - 89px) !important;
    }
    .content {
      padding: 0 23px;
      padding-bottom: 20px;
      width: 100%;
      height: auto;

      @include phone {
        height: auto;
      }
    }
  }
}
</style>
