<template>
  <modal class="message-modal" :class="className" :color="color" :title="title" :buttonsHidden="!acceptText && !cancelText"
    v-bind="{acceptText, cancelText, cancel, accept}"
  >
    <div v-html="text"></div>
  </modal>
</template>
<script>
export default {
  props: {
    className: String,
    title: {
      type: String,
      default: '提示信息',
    },
    color: {
      type: String,
      default: 'primary'
    },
    text: {
      default: ''
    },
    acceptText: {
      default: "",
      type: String
    },
    cancelText: {
      default: "",
      type: String
    },
    cancel: {
      default: () => {},
      type: Function
    },
    accept: {
      default: () => {},
      type: Function
    },
  }
}
</script>
<style lang="less">
.message-modal .vs-dialog {
  width: 400px !important;
}
</style>