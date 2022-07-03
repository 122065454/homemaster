<template>
  <div class="pending text" :class="lang">
    <!-- pc -->
    <div class="main-left">
      <pricenumber v-if="isPC" :width="541"></pricenumber>
      <!-- 倒计时 -->
      <section>
        <!-- 时间pc -->
        <div class="time" v-if="isPC">
          <div class="Countdown">
            <p>{{ $t("Countdown2") }} </p>
            <el-tooltip effect="dark"    placement="right" trigger="click" offset=50 >
                <div slot="content" class="halving" v-html="global.$t('timesTips',{msg:getData.end_block})"></div>
               <img class="tist" src="@/assets/tist.png" alt=""/>  
            </el-tooltip>
          </div>
         
          <div class="progress">
            <el-progress
              type="circle"
              :show-text="false"
              :percentage="percentage"
              status="success"
              :width="148"
              :color="chainName === 'Bsc' ? '#FFC200' : '#009A7F'"
            >
            </el-progress>
            <div class="time-end numbers Medium">
              <div class="time_end_top">
                <span>{{ formatSecondsToDate.h }}:</span>
                <span>{{ formatSecondsToDate.m }}:</span>
                <span>{{ formatSecondsToDate.s }}</span>
              </div>
              <div class="time_end_bottom">{{ format }}</div>
            </div>
          </div>
        </div>
        <!--时间下部分重构 pc -->
        <div class="time_bottom text Bold" v-if="isPC">
          <ul>
            <li class="numbers Medium">
              <span class="nums">{{ $t("contributed2") }}：</span>
              <span><CountUp :endVal="totalInput || 0" /> MDX</span>
            </li>
            <li class="numbers Medium">
              <div class="chaojuxin">
                <span class="nums">{{ $t("caojuxinci") }}:</span>
                <el-tooltip
                  class="item"
                  trigger="click"
                  effect="dark"
                  placement="bottom"
                  popper-class="tipCase"
                >
                  <div
                    slot="content"
                    v-html="global.$t('caojuxinciTips2')"
                  ></div>
                  <i></i>
                </el-tooltip>
              </div>

              <span><CountUp :endVal="superprice || 0" />MDX</span>
            </li>
          </ul>
        </div>
        <!-- 时间h5 -->
        <div class="time text Bold" v-if="!isPC">
          <div class="time_top">
            <span class="time_end">{{ $t("Countdown2") }}：
                <el-tooltip effect="dark"    placement="right" trigger="click" offset=50 >
                <div slot="content" class="halving" v-html="global.$t('timesTips',{msg:getData.end_block})"></div>
               <img class="tist" src="@/views/buyBack/img/qustion.svg" alt=""/>  
            </el-tooltip>
            </span>
            <div class="card__item-value new-item-value numbers Medium">
              <span>{{ formatSecondsToDate.h }}</span
              >:<span>{{ formatSecondsToDate.m }}</span
              >:<span>{{ formatSecondsToDate.s }}</span>
            </div>
          </div>
          <div class="time-bottom-qk" :class="lang">
            <span
              >{{ $t("caojuxinci") }}
              <el-tooltip
                class="item"
                trigger="click"
                effect="dark"
                placement="bottom"
                popper-class="tipCase"
              >
                <div slot="content" v-html="global.$t('caojuxinciTips2')"></div>
                <i></i>
              </el-tooltip>
            </span>
            <span class="numbers Medium"><CountUp :endVal="superprice || 0" /></span>
          </div>
       
          <div class="time-bottom">
            <span>{{ $t("contributed2") }}：</span>
            <span class="numbers Medium"><CountUp :endVal="totalInput || 0" /> MDX</span>
          </div>
        </div>

        <!-- 中奖号码h5 -->
        <pricenumber v-if="!isPC" :isShow="false"></pricenumber>
      </section>
    </div>
    <div class="main-right">
      <div class="tips">
        <!-- <i> </i> -->
        <p>{{ $t("tippending") }}</p>
      </div>
      <!--投入次数 -->
      <div class="num">
        <span>{{ $t("timesput") }}</span>
      </div>
      <input
        class="input_nums text Bold"
        type="text"
        :placeholder="$t('timesput')"
        v-model.trim="putnums"
        @change="changenum"
        @input="
          putnums =
            putnums.length == 1
              ? putnums.replace(/[^1-9]/g, '')
              : putnums.replace(/\D/g, '')
        "
      />
      <div class="num">
        <span v-if="isPC">{{ $t("Contributionamount") }}</span>
        <span>{{ $t("AvailableBalance") }} {{ balace }} </span>
      </div>
      <div class="inputMDX">
        <input
        type="text"
        class="text Bold"
        :placeholder="$t('Minimum') + inputNum + 'MDX'"
        maxlength="8"
        v-model.trim="nums"
      />
      <p class="unit">MDX</p>
      </div>
   
   
      <transition name="doudong">
        <p class="num-tips">
        {{ getTip }}
      </p>
      </transition>

      <p class="put_tips" v-if="isTipsShow">
        {{ $t("xiaohuinums", { msg: putnums }) }}
        <!-- 本轮投入将获得{{putnums}}个销毁凭证号码 -->
      </p>
      <button
        :class="['btn ', isShow ? 'disabel' : '']"
        v-if="allowance > 0"
        :disabled="!isTipsShow"
        @click="repurch"
        v-preventReClick
      >
        {{ getBtnTip }}
      </button>
      <div class="btn" v-else @click="approveToken">{{ $t("Approve") }}</div>

      <h2 v-html="$t('sunshi', { msg: getnumsTips })"></h2>
    </div>
  </div>
</template>

<script>
import { formatSecondsToDateDay, formatDate, splitFormat } from "@/utils";
import { getSalt } from "@/api/buyback.js";
import pricenumber from "../../common/priceNumber";

import {
  getBalance,
  approveErc20Token,
  destroyUtils,
  setLocalAllowance,
  getLocalAllowance,
  getAllowance,
  MaxUint256,
  getBlock,
  getTransaction,
  digestMessage,
} from "@/utils/publicErc20";
let interval = null;
let actionTip = null;
export default {
  name: "pending",
  components: {
    pricenumber,
    // tipDialog,
  },
  data() {
    return {
      nums: 5,
      isShow: false,
      balace: "0.00",
      allowance: 0,
      time: "",
      splitFormat: splitFormat,
      percentage: 100,
      timeNow: "",
      isShowBalance: false,
      global: window.$v,
      putnums: 1,
      isTipsShow: false,
    };
  },
  async created() {
    this.initData()
    console.log(
      this.getData.repurch_token,
      this.account,
      this.getData.contract
    );
    let allowance = 0;
    const localAllowance = getLocalAllowance(
      this.getData.repurch_token,
      this.account,
      this.getData.contract
    );
    if (localAllowance) {
      allowance = localAllowance;
    } else {
      const contractAllowance = await getAllowance(
        this.getData.repurch_token,
        this.account,
        this.getData.contract
      );
      if (contractAllowance > 0) {
        setLocalAllowance(
          this.getData.repurch_token,
          this.account,
          this.getData.contract,
          contractAllowance
        );
        allowance = contractAllowance;
      }
    }
    console.log("allowance:", allowance);
    const balace = await getBalance(this.getData.repurch_token, this.account);
    this.balace = balace;
    this.allowance = allowance;
  },
  mounted() {
    this.$store.dispatch("buyBack/initData");
    this.startCountdown();
    // console.log("dasdasd", formatDate(this.time));
    console.log("thistime", this.timeBetween, this.time);
  },

  computed: {
    lang() {
      return this.$store.state.language === "en" ? "en" : "zn";
    },
    getData() {
      return this.$store.state.buyBack.assetBuyData;
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    chainId() {
      return this.$store.state.chainId;
    },
    // 时间段
    timeBetween() {
      return (
        this.$store.state.buyBack.assetBuyData.end_time -
        this.$store.state.buyBack.assetBuyData.start_time
      );
    },
    // 结束时间
    endTime() {
      return this.$store.state.buyBack.assetBuyData.end_time;
    },
    // 格式化时间
    formatSecondsToDate() {
      return formatSecondsToDateDay(this.time);
    },
    // 格式化日小时
    format() {
      return formatDate(
        this.$store.state.buyBack.assetBuyData.end_time * 1000
      ).ymdhms.slice(5);
    },
    // 瓜分奖励
    getPrice() {
      return Number(this.$store.state.buyBack.assetBuyData.amount);
    },
    // 瓜分数量
    getnum() {
      return (
        splitFormat(this.getData.total_repurch_mdx) *
          this.getData.reward_gold_rate +
        Number(this.$store.state.buyBack.assetBuyData.balance)
      );
    },
    // 单比最小金额
    inputNum() {
      return splitFormat(this.$store.state.buyBack.assetBuyData.min_amount);
    },
    // 当前总投入
    totalInput() {
      return splitFormat(
        this.$store.state.buyBack.assetBuyData.total_repurch_mdx
      );
    },
    // 总投入数量
    totalnum() {
      return splitFormat(
        this.$store.state.buyBack.assetBuyData.total_repurch_mdx
      );
    },
    // 超巨星池
    superprice() {
      return Number(this.totalnum * 0.1) + Number(this.getData.balance);
    },
    // 瓜分数量
    getnumNew() {
      return this.superprice * 0.6;
    },
    getInfo() {
      return this.$store.state.buyBack.assetBuyData.repurch_reward_info;
    },
    //  数量提示
    getnumsTips() {
      return Number(300000 / this.getInfo.bronze.repurch_amount).toFixed(2);
    },

    // 文案判断
    getTip() {
      this.isTipsShow = false;
      // 余额校验
      if (this.nums == "") {
        return;
      }
      if (Number(this.nums * this.putnums) > Number(this.balace)) {
        // 超过可用余额  Excess of available balance
        return this.$t("InsufficientAccountBalance");
      }
      if (this.nums < this.inputNum) {
        return this.$t("Minimumtips.text", { msg: `${this.inputNum}` });
      }
      //  价格判断
      this.isTipsShow = true;
      if (this.nums >= 5000) {
        return this.$t("more5000");
      }
      return "";
    },
    // 按钮文案判断
    getBtnTip() {
      if (!this.isTipsShow) {
        return this.$t("Injecte");
      } else {
        return this.$t("Contribute") + this.nums * this.putnums + "MDX";
        // return `${this.$t('Contribute') ${this.nums*this.putnums}}`
      }
    },
    changeTime(){
      const {chainId,getData}=this
      return{
        chainId,
        getData
      }
    }
  },
  watch: {
    putnums() {
      if (this.putnums >= 100) {
        this.putnums = 100;
      }
    },
    time() {
      clearInterval(interval);
      this.startCountdown();
    },
    changeTime(){
      this.initData()
     
    }
  },
  methods: {
    // 初始化时间
    initData(){
   
      // 初始化时间
    const currentTime = Math.round(new Date() / 1000);
    const timeNow = this.getData.end_time - currentTime;
    timeNow < 0 ? (this.time = 0) : (this.time = timeNow);

    console.log("this.time", this.time);
    },
    changenum() {
      if (this.putnums == "") {
        this.putnums = 1;
      }
    },
    // 开始倒计时定时器
    startCountdown() {
      interval = setInterval(() => {
        if (this.time <= 0) {
          this.percentage = 0;
          this.$emit("pageresult");
          clearInterval(interval);
          return;
        }
        this.time -= 1;
        this.percentage = (this.time / this.timeBetween) * 100;
      }, 1000);
    },
    approveToken() {
      const Approvemsg = `Approve MDX`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: Approvemsg,
      });
      approveErc20Token(
        this.getData.repurch_token,
        this.account,
        this.getData.contract
      )
        .then((res) => {
          overalltip.close();
          setLocalAllowance(
            this.getData.repurch_token,
            this.account,
            this.getData.contract
          );
          const msg = `${Approvemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
          this.allowance = MaxUint256;
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
    async repurch() {
      if (this.nums == "") return;
      // 余额校验
      if (Number(this.nums) > Number(this.balace)) {
        // 超过可用余额  Excess of available balance
        this.isShowBalance = true;
        return;
      }
      if (this.isPC) {
        var overalltip = this.$overalltip({
          type: "loading",
          msg: "",
        });
      } else {
        var msgloading = this.$message({
          // showClose: true,
          message: "loading...",
          type: "info",
          showClose: false,
          offset: "50",
          customClass: "h5dialog",
          duration: 0,
        });
      }
      const repurchFun = await destroyUtils(
        this.getData.contract,
        this.getData.repurch_decimal,
        this.getData.reward_decimal,
        this.account
      );

      const { deposit } = repurchFun;
      deposit(this.nums, this.nums * this.putnums)
        .then(async (res) => {
          let balace = await getBalance(
            this.getData.repurch_token,
            this.account
          );
          const { transactionHash, blockNumber } = res;
          const blockInfo = await getBlock(blockNumber);
          const { hash, transactions } = blockInfo;
          try {
            let ores = await this.getRepurchSalt(blockNumber);
            const repurchSalt = ores.data?.result.repurch_salt;
            console.log("ores", repurchSalt);

            this.balace = balace;

            if (this.isPC) {
              overalltip.close();
            } else {
              msgloading.close();
            }
            if (repurchSalt) {
              // 中奖弹框提示
              let newList = [];
              for (let i = 0; i < this.putnums; i++) {
                const reward_nonce =
                  transactionHash +
                  hash +
                  transactions.length +
                  repurchSalt +
                  i;

                const reward_str = await digestMessage(reward_nonce);
                newList.push(reward_str);
              }

              console.log("reward_str:", newList);
              this.$emit("tipshow", newList);
            } else {
              const message = this.global.$t("putsuccess");
              // const message = this.global.$t('wontsucess.msgs')

              this.$message({
                message,
                type: "success",
                offset: "50",
              });
            }
          } catch (error) {
              
             const msg = `Network Error`;
             actionTip = this.$overalltip({
             type: "error",
             msg,
          });
          }

          // .catch((err)=>{
         
          // })
        })
        .catch((err) => {
          const msg = window.$v.$t("Transactionrejected");
          actionTip = this.$overalltip({
            type: "error",
            msg,
          });
          if (this.isPC) {
            overalltip.close();
          } else {
            msgloading.close();
          }
        });
    },
    getRepurchSalt(val) {
      const params = {
        mdex_chainid: this.chainId,
        phase: sessionStorage.getItem("phaseNow"),
        block_number: val,
      };
      return getSalt(params);
 
    },
  },
  destroyed() {
    clearInterval(interval);
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>
 <style lang="less" scoped>
 @import './nowPeriodPending.less';
</style>