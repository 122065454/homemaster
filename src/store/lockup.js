
import { _formatDate, _numComma, _getPrecision, _getApy  } from "@/utils/comMethod"
import addressConfig from "@/utils/address.config"
import { lockUpUtils } from "@/utils/publicErc20"
import { weightList } from "@/utils/comStatic"
import BigNumber from "bignumber.js"

const state = {
  // 活期数据
  currentData: [],
  // 定期数据
  regularData: [],
  // 定期分页数据
  regularPageData: {},
  // 授权状态
  allowance: '',
  // mdx币种资产
  singleBalance: 0,
  // 总锁仓数量
  totalLockAmount: 0,
  // 可提取数量
  totalExtractAmount: 0,
  // 总质押数量
  totalPledgeAmount: 0,
  // 总收益
  totalEarn: 0,
  // 定期分页一页展示条数
  regularSize: 8,
  // dao凭证
  daoVoucherAmount: 0,
  // 待领取凭证数量
  toExtractVoucherAmount: 0,
  // 已解锁不同权重数量
  unlockedAmountList: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
}

const actions = {
  // 初始化数据
  async getLockupInitData({ commit, dispatch, rootState }, data = {}) {

    // 权限
    let allowance = ''
    // 资产
    let singleBalance = 0
    // 活期数据
    let currentData = []
    // 定期数据
    let regularData = []
    // 定期分页数据
    let regularPageData = {}
    // 总锁仓数量
    let totalLockAmount = 0
    // 可提取数量
    let totalExtractAmount = 0
    // 总质押数量
    let totalPledgeAmount = 0
    // 总收益
    let totalEarn = 0
    // dao凭证
    let daoVoucherAmount = 66.66
    // 待领取凭证数量
    let toExtractVoucherAmount = 0
    // 已解锁不同权重数量
    let unlockedAmountList = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    // 用户钱包地址
    const accounts = rootState.boardRoom.account
    // 币种精度
    const precision = _getPrecision(data.earnedToken)
    // 凭证地址
    const voucherToken = addressConfig[rootState.chainId]['lockup'][data.voucher.toLowerCase()]
    console.log('data.voucher', data.voucher)
    console.log('voucherToken', voucherToken)
    try {
      // 初始化活期数据
      const initTableData = () => { 
        const wl = data.weights ? data.weights : weightList
        for(let i of Object.keys(wl)) {
          // 元素对象
          let element = { kindId: i, locknum: 0, apy: 0 }
          // 组装默认活期/定期数据
          if (i == 0) {
            currentData.push(element)
          } else {
            // 判断是否有锁仓到期数据false:没有 true:有
            element['existUnLock'] = false
            regularData.push(element)
            regularPageData[i] = []
          }
        }
      }
      if (accounts && Object.keys(data).length) {
        // 传入组装数据
        const {earnedToken, lpAddress, pool_apy, weights} = data
        // 获取合约实例，并获取方法
        const { 
          _getUserUnlockedAmountOperate,
          _getSinglePledgeAmountOperate, 
          _getSinglePledgeListOperate,
          _getSingleEarnAmountOperate,
          _getLocalAllowanceOperate,
          _getSingleBalanceOperate, 
          _getVmdxAmountOperate } = await lockUpUtils(rootState.chainId, earnedToken, lpAddress, accounts)
        // 查询保存本地授权，没有初始化为''
        const localAllowance = await _getLocalAllowanceOperate()

        if(localAllowance && localAllowance !== '0') allowance = localAllowance
        // 查询MDX资产
        singleBalance = await _getSingleBalanceOperate()
        // 查询vMDX资产
        daoVoucherAmount = await _getSingleBalanceOperate(voucherToken)
        // 查询总收益
        totalEarn = _numComma(await _getSingleEarnAmountOperate(), precision)
        // 查询待领取凭证数量
        toExtractVoucherAmount = await _getVmdxAmountOperate()
        // 已解锁不同权重数量
        unlockedAmountList = await _getUserUnlockedAmountOperate()
        console.log('unlockedAmountList', unlockedAmountList)
        // 组合质押列表数据
        for(let i of Object.keys(weights)) {
          // 查询某一权重质押的数量
          let singlepledgeAccount = await _getSinglePledgeAmountOperate(i)
          // 组建活期/定期数据
          if (singlepledgeAccount && singlepledgeAccount != 0) {
            // 防止科学计算法
            const spa = new BigNumber(singlepledgeAccount)
            // 元素对象
            let element = { kindId: i, locknum: singlepledgeAccount }
            // 总质押数量
            totalPledgeAmount = spa.plus(totalPledgeAmount)
            if (i == 0) {
              // 总可提取数量=活期质押/活期提取（定期解锁）
              totalExtractAmount = singlepledgeAccount
              currentData.push(element)
            } else {
              // 总锁仓数量
              totalLockAmount = spa.plus(totalLockAmount)
              // 查询某一权重订单列表
              const orderList = await _getSinglePledgeListOperate(i)
              const unLockData = orderList.filter((item) => {return item.unLockTime <= new Date().getTime()})
              console.log('unLockData', unLockData)
              // 拼接年化并转义数组元素
              if(orderList.length) {
                for(let y of orderList) {
                  y['amount'] = _numComma(y['amount'], 2)
                  y['weightAmount'] = _numComma(y['weightAmount'], 2)
                }
                element['existUnLock'] = unLockData.length > 0
                console.log('existUnLock', element['existUnLock'])
                element['list'] = orderList 
                regularPageData[i] = orderList.slice(0, rootState.lockup.regularSize)
              } else {
                element['existUnLock'] = false
                regularPageData[i] = []
              }
              element['apy'] = _getApy(pool_apy, weights[i])
              regularData.push(element)
            }
          } else {
            let element = { kindId: i, locknum: 0 }
            if (i == 0) {
              currentData.push(element)
            } else {
              element['existUnLock'] = false
              element['apy'] = _getApy(pool_apy, weights[i])
              regularData.push(element)
              regularPageData[i] = []
            }
          } 
        }
      } else {
        initTableData()
      }
      console.log('regularData', regularData)
      // 保存授权信息
      commit("saveAllowance", allowance)
      // 保存单一资产信息
      commit("saveSingleBalance", singleBalance)
      // 保存活期数据
      commit("saveCurrentData", currentData)
      // 保存定期数据
      commit("saveRegularData", regularData)
      // 保存定期分页数据
      commit("saveRegularPageData", regularPageData)
      // 保存总锁仓数量
      commit("saveTotalLockAmount", totalLockAmount)
      // 保存可提取数量
      commit("saveTotalExtractAmount", totalExtractAmount)
      // 保存总质押数量
      commit("saveTotalPledgeAmount", totalPledgeAmount)
      // 保存总收益
      commit("saveTotalEarn", totalEarn)
      // 保存dao凭证
      commit("saveDaoVoucherAmount", daoVoucherAmount)
      // 保存待领取凭证数量
      commit("saveToExtractVoucherAmount", toExtractVoucherAmount)
      // 保存已解锁不同权重数量
      commit("saveUnlockedAmountList", unlockedAmountList) 
    } catch (error) {
      console.log("lockup_getWalletData:", error)
    }
  }
}

const mutations = { 
  // 保存授权状态
  saveAllowance(state, payload) {
    state.allowance = payload
  },
  // 保存单一币种资产
  saveSingleBalance(state, payload) {
    state.singleBalance = payload
  },
  // 保存活期数据
  saveCurrentData(state, payload) {
    state.currentData = payload
  },
  // 保存定期数据
  saveRegularData(state, payload) {
    state.regularData = payload
  },
  // 保存定期分页数据
  saveRegularPageData(state, payload) {
    state.regularPageData = payload
  },
  // 保存总锁仓数量
  saveTotalLockAmount(state, payload) { 
    state.totalLockAmount = payload
  },
  // 保存可提取数量
  saveTotalExtractAmount(state, payload) { 
    state.totalExtractAmount = payload
  },
  // 保存总质押数量
  saveTotalPledgeAmount(state, payload) { 
    state.totalPledgeAmount = payload
  },
  // 保存总收益
  saveTotalEarn(state, payload) { 
    state.totalEarn = payload
  },
  // 保存Dao凭证数量
  saveDaoVoucherAmount(state, payload) { 
    state.daoVoucherAmount = payload
  },
  // 保存待领取凭证数量
  saveToExtractVoucherAmount(state, payload) {
    state.toExtractVoucherAmount = payload
  },
  // 保存已解锁不同权重数量
  saveUnlockedAmountList(state, payload) {
    state.unlockedAmountList = payload
  },
}

export default {
  namespaced: true,
  mutations,
  actions,
  state,
}