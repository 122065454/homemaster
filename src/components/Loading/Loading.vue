<template>
  <div class="Loader" :class="{'small': type === 'small'}" v-show="status">
    <img :src="mdex" alt="loading-icon" />
  </div>
</template>
<script>

export default {
  data: () => ({
    mdex: require('@/assets/loading_mdex.png'),
    // 初始loading
    timeout: null,
    // loading状态
    status: true,
  }),
  props: {
    type: {
      type: String,
      default: 'all',
    },
    time: {
      type: Number/String,
      default: 10000,
    }
  },
  watch: {
    status() {
      if (this.status === true) this._initStatus()
    }
  },
  mounted() {
    this._initStatus()
  },
  methods: {
    _initStatus() {
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.status = false
      }, +this.time)
    }
  },
  destroyed() {
    clearTimeout(this.timeout)
  }
};
</script>
<style lang="less">

@keyframes rotate{
  0% { transform: scale(1); }
  60% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.Loader {
  position: relative;
  display: flex;
  z-index: 998;
  background-color: #fff;
  pointer-events: none;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  animation: rotate 800ms linear infinite;
  height: 100vh;
  & > * {
    width: 72px;
  }
}

.small {
  height: 250px;
}
</style>

