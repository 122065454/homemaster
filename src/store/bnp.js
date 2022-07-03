import BigNumber from 'bignumber.js'
import conf from '@/config'
import bnp from './contract'
import config from '@/config'

window.BNP = bnp
console.log(bnp)
export { bnp }

export default {
  namespaced: true,
  state: {
    blockNumber: 0,
    totalSupply: new BigNumber(0),
    stakedValue: [],
    pools: bnp.pools || [],
    bnpBalanceOf: new BigNumber(0),
    uniBalanceOf: new BigNumber(0),
    sushiBalanceOf: new BigNumber(0),
    ethBalanceOf: new BigNumber(0),
  },
  getters: {
    totalWethAmount: state => BigNumber.sum.apply(null, state.stakedValue.map(({totalWethValue}) => totalWethValue)),
    sushiPrice: state => {
      const sushiIndex = state.pools.findIndex(
        ({ tokenSymbol }) => tokenSymbol.includes(conf.id),
      )
      const sushiPrice = sushiIndex >= 0 && state.stakedValue[sushiIndex]
        ? state.stakedValue[sushiIndex].tokenPriceInWeth
        : new BigNumber(0)
      return sushiPrice
    },
    menuList: (state, getters) => {
      return state.pools.reduce(
        (farmRows, farm, i) => {
          // 植入 total与apy
          const farmWithStakedValue = {
            ...farm,
            poolWeight: state.stakedValue[i] ? state.stakedValue[i].poolWeight : new BigNumber(0),
          }
          return [...farmRows, farmWithStakedValue]
        },
        [],
      )
    },
    harvest: state => [
      {
        id: 'bnp',
        ico: require('../assets/BNP.png'),
        num: state.bnpBalanceOf,
        harvest: !!state.bnpBalanceOf.toNumber(),
      },
    ]
  },
  watch: {
    blockNumber() {
      this.fetchAllTokenBalanceOf()
    }
  },
  actions: {
    resetConnect() {
      bnp.setProvider(null)
      bnp.setAccount('')
    },
    // onInit() {
    //   setInterval(() => {
    //     if (this.$root.account.isLogin) {
    //       bnp.web3.eth.getBlockNumber((err, n) => {
    //         if (!err && n != this.blockNumber) {
    //           this.blockNumber = n
    //         }
    //       })
    //     }
    //   }, 1000)
    // },
    onConnect(provider, account) {
      console.log('provider:', provider)
      bnp.setProvider(provider, conf.networkID)
      bnp.setAccount(account || provider.selectedAddress)
      this.fetchAllTokenBalanceOf()
      this.bnpBalanceOf = new BigNumber(0)
      this.uniBalanceOf = new BigNumber(0)
      this.sushiBalanceOf = new BigNumber(0)
      this.ethBalanceOf = new BigNumber(0)
      this.events(provider)
    },
    async fetchAllTokenBalanceOf() {
      const balances = await Promise.all([
        bnp.bnp.balanceOf().catch(() => this.bnpBalanceOf),
        bnp.uniToken.balanceOf().catch(() => this.uniBalanceOf),
        bnp.sushiToken.balanceOf().catch(() => this.sushiBalanceOf),
        bnp.multicall.ethBalance().catch(() => this.ethBalanceOf)
      ])
      this.bnpBalanceOf = balances[0]
      this.uniBalanceOf = balances[1]
      this.sushiBalanceOf = balances[2]
      this.ethBalanceOf = balances[3] || new BigNumber(0)
      return balances
    },
    events(provider) {
      provider.on('accountsChanged', e => {
        console.log(e, 'accountsChanged')
      })
      provider.on('networkChanged', (e) => {
        console.log(e, 'networkChanged')
      })
    },
    async fetchTotalSupply() {
      const num = await bnp.sushi.totalSupply()
      this.totalSupply = num
    },
    async fetchTokenBalance(tokenAddress) {
      const balance = await this.getERC20Contract(tokenAddress).balanceOf()
      return new BigNumber(balance)
    },
    getERC20Contract(tokenAddress) {
      const account = this.$root.boardRoom.account   
      const contract = new bnp.ERC20(bnp.web3, config.abi.ERC20Abi)
      contract.setProvider(tokenAddress)
      if (account) {
        contract.setAccount(account)
      }
      return contract
    },
    async fetchStakedValue(pid, decimal) {
      const {amount} = await bnp.masterChef.userInfo(pid)
      return bnp.masterChef.balanceNum(amount, decimal)
    },
    getLpContract(address) {
      return this.getERC20Contract(address)
    },
    async fetchLPAllowance(tokenAddress) {
      const masterChefAddress = bnp.masterChef.address
      const lp = this.getERC20Contract(tokenAddress)
      const allowance = await lp.allowance(masterChefAddress)
      return new BigNumber(allowance)
    },
    async lpApprove(lpAddress) {
      const masterChefAddress = bnp.masterChef.address
      const lp = this.getERC20Contract(lpAddress)
      return lp.approve(masterChefAddress)
    },
    async lpStake(pid, amount, decimal) {
      return bnp.masterChef.deposit(pid, amount, decimal)
    },
    async lpUnStake(pid, amount, decimal) {
      return bnp.masterChef.withdraw(pid, amount, decimal)
    },
    async fetchHarvest(pid) {
      const r = await bnp.masterChef.pendingSushi(pid).catch(() => 0)
      return {
        BNP: bnp.masterChef.balanceNum(r[0]),
        UNI: new BigNumber(0),
        SUSHI: bnp.masterChef.balanceNum(r[1]),
      }
    },
    harvestBnp(pid) {
      return bnp.masterChef.deposit(pid, '0')
    },
    harvestUni(pid) {
      return bnp.masterChef.deposit(pid, '0')
    },
    harvestSushi(pid) {
      return bnp.masterChef.deposit(pid, '0')
    },
  }
}
