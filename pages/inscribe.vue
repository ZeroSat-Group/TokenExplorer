<script setup lang="ts"></script>
<template>
  <div class="inscribe-page">
    <div class="title">Inscribe</div>
    <div class="inscribe-container">
      <div class="inscribe-left" />
      <div class="inscribe-center">
        <inscribe-tabs />
      </div>
      <div class="inscribe-right">
        <inscribe-tops />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.inscribe-page {
  @include flexC;
  width: 100%;
  background: $background;

  .inscribe-container {
    @include flexRc;
    align-items: flex-start;

    @include phone {
      @include flexCc;
    }

    .inscribe-center {
      @include flexCc;
    }

    .inscribe-right {
      margin-left: 30px;
    }

    .inscribe-right,
    .inscribe-left {
      width: 330px;
      @include flexCc;

      @include phone {
        margin: 0;
        width: calc(100% - 32px);
      }
    }
  }

  .title {
    margin-top: 145px;
    font-size: 32px;
    font-weight: 700;
    line-height: 42px;
    letter-spacing: 0em;
    text-align: center;
    color: $primary;
  }
  .button {
    width: 200px;
  }
}
</style>
