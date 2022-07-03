<template>
  <div class="boardroom-pool" :class="[chainName, getLanguage]">
    <title-banner> </title-banner>
    <div class="boardroom-pool__content text">
      <div class="boardroom-pool__cards">
        <div class="boardroom-pool__content-card">
          <div :class="poolData.type == 'boardroom' ? 'addToken-bar' : 'fix_addToken-bar'" v-if="isMobile">
            <p v-show="poolData.type == 'boardroom'" class="addToken" @click="addToken(poolData)">
              <img src="@/assets/svg/metamask-fox.svg" /> 
              {{ $t('addToken.text', { token: poolData.earned_token }) }}
            </p>
            <div class="pool__card-buttons">
              <button class="claim" :disabled="!earn || (earn.hasOwnProperty('mdx') && !earn['mdx']) || isblack" @click="handleClaim">
                {{ $t("Claim") }}
              </button>
            </div>
          </div>
          <!-- 双挖（双奖励） -->
          <div v-if="poolData.earnedToken && poolData.earnedToken.includes('&')">
            <div class="pool-item">
              <div class="pool__card-icon">
                <img :src="getImgUrl(poolData.earned_token)" alt="" />
              </div>
              <div>
                <div class="pool__card-text">
                  {{ poolData.earned_token || "MDX" }} {{ $t("Earneds") }}
                </div>
                <div class="pool__card-price numbers">
                  {{ Math.floor(+earn['earn'] * 10000) / 10000 }}
                </div>
              </div>
            </div>
            <div class="pool-item">
              <div class="pool__card-icon">
                <img :src="getImgUrl(poolData.pool_name)" alt="" />
              </div>
              <div>
                <div class="pool__card-text">
                  {{ poolData.pool_name || "MDX" }} {{ $t("Earneds") }}
                </div>
                <div class="pool__card-price numbers">
                  {{ Math.floor(+earn['mdx'] * 10000) / 10000 }}
                </div>
              </div>
            </div>
          </div>
          <!-- 单挖（单奖励） -->
          <div v-else>
            <div class="pool__card-icon">
              <img :src="getImgUrl(poolData.earnedToken)" alt="" />
            </div>
            <div class="pool__card-text mv15">
              {{ poolData.earnedToken || "MDX" }} {{ $t("Earneds") }}
            </div>
            <div class="pool__card-price numbers">
              {{ Math.floor(earn * 10000) / 10000 }}
            </div>
          </div>
          <!-- 提取 -->
          <div class="pool__card-buttons" v-if="isPC">
            <button class="claim" :disabled="!earn || (earn.hasOwnProperty('mdx') && !earn['mdx']) || isblack" @click="handleClaim">
              {{ $t("Claim") }}
            </button>
          </div>
          <div :class="poolData.type == 'boardroom' ? 'addToken-bar' : 'fix_addToken-bar'" v-if="isPC">
            <p v-show="poolData.type == 'boardroom'" class="addToken bo" @click="addToken(poolData)">
              <img src="@/assets/svg/metamask-fox.svg" /> 
              {{ $t('addToken.text', { token: poolData.earned_token }) }}
            </p>
          </div>
        </div>

        <div class="boardroom-pool__content-card">
          <img :src="getLpImgUrl(poolData)" alt="" height="50" />
          <!-- h5 -->
          <div class="pool__card-buttons" v-if="isMobile" v-show="!isblack">
            <button class="connect" @click="handleApprove" v-if="allowance == 0 && account">
             {{$t('Approve')}}
            </button>
            <button class="connect" @click="handleWallet" v-if="!account">
              {{$t('UnlockWallet')}}
            </button>
            <div class="pool__card-step-warp line_bg" v-if="allowance > 0 && account">
              <div class="pool__card-step" @click="() => operateHandle('withdraw')">
                -
              </div>
              <div class="line_middel"></div>
              <div class="pool__card-step" v-if="!(poolData.type == 'liquidity' && (poolData.pid < 8 && chainId == 128 || poolData.pid < 28 && chainId == 56) || poolData.earned_token =='OLDHOO' || poolData.earned_token =='ZT' || poolData.name.includes('ZT'))" @click="() => operateHandle('despoit')">
                +
              </div>
            </div>
          </div>
          <div class="filed-bar">
            <div>
              <div class="pool__card-text mv15">
                {{ poolData.name }} {{ $t("Stakeds") }}
              </div>
              <div class="pool__card-price numbers">
                {{ Math.floor(stakedValue * 10000) / 10000 }}
              </div>
            </div>
            <div v-if="poolData.type == 'boardroom' && isMobile && allowance > 0 && poolData.end_block && poolData.end_block > 0">
              <div class="pool__card-text mv15">
                {{ poolData.name }} {{ $t("EndBlock") }}
              </div>
              <div class="pool__card-price numbers" @click="_toBlock(poolData.end_block, chainName)"> 
                {{ poolData.end_block }}
              </div>
            </div>
          </div>

          <!-- pc -->
          <div class="pool__card-buttons" v-if="isPC" v-show="!isblack">
            <button class="connect" @click="handleApprove" v-if="allowance == 0 && account" >
             {{$t('Approve')}}
            </button>
            <button class="connect" @click="handleWallet" v-if="!account">
              {{$t('UnlockWallet')}}
            </button>
            <div class="pool__card-step-warp" v-if="allowance > 0 && account">
              <div class="pool__card-step" @click="() => operateHandle('withdraw')">
                -
              </div>
              <div class="pool__card-step" v-if="!(poolData.type == 'liquidity' && (poolData.pid == 74 && chainId == 128 || poolData.pid < 8 && chainId == 128 || poolData.pid < 28 && chainId == 56) || poolData.earned_token =='OLDHOO' || poolData.name.includes('ZT'))" @click="() => operateHandle('despoit')">
                +
              </div>
            </div>
          </div>
          <p v-if="account && isblack">{{$t('apprveMsg', {address: spender})}}</p>
          <a target="_blank" v-if="account && isblack" :href="'https://debank.com/profile/' + this.account +'/approve'">{{$t('cancelApprove')}}</a>
        </div>
      </div>
      <!--投资风险提示 -->
      <div class="tips" v-show="isblack">
        <img src="@/assets/svg/notice.svg" alt="">
        <span v-html="$t('noticeTips')"></span>
        <!-- 判断是pc -->
        <span v-html="$t('investNotice')"></span>
      </div>
      <!-- 全部提取/添加流动性 -->
      <div class="pool-settle-provide" v-if="isPC">
        <button @click="settle" class="pool-settle" :disabled="!earn || (earn.hasOwnProperty('mdx') && !earn['mdx'])">
          {{ $t("SettleWithdraw") }}
        </button>
        <a class="pool-settle provide" :href="link" target="_blank" v-show="link">
          {{ $t("ProvideLiquidity") }}
        </a>
      </div>
      <div class="pool-settle-provide line_disappear" v-if="isMobile">
        <div class="pool-settle button" @click="settle"  :class="[!earn || (earn.hasOwnProperty('mdx') && !earn['mdx'])?' isDisabeld':'']">
           {{ $t("SettleWithdraw") }}
        </div>
        <div class="middel" v-show="link"></div>
        <div class="right pool-settle provide" v-show="link">
          <a class="pool-settle provide" :href="link" target="_blank" >
          {{ $t("ProvideLiquidity") }}
        </a>
        </div>
      </div>
    </div>
    <Despoit :pid="poolData.pid" ref="despoit" :max="lpBalance" :data="poolData"
      @updateData="updateData" :erc20Utils="erc20Utils" />
    <Withdraw :pid="poolData.pid" ref="withdraw" :max="stakedValue" :data="poolData"
      @updateData="updateData" :erc20Utils="erc20Utils" />
  </div>
</template>

<script>
import { getErc20Utils, isConnectMetaMask, getAllowance } from "@/utils/publicErc20";
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import { _toBlock, _pooljump } from "@/utils/urlMethod"
import Withdraw from "@/components/modals/withdraw";
import coinConfig from "@/utils/address.config.js";
import tipDialog from "@/components/tipDialog.vue";
import Despoit from "@/components/modals/despoit";
let actionTip = null;
export default {
  name: "BoardroomPool",
  components: {
    Despoit,
    Withdraw,
    tipDialog,
    TitleBanner,
  },
  data() {
    return {
      stakedOptions: {
        decimalPlaces: 4,
      },
      link: "",
      isblack: false,
      spender: ''
    };
  },
  created(){
   
  },
  computed: {
    coinConfig() {
      return coinConfig[this.chainId];
    },
    blackData() {
      return this.$store.state.blackData;
    },
    stakedValue() {
      return this.$store.state.boardRoom.stakedValue;
    },
    earn() {
      const val = this.$store.state.boardRoom.earn
      return typeof(val) == 'object' ? val : Number(val)
    },
    allowance() {
      return this.$store.state.boardRoom.allowance;
    },
    lpBalance() {
      return this.$store.state.boardRoom.lpBalance;
    },
    apylist() {
      return this.$store.state.liquidity.apylist;
    },
    isShowTips(){
      let name=this.poolData.name.split(' ')[0].split('/')
      return name.find(item=>item==='BLACK')
    },
    // 数据
    poolData() {
      let { type, earn, id } = this.$route.params;
      if (type == "boardroom") {
        let targetData = this.$store.getters["boardRoom/currentChainBoardRoomData"][earn];
        const data = targetData.find((item) => item.pid == id) || {};
        if (data.name.includes(" LP")) this.link = _pooljump(this.getLanguage, this.chainName, data.token_main, data.token_slave)
        return {
          ...data,
          earn,
          type,
        };
      }
      if (type == "liquidity") {
        let targetData = this.$store.getters["liquidity/poolList"];
        const data = targetData.find((item) => item.pid == id) || {};
        if (this.apylist[data.pid]) {
          const pool = this.apylist[data.pid];
          if(pool.pool_name.includes('/')) this.link = _pooljump(this.getLanguage, this.chainName, pool.token0, pool.token1)
        }
        return {
          ...data,
          earn,
          type,
        };
      }
    },
    erc20Utils() {
      let { type, earn } = this.$route.params;
      return getErc20Utils(this.$store.state.chainId, type, earn);
    },
  },
  async mounted() {
    let { id } = this.$route.params;
    this.pid = id;
    this.updateData();
    const { lpAddress } = this.poolData;
    if(this.blackData[lpAddress.toLowerCase()]) {
      const allowance = await getAllowance(lpAddress, this.account, this.blackData[lpAddress.toLowerCase()])
      if(allowance > 0) {
        this.isblack = true
        this.spender = this.blackData[lpAddress.toLowerCase()].slice(0, 4) + '...' + this.blackData[lpAddress.toLowerCase()].slice(-4);
      }
    } 
  },
  watch: {
    chainId() {
      this.updateData();
    },
  },
  methods: {
    // 判断是否为双挖
    isDoubleBenefit () {
      const earnedToken = this.poolData.earnedToken ?? this.poolData.earn
      return earnedToken.includes('&')
    },
    // 选择弹出添加/提取
    operateHandle(type) {
      if(type == 'withdraw') this.$refs.withdraw.showModel()
      if(type == 'despoit') this.$refs.despoit.showModel()
    },
    getImgUrl(earnedToken = "MDX") {
      return this.globalGetImgUrl( this.coinConfig[earnedToken.toLowerCase()]); 
    },
    getLpImgUrl(item) {
      return  this.globalGetImgUrl(item.lpAddress); 
    },
    updateData() {
      this.$store.dispatch("boardRoom/getWalletData", this.poolData);
    },
    addToken(poolData) {
      let decimals = 18
      if(poolData.earnedToken == 'HOO' || poolData.earnedToken == 'ARV') decimals = 8
      if(poolData.earnedToken == 'PID' || poolData.earnedToken == 'nPID' || poolData.earnedToken == 'RICI'  || poolData.earnedToken == 'META') decimals = 9
      const image = this.getImgUrl(poolData.earned_token)
      const symbol = poolData.type == 'boardroom' ? poolData.earned_token : 'MDX'
      ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: this.coinConfig[symbol.toLowerCase()],
            symbol: symbol,
            decimals,
            image,
          },
        },
      })
    },
    async settle() {
      let { unStake } = this.erc20Utils;
      const settlemsg = `Settle & Withdraw Tokens`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: settlemsg,
      });
      unStake(this.pid, this.stakedValue, this.account)
        .then((res) => {
          this.updateData();
          overalltip.close();
          const msg = `${settlemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
        })
        .catch((err) => {
          overalltip.close();
          const msg = `${settlemsg} Error`;
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
        });
    },
    handleWallet() {
      isConnectMetaMask()
      this.updateData()
    },
    // 双挖按钮提示警告
    warnningTips() {
      actionTip = this.$overalltip({
        type: "error",
        msg: this.$i18n.t("DoubleDiggingTips", {url: this.getUrlList['Telegram']})
      });
    },
    // 提取收益
    async handleClaim() {
      let { despoitValue } = this.erc20Utils;
      const msg = (() => {
        if(this.isDoubleBenefit()) {
          return `Claim ${this.earn['earn']} ${this.poolData.earned_token} & ${this.earn['mdx']} ${this.poolData.pool_name}`;
        } else {
          return `Claim ${this.earn} ${this.poolData.earn.toUpperCase()}`;
        }
      })()
      const earnCoin = this.isDoubleBenefit() ? `${this.poolData.earned_token} & ${this.poolData.pool_name}` : this.poolData.earn.toUpperCase()
      const overalltip = this.$overalltip({
        type: "loading",
        msg,
      });
      despoitValue(this.pid, 0, this.account)
        .then((res) => {
          this.updateData();
          overalltip.close();
          const msg = `Claim ${earnCoin} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
        })
        .catch((err) => {
          overalltip.close();
          const msg = `Claim ${earnCoin} Error`;
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
        });
    },
    // 授权
    async handleApprove() {
      let { approveToken, saveLocalAllowance } = this.erc20Utils;
      const { lpAddress } = this.poolData;
      const Approvemsg = `Approve ${this.poolData.name}`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: Approvemsg,
      });
      approveToken(lpAddress, this.account)
        .then((res) => {
          overalltip.close();
          saveLocalAllowance(lpAddress, this.account)
          this.updateData();
          const msg = `${Approvemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
        })
        .catch((err) => {
          overalltip.close();
          const msg = `${Approvemsg} Error`;
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
        });
    },
    _toBlock
  },
  beforeDestroy() {
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>

<style scoped lang="less">
@import "./BoardroomPool.less";
</style>
