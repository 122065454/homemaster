<template>
  <div class='popWrap' :class="[chainName, getLanguage]" v-show="status">
    <div class='pop'>
      <!-- 质押标题 -->
      <div class="title-bar">
        <span class="text Bold">{{$t('transaction')}} {{lockInfo.name}}</span>
        <img :src="close" alt="" @click="_closeHandle">
      </div>
      <!-- 选择锁仓策略 -->
      <p class="select-label text Bold">{{$t('SelectLockupStrategy')}}</p>
      <div class="select-tab text">
        <span v-for="(item, i) in kindIdList" :class="{active: kindId === +i}" @click="() => _switchTab(i)" :key="`'kindIdList_'${i}`">{{item.tabName}} {{i != 0 ? $t("Day") : ''}}</span>
        <!-- <span>{{$t('MoreStrategy')}}</span> -->
      </div>
      <!-- 收益展示 -->
      <div class="earning-info">
        <div class="ei-name text">
          <p>{{kindIdList[kindId]['textName']}} {{$t('GainsWeight')}}</p>
          <p v-if="isPC">{{$t('WeightNum')}}</p>
          <p v-if="isPC">{{kindIdList[kindId]['textName']}} APR：</p>
          <p>{{kindIdList[kindId]['textName']}} APY：</p>
          <p>{{$t('Obtain', {voucher: lockInfo.voucher})}}：</p>
        </div>
       <div class="ei-num numbers">
          <p>x{{lockInfo.weights[kindId]}}</p>
          <p v-if="isPC">{{inputVal ? `≈ ${!!Number(inputVal) ? _numComma(vMdexAmount, 4) : 0}` : 0}} {{ lockInfo.name }}</p>
          <p v-if="isPC">{{(+lockInfo['pool_apy']*lockInfo.weights[kindId]).toFixed(2)}}%</p>
          <p>{{ _getLockApy(lockInfo.weights[kindId]) }}%</p>
          <p>{{kindId === 0 ? 0.00 : _numComma(vMdexAmount, 4)}}</p>
        </div>
      </div>
      <!-- 可质押数量 -->
      <div class="balance-info">
        <span class="text Bold">{{$t('PledgeNum')}}</span>
        <span class="numbers Bold">{{coinBalance}} {{lockInfo.name}} {{$t('Available')}}</span>
      </div>
      <!-- 质押数量 -->
      <div class="input-bar">
        <input class="numbers" v-model="inputVal" @input="_setPledgeNumHandle" />
        <span class="unit numbers">{{lockInfo.name}}</span>
        <button class="max text" @click="_setMaxNumberHandle" :disabled="+coinBalance <= 0">{{$t('Maximum')}}</button>
      </div>
       <!-- 输入错误提示 -->
      <div class="err-topic text Bold" v-show="errStatus">{{$t('PledgeCurrentErrTopic')}}</div>
      <!-- 定期提示 -->
      <div class="lock-topic" v-show="kindId !== 0">
        <img :src="start" alt="" />
        <span class="text" v-html="$t('RegularFreeTopic')"></span>
      </div>
      <div class="lock-topic text" v-show="kindId !== 0">
        <img :src="start" alt="" />
        <span class="text" v-html="$t('LockTopic')"></span>
      </div>
      <div class="lock-topic text" v-show="kindId !== 0">
        <img :src="start" alt="" />
        <span class="text" v-html="$t('PledgeRegularErrTopic', {day: kindIdList[kindId]['tabName'], hours: weightList[kindId]['interval']})"></span>
      </div>
      <!-- 定期违约金扣除同意勾选 -->
      <div class="check-rule" v-show="kindId !== 0" @click="() => checkStatus = !checkStatus">
        <img :src="checkStatus ? (chainName === 'Heco' ? hecoCheck : bscCheck) : unCheck" alt=''>
        <span class="text">{{$t('AgreeLockup')}}</span>
      </div>
      <!-- 按钮 -->
      <button class="pledge-btn text" :class="{'confirm-btn': btnStatus}" :disabled="!btnStatus" @click="_confirmPledgeHandle">{{$t('Confirm')}}</button>
    </div>
  </div>
</template>
<script>
import { _check_proving } from "@/utils/checkMethod"
import { weightList } from "@/utils/comStatic"
import { _numComma } from "@/utils/comMethod"
import BigNumber from 'bignumber.js'
export default {
  name: "PledgePop",
  props: ["kindIdList", "lockInfo", "erc20Utils"],
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
       // 控制弹框显隐
      status: false,
      // 质押数量
      inputVal: "",
      // 勾选状态(false未勾选/ture已勾选)
      checkStatus: false,
      // 当前锁仓类型 0:活期 1:定期(30)
      kindId: 0,
      // 批量处理input输入
      timeout: null,
      // 错误状态(false不展示/true展示)
      errStatus: false,
      // 质押操作状态提示
      actionTip: null,
      // 权重配置表
      weightList: weightList
    }
  },
  computed: {
    // 按钮状态
    btnStatus() {
      const currentBtnStatus = +this.inputVal > 0 && !this.errStatus
      if (this.kindId === 0) {
        return currentBtnStatus
      } else {
        return currentBtnStatus && this.checkStatus
      }
    },
    // 某一币种资产
    coinBalance() {
      return this.$store.state.lockup.singleBalance
    },
    // 凭证数量
    vMdexAmount() {
      return new BigNumber(this.inputVal).times(this.lockInfo.weights[this.kindId]).toString(10)
    }
  },
  mounted() {},
  methods: {
    // 关闭弹框
    _closeHandle() {
      this.status = !this.status
      this.kindId = 0
      this.errStatus = false
      this.inputVal = ''
      this.$store.commit("setH5FootSatus", true)
    },
    // 切换锁仓策略
    _switchTab(id) {
      this.kindId = +id
      this._clearHandle('tab')
    },
    // 年复利(锁仓)
    _getLockApy(multiple) {
      let ml = multiple ? +multiple : 1
      return (Number(Math.pow(1 + this.lockInfo['pool_apy']*ml/365/100, 365)*100 - 100)).toFixed(2)
    },
    // 设置质押数量
    _setPledgeNumHandle(e) {
      this.timeout = setTimeout(() => {
        this.inputVal = _check_proving(e?.target?.value)
        if (+this.inputVal > +this.coinBalance) {
          this.errStatus = true
        } else {
          this.errStatus = false
        }
      },300)
    },
    // 重置弹框内状态
    _clearHandle(switchKind='all') {
      if (switchKind == 'all') this.kindId = 0
      this.checkStatus = false
      this.errStatus = false
      this.inputVal = ''
    },
    // 设置最大提币数量
    _setMaxNumberHandle () {
      this.inputVal = this.coinBalance
      this.errStatus = false
    },
    // 质押操作
    async _confirmPledgeHandle() {
      const {_setPledgeOperate, _getSinglePledgeStatusOperate } = await this.erc20Utils
      const despoitmsg = `${this.$t('transaction')} ${this.inputVal} ${this.lockInfo.name}`
      const overalltip = this.$overalltip({ type: "loading", msg: despoitmsg, buttonText: this.$t("Close")})
      const pledgeHandle = () => {
        _setPledgeOperate(this.kindId, this.inputVal).then((res) => {
          this._closeHandle()
          this.$emit("updateData")
          overalltip.close()
          this.actionTip = this.$overalltip({ type: "success", msg: `${despoitmsg} ${this.$t('Success')}`, buttonText: this.$t("Close") })
          this._clearHandle()
        }).catch((err) => {
          overalltip.close()
          this.actionTip = this.$overalltip({ type: "error", msg: `${despoitmsg} ${this.$t('Error')}`, buttonText: this.$t("Close")})
        })
      }
      // 定期（同一权重质押需要间隔时间）
      if (this.kindId == 0) {
        pledgeHandle()
      } else {
        _getSinglePledgeStatusOperate(this.kindId).then(status => {
          if (status) {
            pledgeHandle()
          } else {
            const hours = weightList[this.kindId]['interval']
            const day = this.kindIdList[this.kindId]['tabName']
            this._closeHandle()
            overalltip.close()
            this.actionTip = this.$overalltip({ type: "error", msg: `${this.$t('PledgeRegularErrTopic', {day, hours})}`, buttonText: this.$t("Close")})
            this._clearHandle()
          }
        })
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
@import "./PledgePop.less";
</style>
