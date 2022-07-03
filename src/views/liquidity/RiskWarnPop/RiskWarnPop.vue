<template>
  <div class='popWrap' :class="[chainName, getLanguage]" v-show="status">
    <div class='pop'>
      <!-- 风险提示标题 -->
      <div class="title-bar">
        <span class="text Bold">{{$t('Prompt')}}</span>
        <img :src="close" alt="" @click="_closeHandle">
      </div>
      <div class="voucher-topic">
        <p>{{$t('RiskCon1')}}</p>
        <p>{{$t('RiskCon2')}}</p>
      </div>
      <!-- 风险提示勾选 -->
      <div class="check-rule" @click="_checkHandle">
        <img :src="checkStatus ? (chainName === 'Heco' ? hecoCheck : bscCheck) : unCheck" alt=''>
        <span class="text">{{$t('RiskChek')}}</span>
      </div>
      <!-- 按钮 -->
      <button class="pledge-btn text" :class="{'confirm-btn': checkStatus}" :disabled="!checkStatus" @click="_confirmHandle">{{$t('Confirm')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "RiskWarnPop",
  data() {
    return {
      // 关闭图标
      close: require('@/assets/exit.png'),
      // 提示
      start: require('@/assets/star-icon.png'),
      // 空勾选框
      unCheck: require('@/assets/unCheck.png'),
      // bsc勾选
      bscCheck: require('@/assets/Bsc-Check.png'),
      // heco勾选
      hecoCheck: require('@/assets/Check.png'),
      // 勾选状态(false未勾选/ture已勾选)
      checkStatus: false,
      // 控制弹框显隐
      status: false,
    }
  },
  mounted() {},
  methods: {
    // 关闭弹框
    _closeHandle() {
      this.status = !this.status
      this.checkStatus = false
    },
    // 勾选
    _checkHandle() {
      this.checkStatus = !this.checkStatus
    },
    // 确认
    _confirmHandle() {
      this.status = !this.status
      this.$store.commit('liquidity/changRiskShow', {[this.chainName]: false})
      this.checkStatus = false
    }
  }
}
</script>

<style lang="less" scoped>
@import "./RiskWarnPop.less";
</style>
