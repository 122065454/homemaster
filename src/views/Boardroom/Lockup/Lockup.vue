<template>
  <div class="wrap" :class="[chainName, getLanguage]">
    <TitleBanner />
    <div class="main">
      <!-- 总收益/质押总资产-begin -->
      <section class="top-area">
        <div class="top-item" v-for="(item, i) in topAreaData" :key="`topAreaData_${i}`">
          <div class="argment">
            <img class="coin-icon" :src='_getImgUrl(lockInfo.earnedToken)' alt=''/>
            <div>
              <p class="top-title text">{{ item.titleText }}</p>
              <p class="top-num numbers Bold">
                <CountUp :options="{decimalPlaces: precision}" :endVal="Number(item.titleVal)" />
              </p>
              <p class="count-price numbers Bold">
                ≈<CountUp :options="{decimalPlaces: precision}" :endVal="Number(item.titleVal*currentPrice)" />
              </p>
            </div>
          </div>
          <div class="top-button-bar">
            <button class="top-button text" :disabled="i === 1 ? false : (totalEarn!=0 ? false : true)" @click="() => {i === 1 ? _pledgeHandle() : _extractEarnHandle() }">{{$t(item.btnTextKey)}}</button>
            <button v-if="i === 1" class="top-button text" :disabled="+totalLockAmount <= 0" @click="_advanceUnlockHandle">{{$t('Unlock')}}</button>
          </div>
        </div>
      </section>
      <!-- 总收益/质押总资产-end -->
      <!-- DAO凭证-begin -->
      <section class="dao-bar">
        <div class="addToken text" @click="_addTokenHandle">
          <img src="@/assets/svg/metamask-fox.svg" /> 
          {{ $t('addToken.text', { token: lockInfo.voucher }) }}
        </div>
        <div class="dao-area">
          <div class="dao-item">
            <img class="dao-icon" :src="dao" alt=''/>
            <div class="dao-num-bar">
              <p class="dao-title text">
                {{ $t('DaoVoucher') }}
                <template v-if="isMobile">
                  <span>({{lockInfo.voucher}})</span>
                  <DaoTopic :lockInfo="lockInfo" />
                </template>
              </p>
              <div class="dao-num numbers Bold">
                <CountUp :options="{decimalPlaces: precision}" :endVal="Number(toExtractVoucherAmount)" />
                <template v-if="isPC">
                  <span class="unit">{{lockInfo.voucher}}</span>
                  <DaoTopic :lockInfo="lockInfo" />
                </template>
              </div>
            </div>
          </div>
          <div class="dao-button-bar">
            <button class="dao-button text" :disabled="Number(toExtractVoucherAmount) > 0 ? false : true" @click="_extractVoucherHandle">{{$t('Claim')}}</button>
          </div>
        </div>
      </section>
      <!-- DAO凭证-end -->
      <!-- 质押列表-begin -->
      <section class="middle-area">
        <template v-if="noDataStatus">
          <!-- 活期锁仓Title -->
          <h2 class="middle-title argment" v-if="isMobile"><i></i>{{$t("CurrentLockup")}}</h2>
          <el-table
            class="middle-list"
            :show-header='false'
            :data="currentData"
            style="width: 100%">
            <el-table-column :width="isPC ? 30 : (getLanguage === 'zh-CN' ? 30 : 23)">
              <img class="current-pic" :src="sun" alt="">
            </el-table-column>
            <!-- PC活期属性-begin -->
            <template v-if="isPC"> 
              <!-- 活期质押 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 80 : 110">
                <p class="ml-key text" slot-scope="scope">{{ kindIdList[scope.row.kindId]['listName'] }}{{$t('transaction')}} :</p>
              </el-table-column>
              <!-- 质押数量 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 193 : 148" align="right">
                <p class="ml-val numbers Bold" slot-scope="scope">{{ unlockedAmountList [scope.row.kindId]}} {{ lockInfo.name }}</p>
              </el-table-column>
              <!-- 活期提取 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 95 : 130" align="right">
                <p class="ml-key text">{{$t("CanExtract")}} :</p>
              </el-table-column>
              <!-- 提取数量 -->
              <el-table-column align="right" :width="getLanguage === 'zh-CN' ? 160 : 140">
                <p class="ml-val numbers Bold" slot-scope="scope">
                  {{ unlockedAmountList[scope.row.kindId] }} {{ lockInfo.name }}
                  <LockupTopic :kindId="scope.row.kindId" type="2" :kindIdList="kindIdList" :lockInfo="lockInfo"/>
                </p>  
              </el-table-column>
            </template>
            <!-- PC活期属性-end -->
            <!-- H5活期属性-begin -->
            <template v-else> 
              <!-- 活期质押 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 105 : 100">
                <div slot-scope="scope">
                  <p class="ml-key argment text" >
                    {{ kindIdList[scope.row.kindId]['textName'] }} {{ lockInfo.name }}
                    <LockupTopic :kindId="scope.row.kindId" type="2" :kindIdList="kindIdList" :lockInfo="lockInfo"/>
                  </p>
                  <p class="ml-val numbers Bold">{{ unlockedAmountList[scope.row.kindId] }}</p>
                </div>
              </el-table-column>
              <!-- 活期提取 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 95 : 123">
                <div slot-scope="scope">
                  <p class="ml-key text" >{{$t("CanExtract")}} {{ lockInfo.name }}</p>
                  <p class="ml-val numbers Bold">{{ unlockedAmountList[scope.row.kindId] }}</p>
                </div>
              </el-table-column>
            </template>
            <!-- H5活期属性-end -->
            <!-- 活期提取按钮-begin -->
            <el-table-column align="right" :width="getLanguage === 'zh-CN' ? 85 : (isPC ? 85 : 71)">
              <template slot-scope="scope">
                <button :disabled="+unlockedAmountList[scope.row.kindId]<=defaultVal" class="ml-btn text"  @click="_extractHandle(scope.$index, scope.row)">{{$t("Claim")}}</button>
              </template>
            </el-table-column>
            <!-- 活期提取按钮-end -->
          </el-table>
          <!-- 定期锁仓Title -->
          <h2 class="middle-title argment" v-if="isMobile && regularData.length"><i></i>{{$t("RegularLockup")}}</h2>
          <el-table
            class="middle-list"
            :show-header='false'
            :data="regularData"
            style="width: 100%"
            :expand-row-keys="expands"
            :row-key='getRowKeys'
            @expand-change="_expandChange"
            v-if="regularData.length">
            <!-- 定期下拉订单列表-begin -->
            <el-table-column type="expand" :width="getLanguage === 'zh-CN' ? 30 : (isPC ? 30 : 23)" >
              <template slot-scope="props">
                <el-table
                  :stripe='true'
                  :show-header='false'
                  :data="regularPageData[props.row.kindId]"
                  style="width: 100%">
                  <!-- PC订单列表-begin -->
                  <template v-if="isPC">
                    <!-- 锁仓时间 -->
                    <el-table-column width="180" >
                      <div class="expand-column argment" slot-scope="scope">
                        <img class="lock-pic" :src="chainName === 'Heco' ? hecoLock : bscLock" alt="" />
                        <div>
                          <p class="text">{{$t("LockupTime")}}</p>
                          <p class="numbers">{{ _formatDate(scope.row.lockupTime, 2) }}</p>
                        </div>
                      </div>
                    </el-table-column>
                    <!-- 锁仓金额 -->
                    <el-table-column width="159">
                      <div class="expand-column" slot-scope="scope">
                        <p class="text">{{$t("LockupAmount")}}</p>
                        <p class="numbers">{{ scope.row.amount }} {{ lockInfo.name }}</p>
                      </div>
                    </el-table-column>
                    <!-- 解锁时间 -->
                    <el-table-column width="162">
                      <div class="expand-column" slot-scope="scope">
                        <p class="text">{{$t("UnlockTime")}}</p>
                        <p class="numbers">{{ _formatDate(scope.row.unLockTime, 2) }}</p> 
                      </div>
                    </el-table-column>
                    <!-- 权重数量 -->
                    <el-table-column width="142">
                      <div class="expand-column" slot-scope="scope">
                        <p class="text">{{$t("WeightNum")}}</p>
                        <p class="numbers">{{ scope.row.weightAmount }} {{ lockInfo.name }}</p>
                      </div>
                    </el-table-column>
                  </template>
                  <!-- PC订单列表-end -->
                  <!-- H5订单列表-begin -->
                  <template v-else>
                    <!-- 锁仓时间 -->
                    <el-table-column :width="getLanguage === 'zh-CN' ? 135 : 123">
                      <div class="expand-column df" slot-scope="scope">
                        <img class="lock-pic" :src="chainName === 'Heco' ? hecoLock : bscLock" alt="" />
                        <div>
                          <p class="text">{{$t("LockupTime")}}</p>
                          <p class="numbers">{{ _formatDate(scope.row.lockupTime, ['3', '4'].includes(props.row.kindId) ? 10 : 13) }}</p> 
                        </div>
                      </div>
                    </el-table-column>
                    <!-- 解锁时间 -->
                    <el-table-column width="90">
                      <div class="expand-column" slot-scope="scope">
                        <p class="text">{{$t("UnlockTime")}}</p>
                        <p class="numbers">{{ _formatDate(scope.row.unLockTime, ['3', '4'].includes(props.row.kindId) ? 10 : 13) }}</p> 
                      </div>
                    </el-table-column>
                    <!-- 锁仓金额 -->
                    <el-table-column :width="getLanguage === 'zh-CN' ? 87 : 99">
                      <div class="expand-column" slot-scope="scope">
                        <p class="text">{{$t("LockupAmount")}}</p>
                        <p class="numbers">{{ scope.row.amount }}</p>
                      </div>
                    </el-table-column>
                  </template>
                  <!-- H5订单列表-end -->
                </el-table>
                <el-pagination
                  v-if="regularPageData[props.row.kindId].length"
                  small
                  align="center"
                  layout="prev, pager, next"
                  @current-change="_pageHandle($event, props.row.kindId)"
                  :page-size="regularSize"
                  :total="props.row.list.length">
                </el-pagination>
              </template>
            </el-table-column>
            <!-- 定期下拉订单列表-end -->
            <!-- PC定期列表属性-begin -->
            <template v-if="isPC">
              <!-- 定期锁仓 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 90 : 110">
                <p class="ml-key text" slot-scope="scope">{{ kindIdList[scope.row.kindId]['listName'] }} :</p>
              </el-table-column>
              <!-- 质押数量 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 183 : 148" align="right">
                <p class="ml-val numbers Bold" slot-scope="scope">{{ _numComma(scope.row.locknum, 2) }} {{ lockInfo.name }}</p>
              </el-table-column>
              <!-- APY文案 -->
              <el-table-column :width="getLanguage === 'zh-CN' ? 95 : 130" align="right">
                <p class="ml-key text">APY :</p>
              </el-table-column>
              <!-- APY数值 -->
              <el-table-column align="right" :width="getLanguage === 'zh-CN' ? 160 : 140">
                <p class="ml-val numbers Bold" slot-scope="scope">
                  {{ scope.row.apy }}%
                  <LockupTopic :kindId="scope.row.kindId" type="2" :kindIdList="kindIdList" :lockInfo="lockInfo"/>
                </p>  
              </el-table-column>
            </template>
            <!-- PC定期列表属性-end -->
            <!-- H5定期列表属性-begin -->
            <template v-else> 
              <el-table-column>
                <div slot-scope="scope">
                  <p class="ml-key argment text" >
                    {{ kindIdList[scope.row.kindId]['textName'] }}
                  </p>
                </div>
              </el-table-column>
              <el-table-column :width="getLanguage === 'zh-CN' ? 150 : 130">
                <div slot-scope="scope">
                  <p class="ml-key argment jc-end text">
                    {{ $t("LockNum") }}: {{ _numComma(scope.row.locknum, 2) }} {{ lockInfo.name }}
                    <LockupTopic :kindId="scope.row.kindId" type="2" :kindIdList="kindIdList" :lockInfo="lockInfo"/>
                  </p>
                </div>
              </el-table-column>
            </template>
            <!-- H5定期列表属性-end -->
            <!-- 定期解锁/提取按钮-begin -->
            <el-table-column :width="isPC ? 85 : getLanguage === 'zh-CN' ? 53 : 73"  align="right">
              <template slot-scope="scope">
                <button v-if="scope.row.existUnLock" class="ml-btn h5-btn text" @click="() => {_unlockHandle(scope.row.kindId)}">{{$t("Unlock")}}</button>
                <button v-else v-show="+unlockedAmountList[scope.row.kindId]>defaultVal" class="ml-btn h5-btn text" @click="() => {_extractHandle(scope.$index, scope.row)}">{{$t("Claim")}}</button>
              </template>
            </el-table-column>
            <!-- 定期解锁/提取按钮-end -->
          </el-table>
        </template>
        <!-- 暂无数据-begin -->
        <Loading ref="loading" type='small' v-else />
        <div class="empty" v-show="!noDataStatus">
          <img :src="chainName === 'Heco' ? hecoNodata : bscNodata" />
          <p class="text">{{ $t("empptyData") }}</p>
        </div>
        <!-- 暂无数据-end -->
      </section>
      <!-- 质押列表-end -->
    </div>
    <!-- 质押 -->
    <PledgePop ref="PledgePop" :kindIdList="kindIdList" :lockInfo="lockInfo" :erc20Utils="erc20Utils" @updateData="_updateBalanceInfo"/>
    <!-- 提取 -->
    <ExtractPop ref="ExtractPop" :eData="ExtractPopData" :kindIdList="kindIdList" :lockInfo="lockInfo" :erc20Utils="erc20Utils" @updateData="_updateBalanceInfo"/>
    <!-- 提取凭证 -->
    <ExtractVoucherPop ref="ExtractVoucherPop" :lockInfo="lockInfo" :erc20Utils="erc20Utils" @updateData="_updateBalanceInfo"/>
    <!-- 提前解锁 -->
    <UnlockPop ref="UnlockPop" :kindIdList="kindIdList" :lockInfo="lockInfo" :erc20Utils="erc20Utils" @updateData="_updateBalanceInfo"/>
  </div>
</template>
<script>
import { _formatDate,_numComma, _getPrecision } from "@/utils/comMethod"
import ExtractVoucherPop from "./ExtractVoucherPop/ExtractVoucherPop"
import TitleBanner from "@/components/TitleBanner/TitleBanner"
import { isConnectMetaMask } from "@/utils/publicErc20"
import LockupTopic from "./LockupTopic/LockupTopic"
import Loading from "@/components/Loading/Loading"
import { lockUpUtils } from "@/utils/publicErc20"
import ExtractPop from "./ExtractPop/ExtractPop"
import coinConfig from "@/utils/address.config"
import { weightList } from "@/utils/comStatic"
import PledgePop from "./PledgePop/PledgePop"
import UnlockPop from "./UnlockPop/UnlockPop"
import DaoTopic from "./DaoTopic/DaoTopic"

export default {
  name: "Lockup",
  components: {
    ExtractVoucherPop,
    TitleBanner,
    LockupTopic,
    ExtractPop,
    UnlockPop,
    PledgePop,
    DaoTopic,
    Loading
  },
  data() {
    return {
      //暂无数据(Bsc)
      bscNodata: require('@/assets/Bsc-empty.png'),
      //暂无数据(Heco)
      hecoNodata: require('@/assets/empty.png'),
      // heco锁仓图标
      hecoLock: require('@/assets/heco_lock.png'),
      // bsc锁仓图标
      bscLock: require('@/assets/bsc_lock.png'),
      // 活期图标
      sun: require('@/assets/sun.png'),
      // 气泡框图标
      topic: require('@/assets/tist.png'),
      // dao凭证
      dao: require('@/assets/dao.png'),
      // 默认值（溢出单位）
      defaultVal: 0.00000000000000001,
      // 展示的下拉标
      expands: [],
      // 行数据的key
      getRowKeys(row) {
        return row.kindId
      },
      // 提取弹框数据对象
      ExtractPopData: {},
      // 操作状态提示
      actionTip: null,
    }
  },
  watch: {
    account() {
      this._updateBalanceInfo()
    }
  },
  computed: {
    // 授权状态
    allowance() {
      return this.$store.state.lockup.allowance
    },
    // 币种精度
    precision() {
      return _getPrecision(this.lockInfo.earnedToken)
    },
    // 活期数据
    currentData() {
      return this.$store.state.lockup.currentData
    },
    // 定期数据
    regularData() {
      return this.$store.state.lockup.regularData
    },
    // 定期分页一页展示条数
    regularSize() {
      return this.$store.state.lockup.regularSize
    },
    // 定期分页数据
    regularPageData() {
      return this.$store.state.lockup.regularPageData
    },
    // mdx当前价格
    currentPrice() {
      return this.$store.state.homeData.mdex_info?.price
    },
    // 钱包中凭证数量
    daoVoucherAmount() {
      return this.$store.state.lockup.daoVoucherAmount
    },
    // 待领取凭证数量
    toExtractVoucherAmount() {
      return this.$store.state.lockup.toExtractVoucherAmount
    },
    // 总收益
    totalEarn() {
      const earnList = this.$store.state.boardRoom.poolReward
      if (Object.keys(earnList).length) {
        return earnList?.['lock']?.[this.lockInfo.pid]
      } else {
        return this.$store.state.lockup.totalEarn
      }
    },
    // 已解锁列表
    unlockedAmountList() {
      return this.$store.state.lockup.unlockedAmountList
    },
    // 币种合约地址
    coinConfig() {
      return coinConfig[this.chainId]
    },
    // 锁仓类型列表
    kindIdList() {
      let arr = []
      for(let i of Object.keys(this.lockInfo.weights)) {
        if(i == 0) {
          arr.push({listName: this.$t('Current'), tabName: this.$t('Current'), textName: this.$t('Current')})
        } else {
          arr.push({listName: this.$t('XDayLockup', {day: weightList[i]['time']}), tabName: weightList[i]['time'], textName: this.$t('LockupXDay', {day: weightList[i]['time']})})
        }
      }
      return arr
    },
    // 总收益/质押总资产
    topAreaData() {
      const { totalPledgeAmount } = this.$store.state.lockup
      return [
        {titleText: `${this.lockInfo.earnedToken} ${this.$t("Earneds")}`, titleVal: this.totalEarn, btnTextKey: 'Claim'},
        {titleText: `${this.lockInfo.name} ${this.$t("PledgeTotalBalance")}`, titleVal: totalPledgeAmount, btnTextKey: this.account ? (this.allowance ? 'transaction' : 'Approve') : 'UnlockWallet'}
      ]
    },
    // 暂无数据状态 true:有数据, false:无数据
    noDataStatus() {
      return this.currentData.length || this.regularData.length
    },
    // 锁仓基本信息
    lockInfo() {
      let targetData = this.$store.getters["boardRoom/currentChainBoardRoomData"]['lock']
      const data = targetData.find((item) => item.pid == 0) || {}
      data['voucher'] = 'xMDX'
      return data
    },
    // 合约实例
    erc20Utils() {
      let { earnedToken, lpAddress } = this.lockInfo
      return lockUpUtils(this.chainId, earnedToken, lpAddress, this.account);
    },
    // 定期锁仓数量(包含到期未手动解锁)
    totalLockAmount() {
      return this.$store.state.lockup.totalLockAmount
    }
  },
  mounted() {
    this._updateBalanceInfo()
  },
  methods: {
    // 更新用户单一币种资产
    _updateBalanceInfo() {
      this.$store.dispatch("lockup/getLockupInitData", this.lockInfo)
    },
    // 每次只展开一个扩展列表
    _expandChange(row, expandedRows) {
      if(expandedRows.length) {
        this.expands = []
        if(row) this.expands.push(row.kindId)
      } else {
        this.expands = []
      }
    },
    // 控制提取弹框显示
    _extractHandle(index, row) {
      this.$refs.ExtractPop.status = true
      this.$store.commit("setH5FootSatus", false)
      this.ExtractPopData = row
    },
    // 控制提取凭证弹框显示
    _extractVoucherHandle() {
      this.$refs.ExtractVoucherPop.status = true
    },
    // 控制提前解锁弹框显示
    _advanceUnlockHandle() {
      this.$refs.UnlockPop.status = true
    },
    // 控制质押弹框显示
    async _pledgeHandle() {
      if (this.account) {
        if(this.allowance) {
          // 质押操作
          this.$refs.PledgePop.status = true
          this.$store.commit("setH5FootSatus", false)
        } else {
          // 授权操作
          let { _approveOperate, _saveLocalAllowanceOperate } = await this.erc20Utils
          const { lpAddress, name } = this.lockInfo
          const Approvemsg = `${this.$t('Approve')} ${name}`
          const overalltip = this.$overalltip({ type: "loading", msg: Approvemsg})
          _approveOperate(lpAddress, this.account).then((res) => {
            _saveLocalAllowanceOperate(lpAddress, this.account)
            this._updateBalanceInfo()
            this.actionTip = this.$overalltip({ type: "success", msg: `${Approvemsg} ${this.$t('Success')}`, buttonText: this.$t("Close")})
            overalltip.close()
          }).catch((err) => {
            overalltip.close()
            this.actionTip = this.$overalltip({ type: "error", msg: `${Approvemsg} ${this.$t('Error')}`, buttonText: this.$t("Close")})
          })
        }
      } else {
        // 链接小狐狸钱包
        isConnectMetaMask()
      }
    },
    // 收益币种图标
    _getImgUrl(earnedToken = "MDX") {
      return  this.globalGetImgUrl( this.coinConfig[earnedToken.toLowerCase()])
    },
    // 提取收益
    async _extractEarnHandle() {
      const { earnedToken } = this.lockInfo
      let { _setEarnOperate } = await this.erc20Utils
      const overalltip = this.$overalltip({type: "loading", msg: `${this.$t('Claim')} ${this.totalEarn} ${earnedToken}`, buttonText: this.$t("Close")})
      _setEarnOperate().then((res) => {
        this._updateBalanceInfo()
        overalltip.close()
        this.actionTip = this.$overalltip({type: "success", msg: `${this.$t('Claim')} ${earnedToken} ${this.$t('Success')}`,buttonText: this.$t("Close")})
      }).catch((err) => {
        overalltip.close()
        this.actionTip = this.$overalltip({ type: "error", msg: err?.message, buttonText: this.$t("Close")})
      })
    },
    // 改变分页数据
    _pageHandle(val, id) {
      const fixedData = this.regularData.find((item) => { return item.kindId == id})
      this.regularPageData[id] = fixedData.list.slice(this.regularSize*(val-1), this.regularSize*val)
    },
    // 解锁操作
    async _unlockHandle(id) {
      const { earnedToken } = this.lockInfo
      let { _setUnlockAmountOperate } = await this.erc20Utils
      const overalltip = this.$overalltip({type: "loading", msg: `${this.$t('Unlock')} ${earnedToken}`, buttonText: this.$t("Close")})
      _setUnlockAmountOperate(id).then((res) => {
        this._updateBalanceInfo()
        overalltip.close()
        this.actionTip = this.$overalltip({type: "success", msg: `${this.$t('Unlock')} ${earnedToken} ${this.$t('Success')}`,buttonText: this.$t("Close")})
      }).catch((err) => {
        overalltip.close()
        this.actionTip = this.$overalltip({ type: "error", msg: `${this.$t('Unlock')} ${earnedToken} ${this.$t('Error')}`, buttonText: this.$t("Close")})
      })
    },
    // 快捷钱包添加代币
    _addTokenHandle() {
      const symbol = this.lockInfo.voucher
      const addressToken = this.coinConfig['lockup'][symbol.toLowerCase()]
      const image = this.globalGetImgUrl(addressToken, false)
      ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: addressToken,
            decimals: 18,
            symbol,
            image,
          },
        },
      })
    },
    _formatDate,
    _numComma
  },
  destroyed() {
    clearTimeout(this.timeout)
    if (this.actionTip) this.actionTip.close()  
  }
}
</script>

<style lang="less" scoped>
@import "./Lockup.less";
</style>
