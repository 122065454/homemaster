import Vue from "vue";
import Vuex from "vuex-proxy";
import createPersistedState from "vuex-persistedstate";
import { fnGetCurrencyPrice, fnGetHomeData, fnGetAllChain, fnGetBannerData, getBlackList } from '@/api/index'
import { chainInfoList, transferChainList } from "@/utils/comStatic.js";
import { getAccount, getContract } from "@/utils/publicErc20";
import { fnGetBoardroomList } from '@/api/boardRoom'
import { _getImgKey } from "@/utils/comMethod.js";
import erc20Abi from "@/config/abi/erc20.json";
import address from "@/utils/address.config";
import crossChain from "./crossChain";
import boardRoom from "./boardRoom";
import liquidity from "./liquidity";
import buyBack from './buyBack';
import lockup from "./lockup";
import reward from "./reward";
let timer = null

Vue.use(Vuex);

export default Vuex.Store({
  modules: {
    // bnp,
    boardRoom,
    liquidity,
    reward,
    crossChain,
    buyBack,
    lockup,
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    overwrite: true,
    key: 'MdexData',
    // filter: mutation => {
    //   console.log('filter:', mutation)
    //   if(mutation.type == 'reward/initContract') {
    //     return false
    //   } 
    //   return true
    // },
    setState: (key, val) => {
      // val.reward.miningContract = null
      try {
        window.sessionStorage.setItem(key, JSON.stringify(val))
      } catch (error) {
      }
    }
  })],
  state: {
    routerName:"/", // 用于路由切换的 banner组件的显示切换
    CurrencyPrice:{},
    title: "Mdex",
    walletConnected: "",
    wallets: [
      {
        id: "injected",
        name: "Metamask",
        ico: require("../assets/metamask.png"),
      },
      {
        id: "walletconnect",
        name: "Wallet Connect",
        ico: require("../assets/wallet.png"),
      },
    ],
    txStatus: {
      pending: false,
      hash: "",
      text: "",
    },
    showLoding: false,
    // 语言
    language: localStorage.getItem("language") || "en",
    // 链 id  128:Heco
    chainId: 128,
    // 链名称Heco
    chainName: 'Heco',
    // 首页数据
    homeData: {},
    // 地址
    address,
    balance: null,
    wthPrice: 0,
    allChain: {},
    // 导航条状态 false：透明, true：黑底
    navStatus: false,
    // banner列表
    bannerData: [],
    // 克隆banner数据
    cloneBannerData: [],
    // h5底部展示状态
    h5FootSatus: true,
    blackData: {},
    // 小红点提示
    redHintStatus: localStorage.getItem("redHint") || 'show',
    // 董事会数据
    boardRoomData: [],
   
  },
  getters: {
    isPC() {
      return !navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
    },
    isMobile() {
      return !!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i);
    },
    chainId(state) {
      return state.chainId;
    },
    currentAddress(state) {
      return state.address[state.chainId]
    },
    isLogin(state) {
      return state.boardRoom.account
    },
  },
  actions: {
    // 获取用户钱包地址
    async onConnect({ commit, state }) {
      const account = await getAccount()
      let val = ''
      if (account.length) val = account[0]
      commit("boardRoom/changeAccount", val)
    },
    // 获取币的价格
    getCurrencyPrice({ commit, state }) {
      const chainId = state.chainId
      if(chainId != 1) {
        fnGetCurrencyPrice(chainId).then(res=>{
          if(res.data.code === 0 && res.data.result) {
            commit('setCurrencyPrice', res.data.result)
          }
        })
      }
    },
    initData({ dispatch }) {
      sessionStorage.removeItem('MdexData')
      clearInterval(timer);
      dispatch("getHomeData");
      dispatch("getCurrencyPrice");
      dispatch("liquidity/getApyList");
      dispatch("getBlackData");
      timer = setInterval(() => {
        dispatch("getHomeData");
        dispatch("getBlackData");
      }, 9000);
      dispatch("getBalance");
    },
    // 首页数据
    getHomeData({ dispatch, commit, state }) {
      const chainId = state.chainId
      fnGetHomeData(chainId == 1 ? 128 : chainId).then(res=>{
        if (res.data.code === 0 && res.data.result) {
          let data = res.data.result;
          data.mdex_tvl = Number(data.mdex_tvl);
          commit("changeHomeData", data);
        }
      })
      fnGetAllChain().then(res => {
        if (res.data.code === 0 && res.data.result) {
          commit("changeAllChain", res.data.result);
        }
      })
      fnGetBoardroomList(chainId == 1 ? 128 : chainId).then(res=>{
        if (res.data.code === 0 && res.data.result) {
          let data = res.data.result;
          commit("changeBoardRoomData", data);
          dispatch("boardRoom/getInfo");
        }
      })
    },
    // 获取 mdx 余额
    async getBalance({ commit, state, getters }) {
      try {
        setTimeout(async() => {
          if(state.chainId == 1) return
          const contract = await getContract(getters.currentAddress?.mdx, erc20Abi);
          const selectedAddress = state.boardRoom.account;
          if (selectedAddress) {
            const balance = await contract.methods
              .balanceOf(selectedAddress)
              .call();
            commit("changeBalance", balance / 1e18);
          }
        }, 1000)
      } catch (e) {
        console.error("getBalance error:", e);
      }
    },
    // 获取banner图数据
    getBannerData({ commit, state, getters }, data) {
      try {
        const chainId = data ? transferChainList[data] : state.chainId 
        fnGetBannerData(chainId).then(res => {
          // 更新banner原始数据
          let list = [] 
          if (res.data.code === 0 && res.data.result.length) {
            list = res.data.result
          }
          commit("saveBannerData", list)
          // 更新banner展示数据
          if (list) {
            const filterData = list.filter((item) => {
              return !!item[_getImgKey(getters.isPC, state.language)]['image_url'] 
            })
            commit("saveCloneBannerData", filterData)
          }
        })
      } catch (e) {
        console.error("getBannerData error:", e);
      }
    },
    // get blackData
    getBlackData({commit, state}) {
      try {
        const chainId = state.chainId
        const selectedAddress = state.boardRoom.account;
        if(selectedAddress) {
          getBlackList(chainId, selectedAddress).then(res => {
            if (res.data.code === 0 && res.data.result) {
              commit("setBlackData", res.data.result)
            }
          })
        }
      } catch (error) {
        console.error("getBlackData error:", e);
      }
    }
  },
  mutations: {
    setChainId(state, payload) {
      state.chainId = Number(payload);
      state.chainName = chainInfoList[payload]['name']
    },
    setChainName(state, payload) {
      state.chainName = payload;
    },
    setRouterName(state, payload) {
      state.routerName = payload;
    },
    setCurrencyPrice(state, payload) {
      state.CurrencyPrice = payload;
    },
    
    setLoding(state, payload) {
      state.showLoding = payload.show;
    },
    setTerminal(state, payload) {
      state.terminal = payload;
    },
    setLanguage(state, payload) {
      localStorage.setItem("language", payload);
      state.language = payload;
    },
    changeHomeData(state, payload) {
      state.homeData = payload;
    },
    changeBalance(state, payload) {
      state.balance = payload;
    },
    changeWthPrice(state, payload) {
      state.wthPrice = payload;
    },
    changeAllChain(state, payload) {
      state.allChain = payload;
    },
    setNavStatus(state, payload) {
      state.navStatus = payload
    },
    // 保存banner图数据
    saveBannerData(state, payload) {
      state.bannerData = payload
    },
    // 保存克隆banner图数据
    saveCloneBannerData(state, payload) {
      state.cloneBannerData = payload
    },
    // 保存h5底部导航展示状态
    setH5FootSatus(state, payload) {
      state.h5FootSatus = payload
    },
    setBlackData(state, payload) {
      state.blackData = payload
    },
    // 隐藏小红点
    setRedHint(state, payload) {
      localStorage.setItem("redHint", payload);
      state.redHintStatus = payload
    },
    // 保存董事会数据
    changeBoardRoomData(state, payload) {
      state.boardRoomData = payload
    }
  },
});
