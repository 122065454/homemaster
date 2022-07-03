import coinConfig from "@/utils/address.config.js"
import { _collectLink, tokenIconsDomain } from "@/utils/urlMethod"

export const global={
    data(){
      return{}
    },
    computed: {
      // 钱包地址
      account() {
        return this.$store.state.boardRoom.account
      },
      // 路由地址
      routerName() {
        return this.$store.state.routerName
      },
      // 链名称'Heco','Bsc'
      chainName() {
        return this.$store.state.chainName
      },
      // pc端判断
      isPC() {
        return this.$store.getters.isPC
      },
      // 移动端判断
      isMobile() {
        return this.$store.getters.isMobile
      },
      // 链id
      chainId() {
        return this.$store.state.chainId
      },
      // 语言标识
      getLanguage() {
        return this.$store?.state.language
      },
      // 获取url列表
      getUrlList () {
        return _collectLink(this.getLanguage, this.chainName, this.isMobile)
      },
      globalGetImgUrl(){
        return (addr, islp=true)=>{
          if(addr) return `${tokenIconsDomain}/token-icons/${this.chainName.toLocaleLowerCase()}/${islp ? 'lp/' : ''}${addr.toLocaleLowerCase()}.png`;
          return ''
        }
      },
      globalGetTokenConfig() {
        return (list) => {
          let token0, token1;
          if (list.token0 == undefined || list.token1 == undefined) {
            token0 = coinConfig[this.$store.state.chainId].token0;
            token1 = list.lpAddress?list.lpAddress:list.address;
          } else {
            token0 = list.token0;
            token1 = list.token1;
          }
          return `${this.getUrlList['Swap']}&inputCurrency=${token0}&outputCurrency=${token1}`;
        };
      },
      globalLanguage(){
        return `lang=${this.$store.state.language}`;
      },
      getGlobalAcrossUrl(){
        return (url)=>{
               if(url==''||!url) return ''
               const name = this.chainName
               return  `${tokenIconsDomain}/token-icons/${name.toLocaleLowerCase()}/0x${url.toLocaleLowerCase()}.png`;
        }
      }
    }
}