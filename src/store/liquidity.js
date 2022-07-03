
import liquidityPool from '@/config/pool/liquidity'
import { getErc20Utils } from "@/utils/publicErc20";
import { fnGetApyList } from '@/api/liquidity'
const state = {
  apylist: {},
  poolReward: {},
  // 风险提示展示 true展示  false不展示
  riskShow: {'Heco': true, 'Bsc': true }
}

const mutations = {
  changeApy(state, payload) {
    state.apylist = payload;
  },
  changReward(state, payload) {
    state.poolReward = payload;
  },
  // 更改风险提示状态
  changRiskShow(state, payload) {
    state.riskShow = {...state.riskShow, ...payload}
  },
}

const actions = {
  getApyList({ commit, dispatch, rootState }) {
    const chainId = rootState.chainId
    // const chainId = 128
    fnGetApyList(chainId == 1 ? 128 : chainId).then(res=>{
      if(res.data.code === 0 && res.data.result) {
        commit('changeApy', res.data.result)
        if(rootState.chainId != 1) {
          dispatch('getReward')
        }
      }
    })
  },
  async getReward({commit, rootState}) {
    const poollist = this.getters['liquidity/poolList']
    const apylist = rootState.liquidity.apylist
    const rewrds = {}
    const account = rootState.boardRoom.account
    let erc20Utils = getErc20Utils(rootState.chainId, 'liquidity', 'mdx');
    let {
      fetchLPAllowance,
      getReward,
      fetchLocalAllowance,
      saveLocalAllowance
    } = erc20Utils;
    poollist.forEach(async pool => {
      try {
        let { lpAddress, pid} = pool;
        if(account && ((pid > 7 && rootState.chainId == 128) || rootState.chainId != 128)) {
          let allowance = 0
          const localAllowance = fetchLocalAllowance(lpAddress, account)
          if(localAllowance) {
            allowance = localAllowance
          } else {
            allowance = await fetchLPAllowance(lpAddress, account);
            saveLocalAllowance(lpAddress, account, allowance)
          }
          // 备注：用户在列表中无法看到已下架的挖矿收益，只能点到pool里面才能看到
          if(allowance > 0 && apylist[pid]['pool_apy'] > 0) {
            const reward = await getReward(account, pid);
            rewrds[pool.pid] = Number(reward.toString(10))
          } else {
            rewrds[pool.pid] = 0
          }
        } else {
          rewrds[pool.pid] = 0
        }
        if(Object.keys(rewrds).length == poollist.length) {
          commit('changReward', rewrds)
        }
      } catch (error) {
        console.log(pool, 'getReward', error)
      }
    })
  }
}

const getters = {
  poolList(state, getters, rootState) {
    const chainId = rootState.chainId
    // const chainId = 128
    return liquidityPool[chainId == 1 ? 128 : chainId]
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
