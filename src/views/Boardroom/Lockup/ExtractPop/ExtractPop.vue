<template>
  <div class='popWrap' :class="[chainName, getLanguage]" v-show="status">
    <div class='pop'>
      <!-- 提取标题 -->
      <div class="title-bar">
        <span class="text Bold">{{$t('Claim')}} {{lockInfo.name}}</span>
        <img :src="close" alt="" @click="_closeHandle">
      </div>
      <!-- 选择提取策略 -->
      <p class="select-label text Bold">{{$t('SelectExtractStrategy')}}</p>
      <div class="select-tab text">
        <!-- <span 
          v-for="(item, i) in kindIdList" 
          :class="{active: kindId == +i}" 
          @click="() => _switchTab(i)" 
          :key="`'kindIdList_'${i}`"
          v-show="i == 0 || +unlockedAmountList[i]>defaultVal">
          {{item.tabName}} {{i != 0 ? $t("Day") : ''}}
        </span> -->
        <span class="active">
          {{kindIdList[kindId]['tabName']}} {{kindId != 0 ? $t("Day") : ''}}
        </span>
      </div>
      <!-- 提取信息 -->
      <div class="earning-info">
        <div class="ei-name">
          <p class="text">{{kindId == 0 ? $t('PledgeNum') : $t('UnlockedNumber')}}</p>
          <p class="numbers">{{unlockedAmount}}</p>
        </div>
        <div class="ei-name">
          <p class="text">{{$t('TheWeight')}}</p>
          <p class="numbers">x{{weightSign}}</p>
        </div>
        <div class="ei-name" v-show="kindId != 0">
          <p class="text">{{$t('UnlockVoucherNumber')}}</p>
          <p class="numbers">{{kindId == 0 ? 0 : inputVal ? `≈ ${!!Number(inputVal) ? _numComma(vMdexAmount, 8) : 0}` : 0}} {{ lockInfo.voucher }}</p>
        </div>
      </div>
      <!-- 凭证数量 -->
      <div class="balance-info">
        <span class="text Bold">{{$t('ExtractNum')}}</span>
        <span class="numbers Bold">{{showDaoVoucherAmount}} {{lockInfo.voucher}}</span>
      </div>
      <!-- 提取数量 -->
      <div class="input-bar">
        <input class="numbers" v-model="inputVal" @input="_setExtractNumHandle" />
        <span class="unit numbers">{{lockInfo.name}}</span>
        <!-- <button class="max text" @click="_setMaxNumberHandle" :disabled="canExtractAmount <= defaultVal">{{$t('Maximum')}}</button> -->
        <button class="max text" @click="_setMaxNumberHandle">{{$t('Maximum')}}</button>
      </div>
      <!-- 输入错误提示 -->
      <div class="err-topic text Bold" v-show="errStatus">{{$t('DaoExtractErr', {voucher: errorCoin})}}</div>
      <!-- 提取说明 -->
      <div class="explain text">
        <img :src="start" alt="" />
        {{$t('DaoExplain', {voucher: lockInfo.voucher, coin: lockInfo.name})}}
      </div>
      <!-- 按钮 -->
      <button class="extract-btn text" :class="{'confirm-btn': btnStatus}" :disabled="!btnStatus" @click="_confirmExtractHandle">{{$t('Confirm')}}</button>
    </div>
  </div>
</template>
<script>
import { _check_proving } from "@/utils/checkMethod"
import { _numComma } from "@/utils/comMethod"
import BigNumber from 'bignumber.js'
export default {
  name: "ExtractPop",
  props: ["kindIdList", "lockInfo", "erc20Utils", "eData"],
  data() {
    return {
      // 关闭图标
      close: require('@/assets/exit.png'),
      // 提示
      start: require('@/assets/star-icon.png'),
       // 控制弹框显隐
      status: false,
      // 质押数量
      inputVal: "",
      // 批量处理input输入
      timeout: null,
      // 错误状态(false不展示/true展示)
      errStatus: false,
      // 提取操作状态提示
      actionTip: null,
      // 默认值
      defaultVal: 0.00000000000000001
    }
  },
  computed: {
    kindId() {
      return Object.keys(this.eData).length ? this.eData.kindId : 0
    },
    // 已解锁列表
    unlockedAmountList() {
      return this.$store.state.lockup.unlockedAmountList
    },
    // 单权重已解锁数量
    unlockedAmount() {
      return this.unlockedAmountList?.[this.kindId]
    },
    // dao凭证
    daoVoucherAmount() {
      return this.$store.state.lockup.daoVoucherAmount
    },
    // 展示dao凭证
    showDaoVoucherAmount() {
      return (new BigNumber(this.daoVoucherAmount).minus(this.defaultVal)) < 0 ? 0 : this.daoVoucherAmount
    },
    // 可提取数量
    canExtractAmount() {
      if (this.kindId == 0) {
        return this.unlockedAmount
      } else {
        // 需要的凭证数
        const needVoucher = new BigNumber(this.unlockedAmount).times(this.weightSign).toString(10)
        if (new BigNumber(this.daoVoucherAmount).minus(needVoucher) >= 0 )  {
          return this.unlockedAmount
        } else {
          return new BigNumber(this.daoVoucherAmount).div(this.weightSign).toString(10)
        }
      }
    },
    // 解锁需要的凭证数量
    vMdexAmount() {
      return new BigNumber(this.inputVal).times(this.lockInfo.weights[this.kindId]).toString(10)
    },
    // 单一权重
    weightSign () {
      return this.lockInfo.weights[this.kindId]
    },
    // 按钮状态
    btnStatus() {
      return +this.inputVal > 0 && !this.errStatus
    },
    // 错误提示币种
    errorCoin() {
      if(this.unlockedAmount == 0) {
        return this.lockInfo.name
      } else {
        if(this.kindId == 0) {
          return this.lockInfo.name
        } else {
          if(new BigNumber(this.inputVal).minus(this.unlockedAmount) > 0) return this.lockInfo.name
          return this.lockInfo.voucher
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 关闭弹框
    _closeHandle() {
      this.status = !this.status
      this.errStatus = false
      this.inputVal = ''
      this.kindId = 0
      this.$store.commit("setH5FootSatus", true)
    },
    // 切换锁仓策略
    _switchTab(id) {
      this.kindId = +id
      this._clearHandle('tab')
    },
    // 重置弹框内状态
    _clearHandle(switchKind='all') {
      if (switchKind == 'all') this.kindId = 0
      this.errStatus = false
      this.inputVal = ''
    },
    // 设置提取数量
    _setExtractNumHandle(e) {
      this.timeout = setTimeout(() => {
        this.inputVal = _check_proving(e?.target?.value)
        this._checkNumHandle(this.inputVal)
      },300)
    },
    // 设置最大提取数量
    _setMaxNumberHandle() {
      // this.inputVal = _check_proving(this.canExtractAmount.toString())
      // this.errStatus = false
      this.inputVal = _check_proving(this.unlockedAmount.toString())
      this._checkNumHandle(this.inputVal)
    },
    // 提醒数量验证
    _checkNumHandle(val) {
      if (new BigNumber(val).minus(this.canExtractAmount) > 0) {
        this.errStatus = true
      } else {
        this.errStatus = false
      }
    },
    // 提取操作
    async _confirmExtractHandle() {
      const withdrawlmsg = `${this.$t('Claim')} ${this.inputVal} ${this.lockInfo.name}`;
      const overalltip = this.$overalltip({ type: "loading", msg: withdrawlmsg, buttonText: this.$t("Close")})
      let { _setExtractOperate } = await this.erc20Utils
      _setExtractOperate(this.kindId, this.inputVal).then((res) => {
        this._closeHandle()
        this.$emit("updateData")
        overalltip.close()
        this.actionTip = this.$overalltip({type: "success",msg: `${withdrawlmsg} ${this.$t('Success')}`,buttonText: this.$t("Close")})
      }).catch((err) => {
        overalltip.close()
        this.actionTip = this.$overalltip({type: "error", msg: `${withdrawlmsg} ${this.$t('Error')}`, buttonText: this.$t("Close")})
      })
    },
    _numComma
  },
  destroyed() {
    clearTimeout(this.timeout)
    if (this.actionTip) this.actionTip.close()
  }
}
</script>

<style lang="less" scoped>
@import "./ExtractPop.less";
</style>
