<template>
  <div id="app" :class="routerName == '/' && 'clearH'" v-if="showStatus">
    <AHeader></AHeader>
    <tipsCare class="tips" v-if="routerName == '/'&&isPC"></tipsCare>
    <transition>
      <router-view class="router-view" />
    </transition>
    <AFooter></AFooter>
  </div>
  <Loading v-else />
</template>
<script>
import AHeader from "@/components/Header/Header"
import AFooter from "@/components/Footer/Footer"
import Loading from "@/components/Loading/Loading"
import tipsCare from "@/components/tips/tips"
import { langSignList } from '@/utils/comStatic'
export default {
  data: () => ({
    direction: "slide-right",
    showStatus: false
  }),
  components: {
    AHeader,
    AFooter,
    Loading,
    tipsCare
  },
  watch: {
    $route(to, from) {
      // 监控路由的变化 banner的变化
      console.log('sd',this.$route);
      this.$store.commit("setRouterName", to.path);
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      if (to.path == "/") {
        this.direction = "slide-right";
      } else if (from.path == "/") {
        this.direction = "slide-left";
      } else {
        this.direction = toDepth < fromDepth ? "slide-right" : "slide-left";
      }
      if (this.isMobile) document.body.style.backgroundColor = (to.path === "/" ? '#000' : '#f6f7fb')
    },
    chainId() {
      this.$store.dispatch("initData")
      this.$store.dispatch("getBannerData")
      if (this.$route.path.includes("boardroom")) this.$store.dispatch("buyBack/getCombustionData")
    },
  },
  async beforeCreate() {
    setTimeout(() => {this.showStatus = true}, 1000)
    const { ethereum } = window
    if (ethereum) {
      // 改变链时候触发
      ethereum.on("chainChanged", chainId => {
        sessionStorage.removeItem('MdexData')
        this.setChainId(chainId)
        this.$store.commit("boardRoom/changeBoardRoomRewardStatus", true)
      });
      // 用户钱包地址变更的时候触发
      ethereum.on('accountsChanged', accounts => {
        let val = ''
        if(accounts.length) val = accounts[0]
        this.$store.commit("boardRoom/changeAccount", val)
        this.$store.dispatch("initData")
        this.$store.commit("boardRoom/changeBoardRoomRewardStatus", true)
      })
      // 链接钱包的时候触发
      ethereum.on('connect', connectInfo => {
        sessionStorage.removeItem('MdexData')
        this.setChainId(connectInfo.chainId)
      })
      // 保存用户钱包地址
      this.$store.dispatch("onConnect")
    }
    // h5初始化展示底部导航，防止用户在董事会锁仓质押时候直接关闭弹框导致底部导航不展示
    this.$store.commit("setH5FootSatus", true)
  },
  async mounted() {
    this.$store.commit("setRouterName", this.$route.path)
    const getKey=(key)=> {
      const query = window.location.href.split("?");
      if(query.length==1)  return false;
      const arr = query[1].split("&");
      for (let i = 0; i < arr.length; i++) {
        const url = arr[i].split("=");
        if (url[0] == key) {
          return url[1];
        }
      }
      return false;
    }
    try {
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_chainId' }).then(chainId => {
          if (chainId) {
            this.setChainId(chainId)
          } else {
            const chainId = getKey("chainId")
            if(chainId) {
              this.setChainId(chainId)
            }
          }
          this.$store.dispatch("getBannerData", chainId)
          this.$store.dispatch("initData")
        })
      } else {
        this.$store.dispatch("getBannerData")
        this.$store.dispatch("initData")
      }
    } catch (error) {}
    
    const lang = getKey("lang")
    if(lang){
       let lan = langSignList.includes(lang) ? lang : 'en'
       // 临时代码
       if(lang == 'zh-CN') lan = 'zh-HK'
       this.$store.commit("setLanguage", lan);
       this.$i18n.locale = lan;
    }
  },
  methods: {
    setChainId(chainId) {
      switch (chainId) {
        case "0x1": // heco
          this.$store.commit("setChainId", 1);
          break;
        case "0x80": // heco
          this.$store.commit("setChainId", 128);
          break;
        case "0x38": // bsc
          this.$store.commit("setChainId", 56);
          break;
      }
    }
  },
  beforeDestroy() {
    this.$store.commit("setChainId", 128);
  }
};
</script>
<style lang="less">
.tips{
  position: absolute;
  top: 72px;
  z-index: 99;
}
// h5
@media screen and (max-width: 450px) {
  #app {
    padding-bottom: 83px;
    padding-top: 44px;
    // padding-bottom: 335px;
  }
  .clearH {
    padding-top: 0 !important;
  }
}
  .halving {
    width: 150px;
    font-size: 12px;
    color: #fff;
    padding: 12px;
    line-height: 20px;
    text-align: justify;
  } 
.class-el{
  border-radius: 15px;
}
.tipCase{
  border-radius: 24px
}

.el-button{
  padding: 0;
}
.h5dialog {
  min-width: 10px !important;
}


// @media screen and (min-width: 450px) {
//   .router-view{
//     padding-bottom: 200px;
   
//   }
// }
// 
//   PingFangSC-Medium, PingFang SC;
body {
  background-color: #f6f7fb;
}

</style>
