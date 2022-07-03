<template>
  <section class="selete-assets center " v-show="showAssets" :class="showType==1?'assets-main':'aaa'">
    <div class="assets-body" :class="showType==1?'assets-body-1':'assets-body-2'">
      <div class="top_head">
       <img class="close-icon" @click="hide" src="@/assets/close-icon.png" />
       <p class="assets-title text Bold" v-if="showType==1">{{$t('ChooseTheCrossChainBridgeAsset')}}</p>
      </div>
      <div class="content">
        <div class="list between numbers Medium" v-for="(da) in dataList" :key="da.token_symbol" @click="getItem(da)" >
        <div class="start">
          <img v-if="showType==1" :src="getGlobalAcrossUrl(da.address) " class="bet-icon" alt="">
          <show-img v-if="showType!=1" :name="da[name]" />
          <span>  {{showType==1?chainName=="Bsc"&&da[name]=='MDX'?'HMDX':da[name]:da[name]}}</span>
        </div>
        <div v-if="showType==1">
          <!-- <span>{{Number(da.max_amount).toFixed(2)}}</span> -->
          <span>{{  getformatFloat(da.balance)}}</span>
          <span class="span-img"><img v-show="showAction[name]==da[name]" src="@/assets/selete-icon.png" alt=""></span>
        </div>
        <div v-if="showType!=1&&showAction[name]==da[name]"> <img src="@/assets/selete-icon.png" alt=""></div>
      </div>
      </div>
 
    </div>

  </section>
</template>

<script>
import { formatFloat } from "@/utils/formatBalance";
import showImg from "@/views/CrossChain/components/showImg.vue";
export default {
  name: "selete-assets",
  data() {
    return {
      showAssets: false,
      maxAssets: "",
    };
  },
  components: {
    showImg
  },
  props: {
    dataList: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: "name",
    },
    showType: {
      type: Number | String,
      default: 0,
    },
    showId: {
      type: Number | String,
      default: "",
    },
    showLine: {
      type: Boolean,
      default: false,
    },
    showAction: {
      type: Object,
      default: "",
    },
  },
  computed: {
      getformatFloat() {
      return (t)=>{
       return formatFloat(t,6)
      };
    },
  },

  methods: {
    getImg(item) {
      return item.address ? this.getUrl(item.address) : "";
    },
    getChainImg(item) {
      return item.dst_token ? this.getUrl(item.dst_token) : "";
    },
    getUrl(url) {
       return  this.globalGetImgUrl(url); 
     // return `https://mdex.com/token-icons/heco/0x${url.toLocaleLowerCase()}.png`;
    },
    getItem(item) {
     
      // if (this.showLine && this.showId !== item.token_id) {
      //   return;
      // }
      this.$emit("change-item", item)
      this.hide();
    },
    hide() {
      this.showAssets = false;
    },
    show() {
      this.showAssets = true;
    },
  },
};
</script>

<style scoped lang="less">
// .top_head{
//   position: fixed;
//   top: 0;
//   left: 0;
// }
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

.around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.selete-assets {
  border-radius: 10px;
}
.span-img{
  display: inline-block;
  width: 30px;
  text-align: right;
  img {
        margin-right: 0px;
  }
}

.assets-main {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.4);
}
.selete-assets {
  z-index: 9999;
  .assets-body {
    background: #ffffff;
    border-radius: 10px;
    background-color: white;
    position: relative;
    padding: 37px 13px 13px 13px;
    z-index: 1;
    .assets-title {
      line-height: 39px;
      font-size: 14px;
      font-weight: 500;
      color: #181f36;
      text-align: center;
    }
    .close-icon {
      position: absolute;
      right: 18px;
      top: 18px;
      width: 18px;
      cursor: pointer;
    }
    .list-hide {
      color: rgb(199, 199, 199);
    }
    .list {
      margin-bottom: 10px;
      height: 44px;
      // background: #f1f3f7;
      border-bottom: 1px solid rgb(230, 230, 230);
      // border-radius: 8px;
      padding: 0px 13px;
      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
       .img {
        margin-right: 13px;
      }
    }
  }
}

.list:hover {
  background: #f6f7fb;
  border-radius: 18px;
}
@media screen and (max-width: 700px) {
  .assets-body-1 {
    height: 300px;
    width: 80%;
    // overflow: auto;
    ;
  }
  .content{
     height: 200px;
     overflow: auto;
  }
//  .selete-assets  .assets-body{
//      padding: 10px 13px 13px 13px;
//   }
  .assets-body-2 {
    width: 200px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    font-size: 12px;
  }
}

@media screen and (min-width: 700px) {
  .assets-body-1 {
    min-height: 400px;
    max-height: 600px;
    width: 415px;
    overflow: auto;
  }
  .assets-body-2 {
    width: 240px;
    overflow: auto;
    font-size: 14px;
  }
}
.bet-icon{
  margin-right: 10px;
}
</style>