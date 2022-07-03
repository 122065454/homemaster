<template>
  <div class='popWrap' :class="[chainName, getLanguage]" v-if="status">
    <div class='pop'>
      <!-- 提取标题 -->
      <div class="title-bar">
        <span class="text Bold">{{$t("AdvanceUnlock")}} {{lockInfo.name}}</span>
        <img :src="close" alt="" @click="_closeHandle">
      </div>
      <!-- 选择提取策略 -->
      <p class="select-label text Bold">{{$t("SelectUnlocl")}}</p>
      <div class="select-tab text">
        <span v-for="(item, i) in regularData" :class="{active: item.kindId == kindId}" @click="() => _switchTab(item)" :key="`'upRegularData_'${i}`" v-show="item.locknum">
          {{_currentCycleName(item.kindId)}}
        </span>
      </div>
      <!-- 解锁信息 -->
      <div class="earning-info">
        <div class="ei-name">
          <p class="text">{{$t("LockNum")}}</p>
          <p class="numbers">{{_numComma(currentData['locknum'], 2)}}</p>
        </div>
        <div class="ei-name">
          <p class="text">{{$t('TheWeight')}}</p>
          <p class="numbers">x{{weightSign}}</p>
        </div>
        <div class="ei-name">
          <p class="text">{{$t("UnlockNeedVoucher")}}</p>
          <p class="numbers">{{_numComma(vMdexAmount, 2)}}</p>
        </div>
      </div>
      <!-- 凭证数量 -->
      <div class="balance-info">
        <span class="text Bold">{{$t('ExtractNum')}}</span>
        <span class="numbers Bold">{{_numComma(showDaoVoucherAmount, 2)}} {{lockInfo.voucher}}</span>
      </div>
      <!-- 解锁数量 -->
      <div class="unlock-info">
        <div class="input-bar">
          <!-- <input class="numbers" :disabled="true" v-model="canUnLockAmount" /> -->
          <!-- <div class="numbers">{{_numComma(canUnLockAmount,2)}}</div> -->
          <input class="numbers" v-model="inputVal" @input="_setExtractNumHandle" />
          <button class="max text" @click="_setMaxNumberHandle">{{$t('Maximum')}}</button>
          <span class="unit numbers">{{lockInfo.name}}</span>
        </div>
        <div class="unlock-bar">
          <span class="text">{{$t("CanUnLockAmount")}}</span>
          <el-tooltip effect="dark" placement="top" popper-class="middle-topic">
            <img class="topic-pic" :src="topic" alt=''/>
            <div slot="content">{{$t("UnLockCountExplain")}}</div>
          </el-tooltip>
        </div>
      </div>
      <!-- 输入错误提示 -->
      <div class="err-topic text Bold" v-show="inputVal != 0 && !errStatus && inputErrStatus">{{$t('DaoExtractErr', {voucher: errorCoin})}}</div>
      <!-- 输入错误提示 -->
      <div class="err-topic text Bold" v-show="errStatus">{{$t("UnLockErrTopic", {type: _currentCycleName(kindId)})}}</div>
      <!-- 解锁说明 -->
      <div class="explain text">
        <img :src="start" alt="" />
        {{$t("AdvanceUnLockExplain")}}
      </div>
      <!-- 按钮 -->
      <button class="extract-btn text" :class="{'confirm-btn': btnStatus}" :disabled="!btnStatus" @click="_confirmUnLockHandle">{{$t("ConfirmUnLock")}}</button>
    </div>
  </div>
</template>
<script>
import { _check_proving } from "@/utils/checkMethod"
import { _numComma } from "@/utils/comMethod"
import BigNumber from 'bignumber.js'
export default {
  name: "ExtractPop",
  props: ["kindIdList", "lockInfo", "erc20Utils"],
  data() {
    return {
      // 气泡提示
      topic: require('@/assets/tist.png'),
      // 关闭图标
      close: require('@/assets/exit.png'),
      // 提示
      start: require('@/assets/star-icon.png'),
       // 控制弹框显隐
      status: false,
      // 解锁数量
      inputVal: "",
      // 批量处理input输入
      timeout: null,
      // 提取操作状态提示
      actionTip: null,
      // 默认值
      defaultVal: 0.00000000000000001,
      // 当前数据
      initData: {},
      // 输入错误状态
      inputErrStatus: false
    }
  },
  computed: {
    // 定期数据
    regularData() {
      return this.$store.state.lockup.regularData
    },
    // 当前权重数据
    currentData() {
      if(Object.keys(this.initData).length) {
        return this.initData
      } else {
        const ind = this.regularData.findIndex((item)=>item.locknum)
        return this.regularData[ind]
      }
    },
    // 权重标识
    kindId() {
      return this.currentData['kindId']
    },
    // 单一权重
    weightSign () {
      return this.lockInfo.weights[this.kindId]
    },
    // dao凭证
    daoVoucherAmount() {
      return this.$store.state.lockup.daoVoucherAmount
    },
    // 展示dao凭证
    showDaoVoucherAmount() {
      return (new BigNumber(this.daoVoucherAmount).minus(this.defaultVal)) < 0 ? 0 : this.daoVoucherAmount
    },
    // 可解锁数量
    canUnLockAmount() {
      // 锁仓数量
      const lockedAmount = this.currentData['locknum'].replace(',', '')
      if(+lockedAmount > 0.01) {
        // 需要的凭证数
        const needVoucher = new BigNumber(lockedAmount).times(this.weightSign).times(1.5).toString(10)
        if (new BigNumber(this.daoVoucherAmount).minus(needVoucher) >= 0 )  {
          return lockedAmount
        } else {
          return new BigNumber(this.daoVoucherAmount).div(this.weightSign).div(1.5).toString(10)
        }
      } else {
        return 0
      }
    },
    // 解锁需要的凭证数量
    vMdexAmount() {
      return new BigNumber(this.inputVal).times(this.weightSign).times(1.5).toString(10)
    },
    // 按钮状态
    btnStatus() {
      const { existUnLock, locknum } = this.currentData
      return !existUnLock && locknum && +this.canUnLockAmount > 0 && !this.inputErrStatus && +this.inputVal > 0
    },
    // 是否存在到期未手动解锁
    errStatus() {
      return this.currentData['existUnLock']
    },
    // 错误提示币种
    errorCoin() {
      if(this.canUnLockAmount == 0) {
        if(new BigNumber(this.vMdexAmount).minus(this.daoVoucherAmount) > 0) return this.lockInfo.voucher
        return this.lockInfo.name
      } else {
        if(new BigNumber(this.inputVal).minus(this.canUnLockAmount) > 0) {
          if(new BigNumber(this.vMdexAmount).minus(this.daoVoucherAmount) > 0) {
            return this.lockInfo.voucher
          } else {
            return this.lockInfo.name
          }
        } else {
          return this.lockInfo.voucher
        }
      }
    }
  },
  mounted() {},
  methods: {
    // 当前周期名称
    _currentCycleName(id) {
      return `${this.kindIdList[id]['tabName']} ${this.$t("Day")}` 
    },
    // 关闭弹框
    _closeHandle() {
      this.initData = {}
      this.status = !this.status
      this.inputErrStatus = false
      this.inputVal = ''
      this.$store.commit("setH5FootSatus", true)
    },
    // 切换解锁策略
    _switchTab(item) {
      this.initData = item
      this.errStatus = false
      this.inputErrStatus = false
      this.inputVal = ''
    },
    // 解锁操作
    async _confirmUnLockHandle() {
      const { earnedToken } = this.lockInfo
      let { _setUnlockEarlyOperate } = await this.erc20Utils
      const overalltip = this.$overalltip({type: "loading", msg: `${this.$t('Unlock')} ${earnedToken}`, buttonText: this.$t("Close")})
      _setUnlockEarlyOperate(this.kindId, this.inputVal).then((res) => {
        this._closeHandle()
        this.$emit("updateData")
        overalltip.close()
        this.actionTip = this.$overalltip({type: "success", msg: `${this.$t('Unlock')} ${earnedToken} ${this.$t('Success')}`,buttonText: this.$t("Close")})
      }).catch((err) => {
        overalltip.close()
        this.actionTip = this.$overalltip({ type: "error", msg: `${this.$t('Unlock')} ${earnedToken} ${this.$t('Error')}`, buttonText: this.$t("Close")})
      })
    },
    // 设置提取数量
    _setExtractNumHandle(e) {
      this.timeout = setTimeout(() => {
        this.inputVal = _check_proving(e?.target?.value, 2)
        this._checkNumHandle(this.inputVal)
      },300)
    },
    // 设置最大提取数量
    _setMaxNumberHandle() {
      this.inputVal = _check_proving(this.canUnLockAmount.toString(), 2)
      this._checkNumHandle(this.inputVal)
    },
    // 提醒数量验证
    _checkNumHandle(val) {
      if (new BigNumber(val).minus(this.canUnLockAmount) > 0) {
        this.inputErrStatus = true
      } else {
        this.inputErrStatus = false
      }
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
@import "./UnlockPop.less";
</style>
