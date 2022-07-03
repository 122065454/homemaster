import BigNumber from 'bignumber.js'
import Contract from './contract'
import ERC20 from './erc20'

export default class MasterChef extends ERC20 {
  constructor(web3, abi) {
    super(web3, abi)
  }
  async userInfo(pid, account) {
    if (!account) {
      account = await this.account()
    }
    return this.call('userInfo', pid, account)
  }
  async deposit(pid, amount, dec=18) {
    const num = new BigNumber(amount).times(new BigNumber(10).pow(dec)).toString()
    return this.send('deposit', pid, num)()
  }
  async withdraw(pid, amount, dec) {
    const num = new BigNumber(amount).times(new BigNumber(10).pow(dec)).toString()
    return this.send('withdraw', pid, num)()
  }
  async pendingSushi(pid, account) {
    const dec = await this.decimals()
    if (!account) {
      account = await this.account()
    }
    return this.call('pending', pid, account)
  }
}