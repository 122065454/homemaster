<template>
  <aside class="popWrap text" :class="[getLanguage]" v-show="status" >
    <div :class="{pop:true, popShow: status}">
      <div class="header">
        <div class="item" v-for="item in headerList" :key="item.name" v-show="!(item['name'] == 'Invite' && chainName == 'Eth')">
          <div v-if="item.router" @click="internalJumpHandle(item.url)">
            <img :src="item.pic" alt="" />
            <p>{{item.name === 'Dao' ? 'DAO' : $t(item.name)}}</p>
          </div>
          <a v-else :href="item.url" target="_blank" rel="noreferrer" @click="() => hideRedDogHandle(item.name)">
            <img :src="item.pic" alt="" />
            <p>{{item.name === 'Dao' ? 'DAO' : $t(item.name)}}</p>
            <i v-if="item.name === 'Invite' && redHintStatus == 'show'"></i>
          </a>
        </div>
      </div>
      <div class="main">
        <div class="item" v-for="(item, i) in mainList" :key="item.name" v-show="!((item['name'] == 'Info'|| i == 2) && chainName == 'Eth' )" @click="() => jumpHandle(item.router, item.url)">
          <div class="ico">
            <img :src="item.pic" alt="" />
            <span>{{item.name}}</span>
          </div>
          <img class="arrow" :src="arrow" alt="" />
        </div>
      </div>
      <div class="main">
        <div class="item" v-for="item in mainList2" :key="item.name" @click="() => jumpHandle(item.router, item.url)">
          <div class="ico">
            <img :src="item.pic" alt="" />
            <span>{{item.name}}</span>
          </div>
          <img class="arrow" :src="arrow" alt="" />
        </div>
      </div>
    </div>
    <div class="blank" @click="closeHandle"></div>
  </aside>
</template>

<script>
import { _collectLink } from "@/utils/urlMethod"
export default {
  name: "H5Side",
  data() {
    return {
      notice: require('@/assets/h5Side/notice.svg'),
      plan: require('@/assets/h5Side/plan.svg'),
      repurchase: require('@/assets/h5Side/repurchase.png'), // --
      bridge: require('@/assets/h5Side/bridge.png'), // --
      faq: require('@/assets/h5Side/faq.svg'), 
      apply: require('@/assets/h5Side/apply.svg'), 
      fluidity: require('@/assets/h5Side/fluidity.svg'), 
      fund: require('@/assets/h5Side/fund.svg'), 
      vulnerability: require('@/assets/h5Side/vulnerability.svg'), 
      info: require('@/assets/h5Side/info.svg'),
      chart: require('@/assets/h5Side/chart.svg'),
      invite: require('@/assets/h5Side/invite.png'), // --
      arrow: require('@/assets/h5Side/go.png'), // --
      dao: require('@/assets/h5Side/dao.png'), // --
      imo: require('@/assets/h5Side/imo.png'), // -- 
      domain: require('@/assets/header/domain.svg'),
      status: false
    }
  },
  computed: {
    // 侧边栏列表
    headerList () {
      return [
        {name: 'Invite', url: this.getUrlList['Invite'],pic: this.invite, router: false},
        {name: 'crossChain', url: this.getUrlList['Bridge'],pic: this.bridge, router: true},
        // {name: 'Repurchase', url: this.getUrlList['Buyback'],pic: this.repurchase, router: true},
        {name: 'Dao', url: this.getUrlList['Dao'],pic: this.dao, router: false},
      ]
    },
    mainList () {
      return [
        {name: 'FAQ', url: this.getUrlList['Faq'],pic: this.faq, router: false},
        {name: 'Info', url: this.getUrlList['Chart'],pic: this.info, router: false},
        {name: this.$i18n.t('Quotes'), url: this.getUrlList['NewChart'],pic: this.chart, router: false},
        // {name: this.$i18n.t('ListYourToken'), url: this.getUrlList['ACText1'],pic: this.apply, router: false},
        {name: this.$i18n.t('Vulnerability'), url: this.getUrlList['Vulnerability'],pic: this.vulnerability, router: true},
        {name: this.$i18n.t('ClaimYourLiquidity'), url: this.getUrlList['ACText2'],pic: this.fluidity, router: false},
        {name: this.$i18n.t('InvitePlan'), url: this.getUrlList['InvitePlan'],pic: this.plan, router: false},
        {name: this.$i18n.t('MDEXApplication'), url: this.getUrlList['Fund'],pic: this.fund, router: false},
        // {name: this.$i18n.t("IMO"), url: this.getUrlList['IMO'],pic: this.imo, router: false},
        {name: this.$i18n.t("Notice"), url: this.getUrlList['Notice'],pic: this.notice, router: false},
      ]
    },
    mainList2 () {
      return [
        {name: this.$i18n.t('MdxDomain'), url: this.getUrlList['Domain'],pic: this.domain, router: false},
      ]
    },
    // 小红点状态
    redHintStatus() {
      return this.$store.state.redHintStatus;
    }
  },
  methods: {
    // 关闭弹框
    closeHandle() {
      this.status = !this.status
    },
    // 内部跳转
    internalJumpHandle(url) {
      this.$router.push({path: url})
    },
    // 隐藏小红点
    hideRedDogHandle(val) {
      if (val === 'Invite' && this.redHintStatus == 'show') this.$store.commit("setRedHint", 'hide')
    },
    // 跳转status:true-内部链接, false: 外部跳转
    jumpHandle(status, url) {
      if (status) {
        this.$router.push({path: url})
      } else {
        window.open(url)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.popWrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0,0,0,.4);
  z-index: 9999;
  .pop {
    position: fixed;
    transition-duration: 0.3s;
    top: 0;
    left: -300px;
    width: 325px;
    background: #F0F2F3;
    z-index: 9999;
    bottom: 0;
    padding: 16px;
    .header {
      display: flex;
      justify-content: space-around;
      width: 293px;
      background: #FFFFFF;
      border-radius: 10px;
      margin: 0 auto;
      padding: 15px 0;
      .item {
        position: relative;
        cursor: pointer;
        text-align: center;
        width: 85px;
        img {
          width: 36px;
          height: 36px;
        }
        p {
          margin-top: 10px;
          color: #000;
          font-size: 13px;
        }
        i {
          position: absolute;
          right: 24px;
          top: 0;
          display: block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #F6454F;
        }
      }
    }
    .main {
      width: 293px;
      background: #FFFFFF;
      border-radius: 10px;
      padding: 0 12px;
      margin-top: 16px;
      .item {
        display: flex;
        align-items: center;
        justify-content:space-between;
        height: 48px;
        .ico {
          display: flex;
          align-items: center;
          font-size: 13px;
          img {
            width: 24px;
            height: 24px;
            margin-right: 10px;
          }
        }
        .arrow {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
  .popShow {
    transform: translateX(300px);
    z-index  : 10000;
  }

  .popHideShow {
    transform: translateX(0);
    z-index  : 10000;
  }
  .blank {
    width: 64px;
    position: fixed;
    top: 0; 
    right: 0;
    bottom: 0;
    z-index: 9999;
  }
}
.ru {
  .pop {
    .item {
      a {
        font-size: 12px;
      }
    }
  }
}

@media screen and (max-width: 320px) {  
  .popWrap { 
    .pop {
      width: 300px;
      .header { 
        width: 270px;
      }
      .main {
        width: 270px;
      }
    }
  }
}

</style>