
import abiConfig from "@/utils/abi.config";
import addressConfig from "@/utils/address.config";
import { getContract } from "@/utils/publicErc20";
import {fnGetTradeList} from '@/api/reward'
const state = {
  tradelist: [],
  rewardList: {},
  miningContract: null
}

const mutations = {
  changeList(state, payload) {
    state.tradelist = payload;
  },
  changerewardList(state, payload) {
    state.rewardList = payload;
  },
  initContract(state, payload) {
    state.miningContract = payload;
  }
}

const actions = {
  getTradeList({ commit, dispatch, rootState }) {
    const chainId = rootState.chainId
    // const chainId = 128
    fnGetTradeList(chainId == 1 ? 128 : chainId).then(res=>{
      if(res.data.code === 0 && res.data.result) {
        commit('changeList', res.data.result)
        if(rootState.chainId != 1) {
          dispatch('getUserReward', res.data.result)
        }
      }
    })
  },
  async getUserReward({commit, rootState}, data=[]) {
    const chainId = rootState.chainId
    const miningAddr = addressConfig[chainId].mining
    const miningAbi = abiConfig[chainId].mining
    const account = rootState.boardRoom.account;
    if(account) {
      const miningContract = await getContract(miningAddr, miningAbi, account)
      const baseContract = await getContract(miningAddr, miningAbi, account, true)
      const rewardList = {}
      for(const val of data) {
        try {
          const userInfo = await baseContract.methods.getUserReward(val.pool_id).call()
          const userReward= Number(userInfo[0].toString()/1e+18)
          const userMint= Number(userInfo[1].toString()/1e+18)
          rewardList[val.pool_id] = {userReward, userMint}
        } catch (error) {
          console.log('rewardList error:', error)
        }
        const len = Object.keys(rewardList).length
        if(len == data.length) {
          commit('changerewardList', rewardList)
        }
      }
      commit('initContract', miningContract)
    }
  }
}



export default {
  namespaced: true,
  state,
  mutations,
  actions
};
