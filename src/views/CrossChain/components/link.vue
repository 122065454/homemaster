<template>
  <section class="pc-section text" :class="chainName">
    <p class="selete-name">{{$t('ChooseTheCrossChainBridgeAsset')}}</p>

    <div class="between selete-title numbers Medium" @click="showSeleteAssets">
      <div class="start">
        <img v-show="currency!=''" :src="getGlobalAcrossUrl(itemAssets.address)" class="bet-icon" alt="">
        <span class="selete-text"> {{chainName=="Bsc" && currency=='MDX' ?'HMDX':currency}}</span>
      </div>
      <img src="@/assets/selete-link.png" class="selete-img" alt="">
    </div>
    <!--  -->
    <div class="between bet-item">
      <div class="bet-info">
        <div class="bet-text">{{$t('from')}} </div>
        <div class="between bet-selete numbers Medium">
          <show-img :name="itemAssets.chain_symbol" />
          <span> {{itemAssets.chain_symbol}}</span>
          <i></i>
        </div>
      </div>
      <div class="bet-img center">
        <img src="@/assets/point.png" class="point-img" alt="">
      </div>
      <!-- to chain -->
      <div class="bet-info">
        <div class="bet-text">{{$t('to')}}</div>
        <div class="between bet-selete numbers Medium" @click="showChildSeleteAssets">
          <show-img :name="ChildItemAssets.chain_symbol" />
          <span>{{ChildItemAssets.chain_symbol}}</span>
          <img src="@/assets/selete-link.png" class="selete-img" alt="">
        </div>
        <div class="bet-hide">
          <selete-assets ref="toAssets" name="chain_symbol" :dataList="childAssetslist" @change-item="setChildItem"
            :showLine="true" :showId="itemAssets.token_id" :showAction="ChildItemAssets" showType="2"> </selete-assets>
        </div>
      </div>
    </div>
    <p class="selete-name"> {{$t('ReceivinAddress')}}</p>
    <div class="address numbers">
      <input type="text" v-model="assetsAddress" :placeholder="$t('TargetReceivinAddress')" :disabled='isIswap'/>
      <i class="el-icon-circle-close" v-if="assetsAddress!==''&&isPC" @click="assetsAddress=''"></i>
    </div>
    <div v-show="addressShowInfo" class="addr-verify">
      <span>{{ $t('invalidDestionationAddress')}}</span>
    </div>
     <div class="text-tip">
      <img src="@/assets/star-icon.png" alt="">
      <span v-html="$t('addrTip',{msg:addressName})">
      </span>
    </div>
    <p class="selete-name  between">
      <span> {{$t('InputAmountOfAssetNeeded')}}</span>
      <span class="tip-let">
        {{getTip}}
      </span>
      
    </p>
    <div class="between assets-item">
      <div class="assets-input start numbers">
        <!-- <img  :src="getImg(itemAssets)" class="bet-icon" alt=""> -->
        <!-- <img v-show="currency=='FEI'" src="@/assets/FEI.png" class="bet-icon" alt="">
        <img v-show="currency=='Tribe'" src="@/assets/Tribe.png" class="bet-icon" alt=""> -->
        <img  :src="getGlobalAcrossUrl(itemAssets.address)" class="bet-icon" alt="">
        <input type="number" v-model="assetsNum" :placeholder="isIswap?'跨链1000usdt上,限时免手续费':min_amount" />
      </div>
      <div class="assets-info center numbers ">
        <!-- MDX -->
       
        <span class="assets-type"> {{chainName=="Bsc" && currency=='MDX' ?'HMDX':currency}}</span>
        <!-- available disabled -->
        <button  class="assets-max" @click="setMax" :disabled="boolBtn"> {{$t('Maximum')}}</button >
      </div>
    </div>

    <div class="start available">
      <span>{{$t('Usable')}}：</span>
      <span class="numbers Medium">{{available}}</span>
      <!-- MDX -->
      <span class="numbers Medium"> {{chainName=="Bsc" && currency=='MDX' ?'HMDX':currency}}</span>
    </div>
    <!-- iswap 显示 跨链显限额-->
    <div class="start available">
      <span>每日限额：</span>
      <span class="numbers Medium">{{available}}</span>
      <!-- MDX -->
      <span class="numbers Medium"> {{chainName=="Bsc" && currency=='MDX' ?'HMDX':currency}}</span>
    </div>
    <button class="link-button action-button" v-if="!isLogin" @click="ConnectWallet">
      {{$t('ConnectWallet')}}
    </button>
     <button class="link-button action-button" v-if="isLogin && tokenAllowance == 0" @click="handleApprove">
      Approve
    </button>
    <!-- :class="show_or_next?'':'no-button'" -->
    <button class="link-button action-button" :disabled="!show_or_next"  @click="nextLine" v-if="isLogin && tokenAllowance > 0">
      {{$t('Next')}}
    </button>
    <!-- 新加提示  是isSwap就不显示-->
    <!-- <p class="tips text">{{$t('tipsAdd')}}</p> -->
    <template v-if="!isIswap">
    <p class="quota-name" @click="$emit('on-show-info')"> <span> {{$t('DailyLimitForTransfer')}} <img
          src="@/assets/mark-icon.png" class="bet-icon" alt=""></span></p>
    <div class="quota start numbers" v-show="currency!=''">
      <!-- <span> {{$t('DailyLimitForTransfer')}}</span> -->

      <span class="quota-zj">
        {{ChildItemAssets.daily_amount?ChildItemAssets.daily_amount.toLocaleString():0}}
      </span>
      <span class="quota-text">/
        {{ChildItemAssets.daily_limit?Number(ChildItemAssets.daily_limit).toLocaleString():0}}
      </span>
      <span class="quota-text"> {{chainName=="Bsc" && currency=='MDX' ?'HMDX':currency}}</span>
    </div>
    <div class="quota-line start"> <span
        :style="`width: ${(ChildItemAssets.daily_amount/ChildItemAssets.daily_limit)*100}%`"></span></div>
   </template>
    <div class="record start">
      <!-- 查看记录 -->
      <span @click="$emit('on-next', 3);"> {{$t('TransactionHistory')}}</span>
    </div>

    <selete-assets ref="assets" :dataList="assetslist" @change-item="setItem" name="token_symbol"
      :showAction="itemAssets" showType="1">
    </selete-assets>

  </section>
</template>

<script>

import seleteAssets from "@/views/CrossChain/components/seleteAssets.vue";
import { approveErc20Token, setLocalAllowance,isAddress,isConnectMetaMask } from '@/utils/publicErc20'
import showImg from "@/views/CrossChain/components/showImg.vue";
let actionTip = null;
export default {
  name: "assets-link",
  data() {
    return {
      used_num: 5, // 这个已用
      chainImg: "",
      currency: "",
      available:0, // 可用
      assetsNum: "", // 输入的资产数量
      assetsBool: false, // 输入的资产数量
      assetsAddress: "", //  输入收货地址
      itemAssets: {},
      ChildItemAssets: {},
      next: true, // 是否可用下一步
      childAssetslist: [],
      balance: '',
      addressShowInfo:false,
      chainNameNow:'',
      isIswap:false,  // 判断是否是iswap 
      iswapList:[], //  iswapd代币数组
      };
  },
  components: {
    seleteAssets,showImg
  },
  watch: {
    // itemAssets(item) {
    //   if (item.chains.length >0) {
    //     console.log('this.ChildItemAssets =item.chains[0];')
    //     this.ChildItemAssets =item.chains[0];
    //   }
    // },
    ChildItemAssets() {
      // console.log('ChildItemAssets', this.ChildItemAssets)
      this.$store.dispatch("crossChain/getTokenAllowance", `0x${this.ChildItemAssets.src_token}`);
    },
    assetsAddress(){
      this.addressShowInfo=false
    },
    chainName(){
      this.itemAssets={}
      this.ChildItemAssets.chain_symbol=''
      this.ChildItemAssets= {}
      this.childAssetslist=[]
      this.currency=''
    },
    childAssetslist(){
        this.chainNameNow=this.childAssetslist[0]?.chain_symbol
    }
  },
  created() {
    // if(this.account){
    //     this.assetsAddress=this.account
    // }
    // getIswapToken().then(res=>{
    //   this.iswapList=res.data.result
    // })
    // console.log('itemAssets:', this.itemAssets)
  },
  computed: {
    // available() {
    //   console.log('tokenBalance:', this.$store.state.crossChain.tokenBalance)
    //   return this.$store.state.crossChain.tokenBalance;
    // },

    //  this.$store.dispatch("crossChain/getAssetslist");
    chainId() {
      return this.$store.state.chainId;
    },
     // erc20 文案判断
    addressName(){
      switch(this.chainNameNow){
        case 'HECO':
        return 'HRC20'
        case 'BSC':
        return 'BEP20'
        case 'Ethereum':
        return 'ERC20'

      }
    },
    isPC() {
      return this.$store.getters.isPC;
    },
    crossAddress() {
      return this.$store.getters["crossChain/currentCrossAddress"]
    },
    tokenAllowance() {
      return this.$store.state.crossChain.tokenAllowance;
    },
    getMaxDaily() {

      return Number(this.ChildItemAssets.daily_limit) - Number(this.used_num);
    },
    getCurrencyPrice() {
      return this.itemAssets.from_addr
        ? this.$store.state.CurrencyPrice[this.itemAssets.from_addr].price
        : "";
    },
    assetslist() {
      this.itemAssets={}
      this.ChildItemAssets= {}
      this.childAssetslist=[]
      const assetslist = this.$store.state.crossChain.assetslist;
      // const assetslist = this.iswapList;
      console.log('assetslist0',assetslist);
      if (assetslist.length > 0) {
        this.setItem(assetslist[0]);
      }
      console.log('assetslist',assetslist);
      return assetslist;
    },
    min_amount() {
      const min_amount = Number(this.ChildItemAssets.min_amount) || "--";
      return `${this.$t("MinimumAmountForTransfer")} ${min_amount}` 
      // ${
      // this.chainName=="Bsc" &&  this.currency=='MDX' ?'HMDX': this.currency
      // }`
    },
    show_or_next() {
      // const ass = this.itemAssets.token_name;  
      const Childass = this.ChildItemAssets.chain_symbol;
      const addr = this.assetsAddress !== "";
      const min =
        Number(this.assetsNum) >= Number(this.ChildItemAssets.min_amount);
      const max =
        Number(this.assetsNum) <= Number(this.ChildItemAssets.max_amount);

      const daily = Number(this.assetsNum) <= this.getMaxDaily;
      const available=Number(this.available) >=   Number(this.assetsNum)

      return Childass && addr && min && max && daily && available ;
    },
    isLogin() {
      return this.$store.getters.isLogin;
    },
    boolBtn(){
        if(Number(this.available) <Number(this.ChildItemAssets.min_amount) ){
          return true
        }
        if(Number(this.available==0) ){
          return true
        }
         return false
    },
    // 判断文案
    getTip(){
    
        const  min_amount=Number(this.ChildItemAssets.min_amount)
        const  max_amount=Number(this.ChildItemAssets.max_amount)
        if(this.assetsNum==''){
          return ''
        }
        if(Number(this.assetsNum)>Number(this.available)){
          // 超过可用余额  Excess of available balance
          return this.$t('InsufficientAccountBalance')
        }
        // if(Number(this.available)<min_amount){
        //   // 账户余额不足  Insufficient account balance
        //  return this.$t('minAmountNeed')+ Number(min_amount)+this.currency
        // }
        if(Number(this.available)<min_amount || Number(this.assetsNum)<min_amount){
          // 低于单笔最小限额：xxx （跨链代币名）
         return this.$t('MinimumAmount')+ min_amount+this.currency
        }
        if(Number(this.assetsNum)>max_amount){
          //  超过单笔最大限额：xxx （跨链代币名）
         return this.$t('CrossChainTransfer')+max_amount+this.currency
        }
        // console.log(this.ChildItemAssets.daily_limit)
        //    console.log(this.used_num)
        // console.log(Number(this.ChildItemAssets.daily_limit)-Number(this.used_num))
        if(Number(this.assetsNum)>(Number(this.ChildItemAssets.daily_limit)-Number(this.used_num))){
          //  超过当天可用限额：xxx （跨链代币名）
         return this.$t('AvailableAmount')+ (Number(this.ChildItemAssets.daily_limit)-Number(this.used_num))+this.currency
        }
        return ''
    }
  },

  methods: {
  //  链接钱包
   ConnectWallet(){
    isConnectMetaMask()
   },
    async handleApprove() {
      const Approvemsg = `Approve ${this.itemAssets.token_symbol}`;
      const contractAddr = this.crossAddress
      const overalltip = this.$overalltip({
        type: "loading",
        msg: Approvemsg,
      });
      const tokenAddress = `0x${this.itemAssets.address}`
      approveErc20Token(tokenAddress, this.account, contractAddr).then((res) => {
        try {
          overalltip.close();
          setLocalAllowance(tokenAddress, this.account, contractAddr)
          const msg = `${Approvemsg} Success`;
          actionTip = this.$overalltip({
            type: "success",
            msg,
          });
          this.$store.dispatch("crossChain/getTokenAllowance", tokenAddress);
        } catch (error) {
          console.log(error)
        }
      }).catch((err) => {
        console.log('approveErc20Token:', err)
        overalltip.close();
        const msg = `${Approvemsg} Error`;
        actionTip = this.$overalltip({
          type: "error",
          msg,
        });
      });
    },
    setMax() {
      this.assetsNum = this.balance;
    },
    nextLine() {
      
      if(!isAddress(this.assetsAddress)){
            this.addressShowInfo=true
            return
      }
      if (!this.show_or_next) return;
      this.$emit("set-next-data", {
        startChain: this.itemAssets.chain_symbol,
        endChain: this.ChildItemAssets.chain_symbol,
        moneyAssets: this.assetsNum, // `1100
        address: this.assetsAddress,
        moneyPractical: (
          Number(this.assetsNum) - Number(this.ChildItemAssets.fee_token)
        ).toFixed(4),
        USDT_money: this.ChildItemAssets.fee_usdt, // 手续费(USDT)
        Token_money: this.ChildItemAssets.fee_token, // 手续费(Token)
        currency: this.currency,
        fromChainid: this.itemAssets.chain_id,
        toChainId: this.ChildItemAssets.chain_id,
        src_token: this.ChildItemAssets.src_token,
        poly_chain_id: this.ChildItemAssets.poly_chain_id
      });
      this.$emit("on-next", 2);
    },
    getImg(item) {
      return item.address ? this.getUrl(item.address) : "";
    },
    getUrl(url) {
      return  this.globalGetImgUrl(url); 
     //  return `https://mdex.com/token-icons/heco/0x${url.toLocaleLowerCase()}.png`;
    },
    setItem(data) {
     
      console.log('data',data);
      // console.log(JSON.stringify(data))
      // console.log('data.daily_amount',data.daily_amount)
      // console.log('setItem data:', data)
      this.isIswap=data.bridge_type==1?false:true
      this.$store.commit('crossChain/changeIswap',data.bridge_type==1?false:true)
      this.ChildItemAssets = {}
      this.childAssetslist = data.chains;
      this.itemAssets = data;
      this.currency = data.token_symbol;
      if(data.chains.length >0){
        this.ChildItemAssets = data.chains[0]
      }
      this.balance = data.balance
      this.available=Number(data.balance)
     //  this.available=8
     // console.log(JSON.stringify( this.childAssetslist))
    },
    setChildItem(da) {
      
      console.log('da',da); 
      // console.log(JSON.stringify( da.chains))
      // console.log('setChildItem', da)
      // if(da.chain_id == 56) return
      this.ChildItemAssets = da;
      this.chainImg = this.getUrl(da.dst_token);
      this.used_num=da.daily_amount
      // this.used_num=5
    },
    showSeleteAssets() {
      this.$refs.assets.show();
    },
    showChildSeleteAssets() {
      if (this.$refs.toAssets.showAssets) {
        this.$refs.toAssets.hide();
      } else {
        this.$refs.toAssets.show();
      }
    },
  },
  beforeDestroy() {
    if (actionTip) {
      actionTip.close();
    }
  },
};
</script>

<style scoped lang="less">
.tips{
  font-size: 12px;
  margin-top: 5px;
  color:red;
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

section {
  // min-height: 550px;
  padding-top:10px;
  background-color: white;
}
.text-tip {
  margin-top: -12px;
  margin-bottom: 5px;
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

.addr-verify{
  margin-top:-10px;
  margin-bottom:15px;
  font-size: 14px;
  color: red;
}

input {
  font-size: 12px;
}
.selete-name {
  line-height: 20px;
  font-size: 12px;
  font-weight: 550;
  color: #181f36;
}
.tip-let {
  color: #cf1414;
}

.selete-title {
  height: 50px;
  background: #f1f3f7;
  border-radius: 8px;
  margin-top: 10px;
  padding: 0 13px;
  cursor: pointer;
  .selete-text {
    margin-left: 5px;
    font-size: 16px;
    color: #181f36;
  }
}
.bet-icon {
  height: 20px;
  width: 20px;
  border-radius: 50%;
}
.selete-img {
  height: 12px;
  width: 7px;
}
/*   跨链选择 */
.bet-item {
  margin-top: 10px;
  margin-bottom: 18px;

  .bet-info {
    width: 100%;
    position: relative;
    .bet-hide {
      position: absolute;
      background: #ffffff;
      box-shadow: 0px 5px 15px 0px rgba(15, 21, 77, 0.1);
      border-radius: 10px;
      top: 80px;
      left: -60px;
    }
    .bet-selete {
      height: 60px;
      background: #ffffff;
      box-shadow: 0px 5px 15px 0px rgba(15, 21, 77, 0.08);
      border-radius: 9px;
      padding: 0 10px;
      font-size: 16px;
      color: #181f36;
      cursor: pointer;
    }

    .bet-text {
      height: 20px;
      font-size: 13px;
      font-weight: 600;
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
/*   输入地址 */
.address {
  position: relative;
  height: 50px;
  background: #f1f3f7;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 18px;
  
  input {
    width: 100%;
    height: 50px;
    padding: 0px 12px;
    background: #f1f3f7;
    border-radius: 8px;
  }
  i{
    position: absolute;
    top: 18px;
    right: 10px;
  }
  input::input-placeholder {
    color: #9ba5b8;

    font-size: 12px;
  }
}
/*  输入资产   */
.assets-item {
  height: 50px;
  background: #f1f3f7;
  border-radius: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
  .assets-input {
    padding-left: 13px;
    //  width: 60%;
    width: 100%;
    input {
      width: 100%;
      height: 50px;
      background: #f1f3f7;
      margin-left: 12px;
      font-size: 14px;
    }
  }
  input::input-placeholder {
    color: #9ba5b8;
    font-size: 12px;
  }
  .assets-info {
    padding-right: 13px;
  }
  .assets-type {
    display: inline-block;
    line-height: 20px;
    font-size: 16px;
    color: #181f36;
  }
  .assets-max {
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
    min-width: 46px;
    // max-width: 60px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    // background: #03ad90;
    // color: white;
    box-shadow: 0px 2px 4px 0px rgba(75, 255, 239, 0.2);
    border-radius: 4px;
    font-size: 12px;
  }
}

/*  可用   */
.available {
  height: 17px;
  font-size: 12px;
  font-weight: 550;
  color: #626e88;
  line-height: 17px;
}

.no-button {
  color: #7f88a1;
  background: #dde2eb;
}
.link-button {
  margin-top: 18px;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  font-size: 18px;
  // box-shadow: 0px 9px 10px 0px rgba(1, 207, 170, 0.2);
}

.quota-name {
  margin-top: 5px;
  padding-top: 5px;
  height: 20px;
  font-size: 12px;
  cursor: pointer;
  img {
    width: 12px;
    height: 12px;
  }
}
.quota {
  // margin-top: 5px;
  display: flex;
  justify-content: flex-end;
  height: 20px;
  font-size: 12px;
  .quota-text {
    display: inline-block;
    margin-left: 2px;
    font-weight: 400;
    color: #181f36;
  }
  .quota-zj {
    font-weight: 600;
  }
}
.quota-line {
  margin: 0 4px;
  width: 100%;
  height: 7px;
  background: #e9edf3;
  border-radius: 7px;
  span {
    display: inline-block;
    height: 7px;
    border-radius: 7px;
    // background: #03ad90;
  }
}

.record {
  display: flex;
  justify-content: center;
  align-content: center;
  height: 20px;
  padding-top:15px;
  line-height: 22px;
  font-size: 14px;
  font-weight: 500;
  color: #03ad90;
  text-decoration: underline;
   cursor: pointer;
}

//     min-height: 535px;

.Heco {
  .action-button {
    color: white;
    background: #03ad90;
  }
  .assets-max {
    background: #03ad90;
    color: white;
  }
  .quota-line {
    span {
      background: #03ad90;
    }
  }
  .link-button {
    box-shadow: 0px 9px 10px 0px rgba(1, 207, 170, 0.2);
  }
}
.Bsc {
  .action-button {
    color: #ffca13;
    background: #2e2e2e;
  }
  .assets-max {
    color: #2e2e2e;
    background: #ffca13;
  }
  .quota-line {
    span {
      background: #ffca13;
    }
  }
}
.ETH {
}

@media screen and (max-width: 700px) {
  .pc-section {
    background-color: white;
  }
  .assets-input {
    input {
      margin-left: 2px;
    }
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
  .assets-input {
    input {
      width: 210px;
    }
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>