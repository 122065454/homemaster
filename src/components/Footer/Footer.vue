<template>
  <footer class="footer" :class="[chainName, getLanguage]" v-show="getH5FootSatus">
    <div v-if="isPC" class="footer-pc text">
      <div class="foot-text-img">
        <p>
          <a href>
            <img src="@/assets/foot/HMDX.png" />
          </a>
        </p>
        <!-- PC联系方式列表 -->
        <p>
          <a target="_blank" v-for="(arr, i) in getContactList" :href="getUrlList[arr['url']]" :key="`f_getContactList${i}`">
            <img :src="arr['pic']" class="foot-img" />
          </a>
        </p>
        <p>©2021 Mdex.com.All rights reserved</p>
      </div>
      <!-- PC底部导航列表 -->
      <div class="foot-text-info">
        <div v-for="(item, ind) in getFooterList" class="text-link" :key="`getFooterList${ind}`">
          <p>{{ $t(ind) }}</p>
          <p v-for="(val, key) in item" :key="`c_getFooterList${key}`">
            <span v-if="['Ecological', 'ContactUS'].includes(key)">{{ key !== 'ContactUS' ? $t(key) : `${$t(key)}: business@mdex.com` }}</span>
            <span v-else-if="['Pool', 'Boardroom', 'TradePool', 'Vulnerability'].includes(key)" @click="internalJumpHandle(getUrlList[val])">{{ $t(key) }}</span>
            <a :href="getUrlList[val]" target="_blank" v-else>{{ key !== 'FAQ' ? $t(key) : 'FAQ' }}</a>
          </p>
        </div>
      </div>
    </div>
    <!-- h5底部导航列表 -->
    <nav class="footer-nav text" v-if="isMobile">
      <div class="footer__nav-item" v-for="(arr, i) in getNavList" :key="`f_getNavList${i}`">
        <div @click="internalJumpHandle(getUrlList[arr['url']])" v-if="arr['isInternal']">
          <span :class="['footer__nav-item-icon', arr['default'], matchingRoute(getUrlList[arr['url']]) && arr['addClass']]"></span>
          <span :class="['footer__nav-item-text', matchingRoute(getUrlList[arr['url']]) && 'router-active']">{{ $t(arr['name']) }}</span>
        </div>
         <a :href="getUrlList[arr['url']]" v-else>
          <span :class="['footer__nav-item-icon', arr['default']]"></span>
          <span class="footer__nav-item-text">{{ $t(arr['name']) }}</span>
          <img :src="chainName == 'Heco' ? hecoBeta : bscBeta" alt='' v-if="arr['name'] == 'Quotes'" />
        </a>
      </div>
    </nav>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      hecoBeta: require('@/assets/heco_beta.png'),
      bscBeta: require('@/assets/bsc_beta.png')
    }
  },
  mounted() {},
  computed: {
    // h5底部导航展示状态
    getH5FootSatus() {
      if (this.isPC) {
        return true
      } else {
        return this.$store.state.h5FootSatus
      }
    },
    // PC联系方式列表
    getContactList() {
      return [
        {name: 'Github', pic: this.getContactPic('Github'), url: 'Github'},
        {name: 'Medium', pic: this.getContactPic('Medium'), url: 'Medium'},
        {name: 'Telegram', pic: this.getContactPic('Telegram'), url: 'Telegram'},
        {name: 'Twitter', pic: this.getContactPic('Twitter'), url: 'Twitter'},
        {name: 'Discord', pic: this.getContactPic('Discord'), url: 'Discord'},
        {name: 'Weibo', pic: this.getContactPic('Weibo'), url: 'Weibo'}
      ]
    },
    // H5底部导航列表 isInternal: 是否为内部链接跳转
    getNavList() {
      return [
        {name: 'Home', url: 'Home', isInternal: true, default: 'home'},
        {name: 'Swap', url: 'Swap', isInternal: false, default: 'exchange'},
        {name: 'miningPool', url: 'Farm', isInternal: true, default: 'farm', addClass: 'farm-active'},
        {name: 'Quotes', url: 'NewChart', isInternal: false, default: 'chart'},
        {name: 'Directors', url: 'Boardroom', isInternal: true ,default: 'boardroom', addClass: 'boardroom-active'},
        // {name: 'IMO', url: 'IMO', isInternal: false, default: 'imo'},
      ]
    },
    // PC底部导航列表
    getFooterList() {
      return {
        Application: {
          // ListYourToken: 'ACText1',
          ClaimYourLiquidity: 'ACText2',
          IMOApplication: 'ACText3',
          MDEXApplication: 'Fund',
          InvitePlan: 'InvitePlan',
          MangelApplication: 'MangelApplication'
        },
        Guide: {
          Swap: 'Swap',
          capitalPool: 'Pool',
          guideinfo: 'Chart',
          Pool: 'Farm', 
          Boardroom: 'Boardroom', 
          TradePool: 'Trade',
          NftMarket: 'OpenMeta'
        },
        Doc: {
          FAQ: 'Faq',
          guidance: 'Guidance',
        },
        About: {
          Announcement: 'Notice',
          AdjustmentofPool: 'ABText2',
          Ecological: '',
          Vulnerability: 'Vulnerability',
          ContactUS2: 'ContactUS2'
        }
      }
    },
  },
  methods: {
    // 获取H5联系方式列表图标
    getContactPic (val) {
      return require(`@/assets/foot/${val}.png`)
    },
    // 匹配路由
    matchingRoute(val) {
      const adr = this.$route.path
      const to = val.split('?')[0]
      if (to !== '/' && adr.includes('/pool')) return adr.includes([`/pool${to}`])
      if (to == '/liquidity') return ['/liquidity', '/trading'].includes(adr)
      return adr === to
    },
    // 内部跳转
    internalJumpHandle(url) {
      this.$router.push({path: url})
    }
  }
}
</script>
<style scoped lang="less">
@import "./Footer.less";
</style>
