<template>
  <section class="wind—mining" :class="getLanguage">
    <title-banner> </title-banner>
    <!--  -->
    <div class="wind-mining__content text">
      <!-- 以下是重构的标签  @onchenck="" 是否已质押 nextPapg=$event-->
      <link-form v-show="nextPapg==1" @on-next="changeNext" @set-next-data="setNextAssets" @on-show-info="showInfo">
      </link-form>
      <authorization v-show="nextPapg==2" @on-next="changeNext" :assets="nextAssets" @on-show-info="showInfo">
      </authorization>
      <chain-history v-show="nextPapg==3" @on-details="goDetails" @back="onBack(2)"> </chain-history>
      <chain-details v-show="nextPapg==4" :list="detailsList" :address="inputAddress" @back="onBack(4)" @next-back="onBack(2)" @on-show-info="showInfo"> </chain-details>
      <div class="showinfo" v-show="showinfo">
        <div class="msg">
          <!--  FeeDescription: "手续费说明",
  FeeDescriptionInfo: -->
          <img class="close-icon" @click="hide" src="@/assets/close-icon.png" />
             <p class="title text Heavy" v-show="nextPapg==1">{{$t('DailyCrossChainLimitDescription')}}：</p>
             <p class="title text Heavy" v-show="nextPapg==2">{{$t('FeeDescription')}}</p>
             <p class="text" v-show="nextPapg==1">{{$t('DailyCrossChainInfo')}}</p>
             <p class="text" v-show="nextPapg==2">{{$t('FeeDescriptionInfo')}}</p>
          <div class="text" v-show="nextPapg==4"> <span>{{showinfoText}}</span></div>
        </div>
      </div>

    </div>
    <div class="Powered textEn">
       <span v-if="iswap">此次跨链将由iswap.com提供</span>
       <span v-else>Powered By Poly.Network</span>
      
    </div>

  </section>
</template>
  
  <script>


import authorization from "@/views/CrossChain/components/authorization.vue";
import linkForm from "@/views/CrossChain/components/link.vue";
import TitleBanner from "@/components/TitleBanner/TitleBanner";
import ChainHistory from "@/views/CrossChain/components/chainHistory.vue";
import ChainDetails from "@/views/CrossChain/components/chainDetails.vue";

export default {
  name: "cross-chain",
  components: {
    "link-form": linkForm,
    authorization,
    TitleBanner,
    ChainHistory,
    ChainDetails,
  },
  data() {
    return {
      nextPapg: 1,
      nextAssets: {},
      detailsList: [],
      showinfo: false,
      showinfoText:'',
      inputAddress:''
    };
  },
  created() {
  },
  async mounted() {},
  filters: {},
  watch: {
    list: {
      immediate: true,
      handler(v) {},
    },
   chainId(){
      window.document.title = 'MDEX Bridge'
     this.$store.dispatch("crossChain/getAssetslist");
   }
  },

  computed: {
    isPC() {
      return this.$store.getters.isPC;
    },
     chainId() {
      return this.$store.getters.chainId;
    },
    iswap() {
      return this.$store.state.crossChain.isIswap;
    },
    },
  //
  beforeCreate() {
    window.document.title = 'MDEX Bridge'
    this.$store.dispatch("crossChain/getAssetslist");
  },
  methods: {
    hide() {
      this.showinfo = false;
    },
    showInfo(text) {
      console.log('showInfo')
      this.showinfo = true;
      this.showinfoText=text
    },
    changeNext(e) {
      console.log(e);
      this.nextPapg = e;
      if(e == 3) {
        this.$store.dispatch("crossChain/getchainHistory");
      }
    },
    setNextAssets(item) {
      this.nextAssets = item;
    },
    goDetails(item) {
      this.nextPapg = 4;
      this.detailsList = item.cross_status;
      // 传地址
      this.inputAddress='0x'+item.dst_user
      
    },
    onBack(i) {
      console.log(i);
      this.nextPapg = i - 1;
    },
  },
  beforeDestroy() {
    window.document.title = 'MDEX.COM'
  },
  //
};
</script>
  <style lang="less" scoped>
@media screen and (max-width: 700px) {
  .wind—mining {
      min-height: 800px;
      max-height: 1000px;

   }
}
@media screen and (min-width: 700px) {
  .wind—mining {
      min-height: 1100px;
      max-height: 1500px;

   }
}
/*  */ /*  */ /*以下旧样式 */ /*  */ /*  */

.wind—mining {
 
  background: #f6f7fb;
  padding-bottom: 60px;
  position: relative;
}
.showinfo {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  .msg {
    width: 80%;
    min-height: 150px;
    background: #ffffff;
    border-radius: 10px;
    position: relative;
    padding: 15px;
    padding-top: 40px;
    .title {
      font-size: 14px;
      color: #000000;
      line-height: 40px;
    }
    .text {
      margin-top:5px;
      font-size: 14px;
      color: #808193;
      word-break: break-all;
    }
  }
}
.Powered {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #8d96af;
}
.close-icon {
  position: absolute;
  right: 18px;
  top: 18px;
  width: 18px;
  cursor: pointer;
}
@media screen and (min-width: 700px) {
  .wind-mining__content {
     width: 415px;
    // background: #fff;
    //     width: 415px;
    border-radius: 10px;
    margin: 0 auto;
    position: relative;
    display: flex;
    justify-content: center;
  }
  .showinfo {
    position: absolute;
    top: -100px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
}

@media screen and (max-width: 700px) {
  .new-title-withd {
    display: flex;
    justify-content: flex-end;
  }
  .wind-mining__content {
    width: 92%;
    margin-left: 4%;
    margin-top: -135px;
    // min-height: 550px;
    background: #ffffff;
    box-shadow: 0px 20px 30px 0px rgba(81, 85, 121, 0.03);
    border-radius: 10px;
    padding: 13px;
    padding-bottom: 20px;
  }
  .showinfo {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
  }
}
</style>
