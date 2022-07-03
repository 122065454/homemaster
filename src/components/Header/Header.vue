<template>
  <header class="header" :class="[routerName =='/' ? `${chainName}-home` : chainName, getLanguage, navStatus && 'header_bg']">
    <div class="header-tip text" v-if="showSet">
      <div class="h-tip-body">
        <div class="close" @click="showSet = false">
          <img src="@/assets/modal-close.png" alt="" />
        </div>
        <div class="h-view-set">
          <!-- h5语言选择列表 -->
          <div class="selete-language">
            <div 
              :class="{'sele-info': true, middle: $i18n.locale !== arr['lang'], 'middle-select': $i18n.locale === arr['lang']}" 
              @click="changeLanguage(arr['lang'])" 
              v-for="(arr, i) in langList" 
              :key="`langList_h5${i}`">
              {{arr['name']}}
            </div>
          </div>
          <!-- h5联系方式列表 -->
          <div class="show-img-info textEn">
            <div  v-for="(arr, i) in getContactList" :key="`getContactList${i}`">
              <a :href="getUrlList[arr['url']]" target="_blank">
                <img :src="arr['pic']" alt="" />
                <span>{{arr['name']}}</span>
              </a>
            </div>
          </div>
          <!-- h5商务合作 -->
          <div class="aff-emai">
            <span> {{$t("BusinessCooperation")}}：business@mdex.com</span>
          </div>
        </div>
      </div>
    </div>
    <div class="header-left text">
      <div class="side-btn" v-if="!isPC" >
        <img class="side" :src="side" @click="setSildeShow" alt="" />
        <img class="hint" :src="hint" v-if="redHintStatus == 'show'" />
      </div>
      <div class="header-logo">
        <router-link to="/">
          <img src="@/assets/logo.png" v-if="onresizeIsPC" />
        </router-link>
      </div>
      <!-- pc导航条 -->
      <nav class="header-nav" v-if="isPC">
        <div v-for="(arr, i) in getNavList" :key="`getNavList${i}`">
          <span class="nav__list-item" :class="{'router-link-active': matchingRouteHandle(getUrlList[arr['url']])}" v-if="arr['isInternal']" @click="internalJumpHandle(getUrlList[arr['url']], i)">{{ $t(arr['text']) }} </span>
          <a :href="getUrlList[arr['url']]" class="nav__list-item" v-else>
            {{ arr['text'] == 'Dao' ? 'Dao' : $t(arr['text']) }} 
            <img :src="chainName == 'Heco' ? hecoBeta : bscBeta" alt='' v-if="arr['text'] == 'Quotes'"/>
          </a>
        </div>
      </nav>
    </div>
    <div class="header-configs">
      <!-- 燃烧销毁空投按钮 -->
      <!-- <div class="header__config-button" @click='handelClick' v-if="chainId == 56">
        {{$t('ClaimHead')}}
      </div>  -->
      <!-- <Select :value="chainId" class="header__config-chain" :color="isPC ?SelectColor[chainName] : 'white'" @change="changeChain"> -->
      <Select :value="chainId" class="header__config-chain" :color="isPC ? SelectColor[chainName] : 'white'"
        @change="changeChain" v-if="!['Lockup', 'BoardroomPool'].includes($route.name)">
        <Option v-for="(da,i) in chainList" :key="i" :value="Number(i)" :label="da.label"></Option>
      </Select> 
      <div class="header__config-button" v-if="isPC && !account" @click="handleWallet">
        {{ account ? "已连接" : $t("connect") }}
      </div>
      <!-- <div class="header__config-button" v-if="isMobile" @click="handleWallet">
        <img src="@/assets/wallet-icon.png" alt="" />
      </div> -->
      <div class="header__config-button" v-if="isMobile" @click="showSet = true">
        <img src="@/assets/setting-icon.png" alt="" />
      </div>
      <!-- PC头部下拉 -->
      <div class="lang_bar text" v-click-outside="closeMoreHandle" v-if="isPC">
        <div class="more_btn">
          <img class="btn" :src="more" alt="" @click="showMoreHandle"/>
          <img class="new" :src="hint" v-if="redHintStatus == 'show'" />
        </div>
        <div class="more" v-show="moreShow">
          <ul>
            <li v-for="(arr,i) in moreList" :key="`moreList${i}`">
              <a :href="getUrlList[arr['url']]" target="_blank">
                <img :src="arr['pic']" alt="" />
                <span>{{arr['text']}}</span>
              </a>
            </li>
            <li @click="showLangListHandle">
              <img :src="language" alt="" />
              <span>{{$t('SetLang')}}</span>
            </li>
            <li @click="hideRedDogHandle">
              <a :href="getUrlList['Invite']" target="_blank">
                <img :src="invite" alt="" />
                <span>{{$t('Invite')}}</span>
                <span class="circle" v-if="redHintStatus == 'show'"></span>
              </a>
            </li>
          </ul>
        </div>
        <!-- 多语言切换列表 -->
        <div class="more" v-show="!moreShow && langShow">
          <ul>
            <li class="lang_item" @click="backHandle"><i class="el-icon-arrow-left"></i></li>
            <li class="lang_item" v-for="(arr,i) in langList" :key="`langList_pc${i}`" @click="changeLanguage(arr['lang'])">
              <span>{{arr['name']}}</span>
              <i class="el-icon-check" v-if="getLanguage === arr['lang']"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 燃烧销毁空头领取弹框 -->
    <!-- <H5alert ref='showAlert'></H5alert> -->
    <!-- H5Side -->
    <H5Side ref='H5Side'></H5Side>
  </header>
</template>

<script>
// import H5alert from '@/components/airdrop/h5alert'
import { _collectLink } from "@/utils/urlMethod"
import { isConnectMetaMask } from "@/utils/publicErc20"
import { chainInfoList } from "@/utils/comStatic"
import Select from "@/components/Select/Select"
import Option from "@/components/Select/Option"
import ClickOutside from "vue-click-outside"
import H5Side from "@/components/H5Side"
export default {
  name: "Header",
  directives: {
    ClickOutside
  },
  data() {
    return {
      language: require('@/assets/header/language.png'),
      news: require('@/assets/header/news.png'),
      info: require('@/assets/header/info.png'),
      more: require('@/assets/header/pc_more.png'),
      domain: require('@/assets/header/domain.svg'),
      hecoBeta: require('@/assets/heco_beta.png'),
      bscBeta: require('@/assets/bsc_beta.png'),
      invite: require('@/assets/header/invite.svg'),
      hint: require('@/assets/header/redHint.svg'),
      // 链信息列表
      chainList: chainInfoList,
      // 多语言列表
      langList: [
        {name : 'English', lang: 'en'},
        // {name : '简体中文', lang: 'zh-CN'},
        {name : '繁体中文', lang: 'zh-HK'},
        {name : '日本語', lang: 'jp'},
        {name : 'Türk', lang: 'tur'},
        {name : '한국어', lang: 'kr'},
        {name : 'Россия', lang: 'ru'},
        {name : 'Tiếng Việt', lang: 'vi'},
        {name : 'Português', lang: 'pt'},
        {name : 'Tagalog', lang: 'tl'},
        // {name : 'Nederland', lang: 'nl'},
        // {name : 'ภาษาไทย', lang: 'th'},
        {name : 'Español', lang: 'es'},             //西班牙语
        {name : 'Italiano', lang: 'it'},            //意大利语
        {name : 'Bahasa Indonesia', lang: 'ina'},   //印度尼西亚语
        {name : 'فارسی‎ = Fârsi', lang: 'fa'},       //波斯语
      ],
      onresizeIsPC: !navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i),
      SelectColor: { Heco: "green", Bsc: "yellow" },
      side: require('@/assets/header/side.png'),
      slideShow: false,
      showSet: false,
      moreShow: false,
      langShow: false,
      tabIndx: 0
    };
  },
  components: {
    Select,
    Option,
    H5Side,
    // H5alert
  },
  mounted() {
    this.$store.dispatch("crossChain/getAssetslist")
    sessionStorage.removeItem('MdexData')
    // 链接小狐狸
    isConnectMetaMask()
  },
  computed: {
    // 获取H5联系方式列表
    getContactList() {
      return [
        {name: 'Github', pic: this.getContactPic('Github'), url: 'Github'},
        {name: 'Medium', pic: this.getContactPic('Medium'), url: 'Medium'},
        {name: 'Telegram', pic: this.getContactPic('Telegram'), url: 'Telegram'},
        {name: 'Twitter', pic: this.getContactPic('Twitter'), url: 'Twitter'},
        {name: 'Discord', pic: this.getContactPic('Discord'), url: 'Discord'},
        {name: 'Weibo', pic: this.getContactPic('Weibo'), url: 'Weibo'},
      ]
    },
    // 获取PC导航条列表 isInternal: 是否为内部链接跳转
    getNavList() {
      return [
        {text: 'Home', url: 'Home', isInternal: true},
        {text: 'Swap', url: 'Swap', isInternal: false},
        {text: 'capitalPool', url: 'Pool', isInternal: false},
        {text: 'Pool', url: 'Farm', isInternal: true},
        {text: 'TradePool', url: 'Trade', isInternal: true},
        {text: 'Directors', url: 'Boardroom', isInternal: true},
        {text: 'crossChain', url: 'Bridge', isInternal: true},
        {text: 'Quotes', url: 'NewChart', isInternal: false},
        // {text: 'rshd', url: 'Buyback', isInternal: true},
        {text: 'DAO', url: 'Dao', isInternal: false},
        // {text: 'IMO', url: 'IMO', isInternal: false}
      ]
    },
    // 控制导航条显示底色
    navStatus() {
      return this.$store.state.navStatus;
    },
    // 获取PC更多下拉列表
    moreList() {
      return [
        {text: this.$i18n.t('Notice'), url: 'Notice', pic: this.news, isInternal: false},
        {text: 'Info', url: 'Chart', pic: this.info, isInternal: false},
        {text: this.$i18n.t('Domain'), url: 'Domain', pic: this.domain, isInternal: false}
      ]
    },
    // 小红点状态
    redHintStatus() {
      return this.$store.state.redHintStatus;
    }
  },
  methods: {
    // 内部跳转
    internalJumpHandle(url, ind) {
      this.tabIndx = ind
      this.$router.push({path: url})
    },
    // 获取H5联系方式列表图标
    getContactPic (val) {
      return require(`@/assets/${val}${this.chainName === 'Heco' ? '1' : '2'}.png`)
    },
    // 修改语言
    changeLanguage(lang) {
      this.$router.push({path: this.$route.path, query:{lang: lang}})
      this.$store.commit("setLanguage", lang)
      this.$i18n.locale = lang
    },
    // 手动连接钱包
    handleWallet() {
      window.ethereum.request({ method: 'eth_requestAccounts' })
    },
    // 切换链保存链id、链名称
    changeChain(chainId) {
      this.$store.commit("setChainId", chainId)
      this.$store.commit("setChainName", chainInfoList[chainId]['name'])
    },
    // 控制侧边栏显隐
    setSildeShow() {
      this.$refs.H5Side.status = true
    },
    // 弹出空投弹框
    handelClick(){
     this.$refs.showAlert.isShow=true
    },
    // 展示更多操作
    showMoreHandle() {
      if (this.langShow) {
        this.moreShow =  false
      } else {
        this.moreShow = !this.moreShow 
      }
      this.langShow = false
    },
    // 展示语言下拉列表
    showLangListHandle() {
      this.moreShow = false
      this.langShow = true
    },
    // 返回更多列表
    backHandle() {
      this.moreShow = true
      this.langShow = false
    },
    // 关闭更多操作
    closeMoreHandle() {
      this.moreShow = false
      this.langShow = false
    },
    // 隐藏小红点
    hideRedDogHandle() {
      if (this.redHintStatus == 'show')  this.$store.commit("setRedHint", 'hide')
    },
    // 匹配路由
    matchingRouteHandle(val) {
      const adr = this.$route.path
      const to = val.split('?')[0]
      if (to !== '/' && adr.includes('/pool')) return adr.includes([`/pool${to}`])
      return adr === to
    },
  }
};
</script>
<style lang="less" scoped>
@import "./Header.less";
</style>
