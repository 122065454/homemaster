import boardRoomConfig from "@/config/pool/boardroom";
import lockupConfig from "@/config/pool/lockup";
import { getErc20Utils, getBalance, lockUpUtils} from "@/utils/publicErc20";
import {fnGetDestroyList} from '@/api/boardRoom.js'
let timer = null;

// 合并董事会、锁仓配置
const _mergeConfigure = (chainId) => {
  let boardromm = boardRoomConfig[chainId == 1 ? 128 : chainId]
  let lockup = lockupConfig[chainId == 1 ? 128 : chainId]
  for(let i of Object.keys(lockup)) {
    if(Object.keys(boardromm).includes(i)) {
      if(boardromm[i]['pid'] != lockup[i]['pid']) boardromm[i] = boardromm[i].concat(lockup[i])
    } else {
      boardromm[i] = lockup[i]
    }
  }
  return boardromm
}

const state = {
  // boardRoom: boardRoomConfig,
  // lp Apy 数据
  // poolApy: {},
  // 单币种 apy 数据
  // mdxApy: {},
  // 回购销毁列表
  destroyList: [],
  // 用户钱包地址
  account: '',
  allowance: 0,
  lpBalance: 0,
  stakedValue: 0,
  earn: 0,
  rewardeData: {
    rewardAmount: 0, // 待奖励金额
    destroyAmount: 0, // 待回购金额
    destoryPrice: 0, // 回购销毁价格
    totalDestroy: 0, // 总回购销毁MDX数量
    totalBuy: 0, // 总回购金额
    rewardPool: {}, // WHT奖励池子
    rewardMdx: {}, // MDX奖励池子
    totalReward: 0 // 已奖励金额
  },
  poolReward: {},
  poolPledge: {},
  // 初始化董事会获取收益状态 true:不受当日奖励金额限制调用收益，反之
  initBoardRoomRewardStatus: true
};

const mutations = {
  changeRewardeData(state, payload) {
    state.rewardeData = payload;
  },
  // changePoolApy(state, payload) {
  //   state.poolApy = payload;
  // },
  // changeMdxApy(state, payload) {
  //   state.mdxApy = payload;
  // },
  changeDestroyList(state, payload) {
    state.destroyList = payload;
  },
  changeAccount(state, payload) {
    state.account = payload;
  },
  changeAllowance(state, payload) {
    state.allowance = payload;
  },
  changeLpBalance(state, payload) {
    state.lpBalance = payload;
  },
  changeStakedValue(state, payload) {
    state.stakedValue = payload;
  },
  changeEarn(state, payload) {
    state.earn = payload;
  },
  changReward(state, payload) {
    state.poolReward = { ...state.poolReward, ...payload }
  },
  changPledge(state, payload) {
    state.poolPledge = { ...state.poolPledge, ...payload }
    window.localStorage.setItem('boardRoomLocalPledge', JSON.stringify(state.poolPledge))
  },
  changSingleData(state, payload) {
    const { earned_token, pid, _pledge, _reward } = payload
    if(Object.keys(state.poolPledge).length && _pledge) {
      state.poolPledge[earned_token][pid] = _pledge
      window.localStorage.setItem('boardRoomLocalPledge', JSON.stringify(state.poolPledge))
    }
    if(Object.keys(state.poolReward).length && _reward) {
      state.poolReward[earned_token][pid] = _reward
    }
  },
  changeBoardRoomRewardStatus(state, payload) {
    state.initBoardRoomRewardStatus = payload
  }
};

const actions = {
  // 获取空投奖励信息
  getInfo({ commit, dispatch, rootState }) {
    let awardedAmount = 0;
    const chainId = rootState.chainId
    let currentChainData = boardRoomConfig[chainId == 1 ? 128 : chainId];
    const keys = Object.keys(currentChainData)
    keys.forEach(key => {
      const dataKey = `boardroom_${key}`
      const data = rootState.boardRoomData[dataKey]
      if (data) {
        awardedAmount = Object.values(data).reduce(
          (current, next) => {
            return current + next.total_amount * 1;
          },
          awardedAmount
        );
      }
    })
    
    commit("changeRewardeData", {
      rewardAmount: rootState.homeData.reward_amount, // 待奖励金额
      destroyAmount: rootState.homeData.destroy_amount, // 待回购金额
      destoryPrice: rootState.homeData.destory_price, // 回购销毁价格
      totalDestroy: rootState.homeData.total_destroy, // 总回购销毁MDX数量
      totalBuy: rootState.homeData.total_buy, // 总回购金额
      // rewardPool: rootState.homeData.reward_pool, // WHT奖励池子
      // rewardMdx: rootState.homeData.reward_pool_mdx, // MDX奖励池子
      totalReward: awardedAmount // 已奖励金额
    });
    // commit("changePoolApy", rootState.homeData.reward_pool);
    // commit("changeMdxApy", rootState.homeData.reward_pool_mdx);
    dispatch('getReward')
  },
  // 获取收益列表对象
  async getReward({commit, rootState}) {
    const chainId = rootState.chainId
    let rewrds = {}
    let pledges = {}
    const {account, initBoardRoomRewardStatus} = rootState.boardRoom
    // 初始化收益列表对象
    switch(chainId) {
      case 56:
        const bscList = {mdx:{}, hmdx:{}, wbnb:{}, rabbit:{}, cow:{}, lock:{}, tusd:{}, bunny:{}, qbt:{}, fiwa:{}, xwg:{}, kala:{}, bpet:{}, kine:{}, arv:{}, pid:{}, npid:{}, jgn:{}, bnbh:{}, rici:{}, meta:{}, dep:{}, ginza:{}, sip:{}, atl:{}, avn:{}, cpd:{}}
        rewrds = JSON.parse(JSON.stringify(bscList))
        pledges = JSON.parse(JSON.stringify(bscList))
        break;
      case 128:
        const hecoList = { mdx:{}, wht: {}, hoo: {}, oldhoo: {}, jt: {}, one: {}, mx: {}, o3: {}, cow: {}, lock:{}, tusd: {}, nt: {}, hcfx: {}, xtm:{}, wnd:{} }
        rewrds = JSON.parse(JSON.stringify(hecoList))
        pledges = JSON.parse(JSON.stringify(hecoList))
        break;
      default:
        return
    }
    // 初始化单一币种收益
    const initRewardData = (type, token, pid) => {
      if(type == 2) {
        rewrds[token][pid] = { mdx: 0, earn: 0}    
      } else {
        rewrds[token][pid] = 0
      }
    }
    // 获取本地保存的不同池子质押
    const localPledge = window.localStorage.getItem("boardRoomLocalPledge")
    const poollist = this.getters['boardRoom/currentChainBoardRoomData']?.allData
    poollist?.forEach(async pool => {
      let { lpAddress, pid, amount, pool_type} = pool
      const earnedToken = pool.earnedToken?.toLocaleLowerCase()
      const earned_token = pool_type == 3 ? 'lock' : pool.earned_token?.toLocaleLowerCase()
      if(account) {
        let erc20Utils = getErc20Utils(chainId, 'boardroom', earned_token);
        let { fetchLPAllowance, getReward, fetchLocalAllowance, saveLocalAllowance, getStakeValue  } = erc20Utils
        // 初始化锁仓合约方法
        let { _getSingleEarnAmountOperate, _getLocalAllowanceOperate } = await lockUpUtils(chainId, earnedToken, lpAddress, account)
        let allowance = 0
        if (pool_type == 3) {
          allowance = await _getLocalAllowanceOperate()
        } else {
          const localAllowance = fetchLocalAllowance(lpAddress, account)
          if(localAllowance) {
            allowance = localAllowance
          } else {
            allowance = await fetchLPAllowance(lpAddress, account);
            saveLocalAllowance(lpAddress, account, allowance)
          }
        }
        // 获取用户质押收益
        if((allowance > 0 && amount > 1) || initBoardRoomRewardStatus) {
          let decimal = 18
          if(earned_token == 'hoo' || earned_token == 'arv') decimal = 8
          if(earned_token == 'pid' || earned_token == 'npid' || earned_token == 'rici' || earned_token == 'meta') decimal = 9
          let reward
          // 区分锁仓和非锁仓收益(单挖/双挖)
          if(pool_type == 3 ) {
            reward = await _getSingleEarnAmountOperate()
          } else {
            reward = await getReward(account, pid, decimal)
          }
          // 区分双收益(双挖)和单收益（锁仓/单挖）
          if(pool_type == 2) {
            rewrds[earned_token][pid] = {
              mdx: Number(reward['mdx'].toString(10)),
              earn: Number(reward['earn'].toString(10))
            }    
          } else {
            rewrds[earned_token][pid] = Number(reward.toString(10))
          }
          // 单一更新收益
          if(!initBoardRoomRewardStatus) {
            // 保存收益列表
            commit('changSingleData', {
              _reward: rewrds[earned_token][pid],
              pid,
              earned_token
            })
          }
        }
        // 获取用户质押数量
        if(initBoardRoomRewardStatus && !localPledge) { 
          if(pool_type == 3) {
            pledges[earned_token][pid] = 0
          } else {
            const stakedValue = await getStakeValue(pid, account)
            pledges[earned_token][pid] = stakedValue.toString()
          }
        }
      } else {
        initRewardData(pool_type, earned_token, pid)
      }
      let keyLen = 0
      const keys = Object.keys(rewrds)
      keys.forEach((key) => {keyLen += Object.keys(rewrds[key]).length})
      if(keyLen == poollist.length && initBoardRoomRewardStatus) {
        // 保存收益列表
        commit('changReward', rewrds)
        // 保存质押列表
        if(localPledge) pledges = JSON.parse(localPledge)
        commit('changPledge', pledges)
        // 开启奖励金额限制调用
        if(initBoardRoomRewardStatus) commit("changeBoardRoomRewardStatus", false)
      }
    })
  },
  // 获取回购销毁记录
  getDestroyList({ commit, dispatch, rootState }) {
    const chainId = rootState.chainId
    fnGetDestroyList(chainId).then(res=>{
      if (res.data.code == 0) {
        commit("changeDestroyList", res.data.result);
      }
    })
    // axios.get(`${API_URL}/boardroom/repurch/list?mdex_chainid=${chainId}`).then(res => {
    //   if (res.data.code == 0) {
    //     commit("changeDestroyList", res.data.result);
    //   }
    // });
  },
  // 获取钱包信息
  async getWalletData({ commit, dispatch, rootState }, data = {}) {
    const chainId = rootState.chainId
    const account = rootState.boardRoom.account
    if(chainId == 1) {
      return
    }
    let { type, lpAddress, pid, earn, earnedToken, pool_type, earned_token } = data
    let erc20Utils = getErc20Utils(chainId, type, earn);
    let {
      fetchLPAllowance,
      getStakeValue,
      getReward,
      fetchLocalAllowance,
      saveLocalAllowance
    } = erc20Utils;
    clearInterval(timer);
    const setReward = () => {
      if(earnedToken && earnedToken.includes('&')) {
        commit("changeEarn", {'mdx': 0, 'earn': 0})
      } else {
        commit("changeEarn", 0);
      }
    }
    try {
      if (account) {
        let allowance = 0
        const localAllowance = fetchLocalAllowance(lpAddress, account)
        if(localAllowance) {
          allowance = localAllowance
        } else {
          allowance = await fetchLPAllowance(lpAddress, account);
          saveLocalAllowance(lpAddress, account, allowance)
        }
        commit("changeAllowance", allowance);
        const lpBalance = await getBalance(lpAddress, account);
        commit("changeLpBalance", lpBalance.toString(10));
        if(allowance > 0) {
          let stakedValue = await getStakeValue(pid, account)
          stakedValue = stakedValue.toString(10)
          let decimal = 18
          if(earn == 'hoo' || earn == 'arv') decimal = 8
          if(earn == 'pid' || earn == 'npid' || earn == 'rici' || earn == 'meta') decimal = 9
          const reward = await getReward(account, pid, decimal)
          let rewardVal
          if(Object.keys(reward).includes('earn')) {
            rewardVal = {'mdx': +reward['mdx'].toString(10), 'earn': +reward['earn'].toString(10)}
          } else {
            rewardVal = reward.toString(10)
          }
          commit("changeStakedValue", stakedValue);
          commit("changeEarn", rewardVal);
          commit("changSingleData", {
            _pledge: stakedValue,
            _reward: rewardVal,
            pid,
            earned_token: pool_type == 3 ? 'lock' : earned_token?.toLocaleLowerCase()
          })
        } else {
          setReward()
          commit("changeStakedValue", 0);
        }
      } else {
        setReward()
      }
    } catch (error) {
      console.log("getData:", error);
    }
  }
};

const getters = {
  // 当前链的董事会数据
  currentChainBoardRoomData(state, getters, rootState) {
    const chainId = rootState.chainId
    // 本地池子配置列表
    let currentChainData = _mergeConfigure(chainId)
    const keys = Object.keys(currentChainData)
    const allData = []
    const poolObj = {}
    let LP = []
    let single = []
    // 本地池子、线上接口进行配对
    const boardRoomConfigSize = keys.length
    const homeDataSize = Object.keys(rootState.boardRoomData).filter((item) => item.includes('boardroom_')).length
    if(boardRoomConfigSize == homeDataSize) {
      keys.forEach(key => {
        const dataKey = `boardroom_${key}`
        // 接口某一币种池子的列表
        const data = rootState.boardRoomData[dataKey]
        // 本地某一币种池子的列表
        const pools = currentChainData[key]
        // 此处有潜在bug，切链的时候，charts(带链接口)还未更新就进入此方法，导致mdx矿池与本地不匹配（出现场景，bsc切heco）
        if(data) {
          poolObj[key] = []
          pools.forEach((pool, ind) => {
            // 本地的池子列表匹配线上的接口的池子列表
            if (data[pool.pid]) {
              // 匹配到拿到线上对应得某一条数据
              const poolData = data[pool.pid]
              // 合并并构建新的数组对象（所有的数据都在同一层级）
              allData.push({...poolData, ...pool })
              // 合并并构建新的数组对象(保持原来的数据结构,按收益币种进行分类)
              poolObj[key].push({...poolData,...pool})
            }
          })
        }
      })
      // 根据当日奖励金额进行降序排序
      allData.sort((a, b) => b.amount - a.amount)
      // LP的类型进行筛选
      LP = allData.filter(item => item.name.includes(' LP'))
      // 单币质押类型进行筛选
      single = allData.filter(item => !item.name.includes(' LP'))
      // const a = { LP, single, allData,...poolObj}
      // console.log('currentChainBoardRoomData', a)
    }
    return { LP, single, allData,...poolObj}
  },
  currentChainBoardRoomDataLP(state, getters) {
    return getters.currentChainBoardRoomData?.LP || [];
  },
  currentChainBoardRoomDataSingle(state, getters) {
    return getters.currentChainBoardRoomData?.single || [];
  },
  currentChainBoardRoomDataAll(state, getters) {
    return getters.currentChainBoardRoomData?.allData || [];
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
