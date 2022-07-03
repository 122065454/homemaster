
import addressConfig from "@/utils/address.config";
import EthLockABI from "@/config/abi/ethLock.json";
import { fnGetAssetslist,fnSaveHash,fnGetchainHistory,fnGetOneChainHistory,getIswapToken} from '@/api/crossChain'
import { getBalance, getAllowance, getLocalAllowance, getContract, setLocalAllowance, getBaseBalance, MaxUint256 } from "@/utils/publicErc20";
const state = {
  assetslist: [],
  chainHistory: {transactions:[]},
  oneChainHistory: [],
  tokenAllowance: 0,
   // 判断是否iswap
  isIswap:false
}

const mutations = {
  changeAssetslist(state, payload) {
    state.assetslist = payload;
  },
  changeChainHistory(state, payload) {
    state.chainHistory = payload;
  },
  changeOneChainHistory(state, payload) {
    state.oneChainHistory = payload;
  },
  changeTokenBalance(state, payload) {
    state.tokenBalance = payload;
  },
  changeTokenAllowance(state, payload) {
    state.tokenAllowance = payload;
  },
  changeIswap(state, payload) {
    state.isIswap = payload;
  }
}

const actions = {
  getAssetslist({ commit, dispatch, rootState }) {
    const chainId = rootState.chainId
    getIswapToken().then(async res=>{
     
      if(res.data.code === 0 && res.data.result) {
        try {
          const account = rootState.boardRoom.account
          const Assetslist = await Promise.all(res.data.result.map(async val => {
            let balance = 0
            if(account) {
              if(val.address == '0000000000000000000000000000000000000000') {
                balance = await getBaseBalance(account)
              } else {
                balance = await getBalance(`0x${val.address}`, account)
              }
            }
            return {
              ...val,
              balance
            }
          }))
          commit('changeAssetslist', Assetslist)
        } catch (error) {
          console.log('get Assetslist', error)
        }
      }
    })
  },
  saveHash({ commit, dispatch, rootState }, data) {
    const chainId = rootState.chainId
    const account = rootState.boardRoom.account
    fnSaveHash({
      mdex_chainid : chainId,
      account,
      ...data
    })
  },
  // 查询记录   
  getchainHistory({ commit, dispatch, rootState }, data) {
    const chainId = rootState.chainId
    const account = rootState.boardRoom.account
    if(account) {
      fnGetchainHistory(chainId,account.replace('0x','')).then(res=>{
        if(res.data.code === 0 && res.data.result) {
          console.log('changeChainHistory', res.data.result)
          commit('changeChainHistory', res.data.result)
        }
      })
    }
   
  },
   // 查询单个记录
  getOneChainHistory({ commit, dispatch, rootState }, hash) {
    fnGetOneChainHistory(hash).then(res=>{
      if(res.data.code === 0 && res.data.result) {
        commit('changeOneChainHistory', res.data.result)
      }
    })
  },
  async getTokenAllowance({commit, dispatch, rootState}, tokenAddress) {
    try {
      if(tokenAddress) {
        const account = rootState.boardRoom.account
        const chainId = rootState.chainId
        const contractAddr = addressConfig[chainId].cross
        let allowance = 0
        if(tokenAddress == '0x0000000000000000000000000000000000000000') {
          allowance = MaxUint256
        } else {
          const localAllowance = getLocalAllowance(tokenAddress, account, contractAddr)
          if(localAllowance) {
            allowance = localAllowance
          } else {
            allowance = await getAllowance(tokenAddress, account, contractAddr)
            setLocalAllowance(tokenAddress, account, contractAddr, allowance)
          }
        }
        commit('changeTokenAllowance', allowance)
      }
    } catch (error) {
      console.log('getAllowance:', error)
    }
  }
}

const getters = {
  currentCrossAddress(state, getters, rootState) {
    const chainId = rootState.chainId
    return addressConfig[chainId].cross
  },
  lockContract(state, getters, rootState){
    const account = rootState.boardRoom.account
    return getContract(getters.currentCrossAddress, EthLockABI, account)
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
