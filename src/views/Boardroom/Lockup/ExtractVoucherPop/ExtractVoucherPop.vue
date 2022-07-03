<template>
  <div class='popWrap' :class="[chainName, getLanguage]" v-show="status">
    <div class='pop'>
      <!-- 提取凭证标题 -->
      <div class="title-bar">
        <span class="text Bold">{{$t('Claim')}} {{lockInfo.voucher}}</span>
        <img :src="close" alt="" @click="_closeHandle">
      </div>
      <!-- 提取凭证说明 -->
      <div class="voucher-topic" v-for="(item, i) in checkList" :key="`checkList${i}`">
        <img :src="start" alt="" />
        <span class="text">{{$t(item.text, {voucher: lockInfo.voucher, coin: lockInfo.name})}}</span>
      </div>
      <!-- 提取凭证勾选 -->
      <div class="check-rule" v-show="kindId !== 0" @click="() => checkStatus = !checkStatus">
        <img :src="checkStatus ? (chainName === 'Heco' ? hecoCheck : bscCheck) : unCheck" alt=''>
        <span class="text">{{$t('DaoRule')}}</span>
      </div>
      <!-- 按钮 -->
      <button class="pledge-btn text" :class="{'confirm-btn': checkStatus}" :disabled="!checkStatus" @click="_confirmExtracHandle">{{$t('DaoConfirm')}}</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExtractVoucherPop",
  props: ["lockInfo", "erc20Utils"],
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
  computed: {
    checkList() {
      return [
        {text: 'DaoCheckText1'},
        {text: 'DaoCheckText2'},
        {text: 'DaoCheckText3'}
      ]
    },
    // 待提取凭证数量
    toExtractVoucherAmount() {
      return this.$store.state.lockup.toExtractVoucherAmount
    },
  },
  mounted() {},
  methods: {
    // 关闭弹框
    _closeHandle() {
      this.status = !this.status
      this.checkStatus = false
    },
    // 提取操作
    async _confirmExtracHandle() {
      const withdrawlmsg = `${this.$t('Claim')} ${this.toExtractVoucherAmount} ${this.lockInfo.voucher}`;
      const overalltip = this.$overalltip({ type: "loading", msg: withdrawlmsg, buttonText: this.$t("Close")})
      let { _setExtractVmdxOperate } = await this.erc20Utils
      _setExtractVmdxOperate().then((res) => {
        this._closeHandle()
        this.$emit("updateData")
        overalltip.close()
        this.actionTip = this.$overalltip({type: "success",msg: `${withdrawlmsg} ${this.$t('Success')}`,buttonText: this.$t("Close")})
      }).catch((err) => {
        overalltip.close()
        this.actionTip = this.$overalltip({type: "error", msg: `${withdrawlmsg} ${this.$t('Error')}`, buttonText: this.$t("Close")})
      })
    }
  },
  destroyed() {
    clearTimeout(this.timeout)
    if (this.actionTip) this.actionTip.close()
  }
}
</script>

<style lang="less" scoped>
@import "./ExtractVoucherPop.less";
</style>
