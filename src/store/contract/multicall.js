import Contract from './contract'

export default class Router extends Contract {
  constructor(web3, abi) {
    super(web3, abi)
    this.web3 = web3
  }
  async ethBalance() {
    try {
      const account = await this.account()
      const num = await this.web3.eth.getBalance(account)
      return this.balanceNum(num, 18)
    } catch (error) {
      console.log('ethBalance:', error)
    }
  }
}