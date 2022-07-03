<template>
  <section class="pc-section" :class="chainName">
    <div class="between bet-item numbers">
      <div class="bet-info">
        <div class="bet-text">{{$t('from')}} </div>
        <div class="bet-selete">
          <p class="bet-p-img center">
              <show-img :name="assets.startChain" />
          </p>
          <p class="bet-p-text">{{assets.startChain}}</p>
        </div>
      </div>
      <div class="bet-img center">
        <img src="@/assets/point.png" class="point-img" alt="">
      </div>
      <div class="bet-info">
        <div class="bet-text">{{$t('to')}}</div>
        <div class="bet-selete">
          <p class="bet-p-img center">
            <show-img :name="assets.endChain" />
            </p>
          <p class="bet-p-text">{{assets.endChain}}</p>
        </div>
      </div>
    </div>

    <!-- <div class="text-tip">
      <img src="@/assets/star-icon.png" alt="">
      <span>
        {{$t('BinanceSmartChainNetwork')}}
      </span>
    </div> -->

    <div class="account-item">
      <div class="between account-msg">
        <span class="text Bold"> {{$t('AmountToBeTrasferred')}} </span>
        <span class="numbers">{{ getformatFloat(assets.moneyAssets)  }} {{assets.currency}}</span>
      </div>
      <div class="between account-info">
        <span> {{$t('ReceivinAddress')}} </span>
        <span class="numbers">{{ setAddress(assets.address)}}</span>
      </div>
    </div>

    <div class="account-item">
      <div class="between account-msg">
        <span class="text Bold">{{$t('AmountReceived')}}</span>
        <span class="numbers">{{assets.moneyPractical}} {{assets.currency}}</span>
      </div>
      <div class="between account-info">
        <div class="start" @click="$emit('on-show-info')">
          <span>{{$t('TransactionFee')}}</span>
          <img src="@/assets/mark-icon.png" class="point-img" alt="">
        </div>
        <div class="numbers">
          <span>{{getformatFloat(this.assets.Token_money)}} {{assets.currency}}</span>
          <span class="acc-text">(${{getformatFloat(this.assets.USDT_money)}})</span>
        </div>

      </div>
    </div>

    <div class="text-tip text" v-if="mdxToHecoTips">
      <img src="@/assets/star-icon.png" alt="">
      <span v-html="$t('hecoEquivalentValue')" v-if="assets.currency=='MDX'&&chainName=='Heco'"></span>
      <span v-else>{{$t('bscEquivalentValue')}}</span>
    </div>

    <button class="link-button" @click="Authorization" :disabled="Number(this.assets.moneyAssets) < Number(this.assets.Token_money)">
      {{$t('Authorization')}}
    </button>

    <div class="back center" @click="lastLine">
      <span>{{$t('Return')}}</span>
    </div>
    <!-- 添加对话框 -->
    <!-- <el-dialog
    custom-class='class-el'
    :title="$t('CheckAdress')"
    top='37vh'
    :visible.sync="dialogVisible"
    :width="isPC?'16%':'90%'"
    >
    <h1 class="adress">{{fnGetAddress(assets.address)}}</h1>
    <span style="color:red">如果输错合约地址资金将永久丢失</span>
   <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">{{ $t('Cancel')}}</el-button>
    <el-button type="primary" @click="Authorization">确认转账</el-button>
  </span>
</el-dialog> -->
  </section>
</template>

<script>
import { numTimes } from '@/utils/formatBalance'
import { formatFloat } from "@/utils/formatBalance";
import formatAddress from "@/utils/formatAddress";
import showImg from "@/views/CrossChain/components/showImg.vue";
let actionTip = null;
export default {
  name: "authorization",
  data() {
    return {
      dialogVisible:false
    };
  },
 components: {
    showImg
  },
  props: {
    assets: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  beforeMount() {},
  computed: {
    lockContract() {
      return this.$store.getters["crossChain/lockContract"]
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    //  getformatFloat() { //getformatFloat(this.assets.USDT_money)
    //   return formatFloat(this.assets.USDT_money,6);
    // },
     getformatFloat() {
      return (t)=>{
       return formatFloat(t,6)
      };
    },
    //  提示语变更 
    mdxToHecoTips(){
       return ['MDX','HMDX'].includes(this.assets.currency)
    }
  },
  methods: {
   // 默认截取地址
     fnGetAddress(str){
      return str ? (str.substring(0,16)+'...'+str.substring(str.length-16)) : ''
     },
   setAddress(addr){
            return formatAddress(addr)
   },
    lastLine() {
      this.$emit("on-next", 1);
    },
    handelClcik(){
      this.dialogVisible=true
      
    },
    // 授权的跨链的事件请求
    async Authorization(){
      this.dialogVisible=false
   
      console.log('assets:', this.assets)
      const fromTokenHash = `0x${this.assets.src_token}`
      // 模拟成功跳转
      // this.$store.dispatch("crossChain/getOneChainHistory");
      // this.$emit('on-next',4)
      const fromAddress = this.account
      const amountInt = numTimes(this.assets.moneyAssets)
      const Approvemsg = `Trasferred ${this.assets.currency}`;
      const overalltip = this.$overalltip({
        type: "loading",
        msg: Approvemsg,
      });
      const lockContract = await this.lockContract
      console.log(fromTokenHash, this.assets.poly_chain_id, this.assets.address, amountInt, numTimes(this.assets.Token_money))
      lockContract.methods.lock(fromTokenHash, this.assets.poly_chain_id, this.assets.address, amountInt, numTimes(this.assets.Token_money), 0).send({
        from: fromAddress,
        value: fromTokenHash === '0x0000000000000000000000000000000000000000' ? amountInt : undefined,
      }).then(res => {
        this.$store.dispatch("crossChain/saveHash", {
          hash: res.transactionHash,
          src_chain_id: this.assets.fromChainid,
          dst_chain_id: this.assets.toChainId,
          amount: this.assets.moneyAssets,
          token: fromTokenHash,
          cross_fee: this.assets.Token_money
        });
        setTimeout(() => {
          this.$store.dispatch("crossChain/getchainHistory");
          this.$store.dispatch("crossChain/getAssetslist");
          overalltip.close();
          this.$emit('on-next', 3)
        }, 3000)
      }).catch(err => {
        overalltip.close();
        console.log('lockContract:', err)
        const msg = `Authorization Error`;
        actionTip = this.$overalltip({
          type: "error",
          msg,
        });
      })
    }
  },
  beforeDestroy() {
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>

<style scoped lang="less">
.Heco {
  .link-button {
    background: #03ad90;
    color: white;
    box-shadow: 0px 9px 10px 0px rgba(1, 207, 170, 0.2);
  }
}
.Bsc {
  .link-button {
    color: #ffca13;
    background: #2e2e2e;
  }
}
.ETH {
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

input {
  border: none;
  outline: none;
}

// section {
//   min-height: 510px;
//   background-color: white;
// }
//     min-height: 535px;

input {
  font-size: 12px;
}

.bet-icon {
  height: 20px;
  width: 20px;
}

/*   跨链选择 */
.bet-item {
  margin-top: 10px;
  margin-bottom: 18px;
  box-shadow: 0px 5px 15px 0px rgba(15, 21, 77, 0.08);
  border-radius: 9px;
  height: 150px;
  .bet-info {
    width: 100%;
    .bet-selete {
      height: 130px;
      background: #ffffff;
      border-radius: 9px;
      padding: 0 10px;
      font-size: 16px;
      color: #181f36;
      .bet-p-img {
        height: 100px;
      }
      .bet-p-text {
        text-align: center;
      }
      img {
        height: 36px;
        width: 36px;
      }
    }

    .bet-text {
      height: 20px;
      font-size: 13px;
      font-weight: 600;
      padding: 4px;
    }
  }
}

.bet-img {
  flex-shrink: 0;
  width: 58px;
  height: 80px;
  padding-top: 20px;
  .point-img {
    width: 26px;
    height: 26px;
  }
}
.text-tip {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 400;
  color: #626e88;
  padding: 2px;
  line-height: 17px;
  img {
    width: 12px;
    height: 12px;
  }
}

.account-item {
  margin-top: 15px;
  margin-bottom: 10px;
  .account-msg {
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    color: #181f36;
    border-bottom: 1px solid #e9eaec;
  }
  .account-info {
    height: 34px;
    font-size: 12px;
    font-weight: 500;
    color: #48587b;
    img {
      width: 12px;
      height: 12px;
    }
    .acc-text {
      color: #8d96af;
    }
  }
}

.link-button {
  margin-top: 18px;
  width: 100%;
  height: 50px;
  // background: #03ad90;
  // color: white;
  
  border-radius: 8px;
  font-size: 18px;
}
.back {
  margin-top: 5px;
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #03ad90;
  cursor: pointer;
}
.adress{
  color: red;
  margin-bottom: 10px;
}


@media screen and (max-width: 700px) {
  .pc-section {
    background-color: white;
  }
  
}

@media screen and (min-width: 700px) {
  .pc-section {
    width: 415px;
    background-color: white;
    padding: 20px;
    margin-top: -100px;
    // min-height: 550px;
    // background: #ffffff;
    box-shadow: 0px 20px 30px 0px rgba(81, 85, 121, 0.03);
    border-radius: 10px;
  }
  
}
</style>