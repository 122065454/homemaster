import BigNumber from 'bignumber.js'
import { toBalanceNumber } from '@/utils/formatBalance'

export default class Contract {
  constructor(web3, abi) {
    this.web3 = web3
    this.contract = new web3.eth.Contract(abi)
  }
  async account() {
    if (this.contract.options.from) {
      return this.contract.options.from
    }
    const accounts = await BNP.web3.eth.getAccounts()
    if (accounts.length) {
      this.contract.options.from = accounts[0]
      return accounts[0]
    }
    return ''
  }
  get address() {
    return this.contract.options.address
  }

  balanceNum(num, decimals = 18) {
    if (!(num instanceof BigNumber)) {
      num = new BigNumber(num)
    }
    return toBalanceNumber(num, decimals)
  }

  setProvider(address) {
    this.contract.options.address = address;
  }
  setAccount(address) {
    this.contract.options.from = address;
  }

  call(methodName, ...args) {
    const method = this.contract.methods[methodName]
    if (!method) {
      throw new Error('unsupport method: ' + methodName)
    }
    return method(...args).call()
  }
  send(methodName, ...args) {
    const method = this.contract.methods[methodName]
    if (!method) {
      throw new Error('unsupport method: ' + methodName)
    }
    return async (...opts) => method(...args)
      .send({from: await this.account(), ...opts})
      .on('transactionHash', (tx) => {
      return tx.transactionHash;
    })
  }

}