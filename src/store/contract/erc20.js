// import BigNumber from '@ethersproject/bignumber'
import Contract from './contract'

const MaxUint256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'

export default class ERC20 extends Contract {
  constructor(web3, abi) {
    super(web3, abi)
    this._decimals = 18
  }
  
  approve(address) {
    return this.send('approve', address, MaxUint256)()
  }
  async allowance(spender) {
    const dec = await this.decimals()
    const num = await this.call('allowance', await this.account(), spender)
    return this.balanceNum(num, dec)
  }
  name() {
    return this.call('name')
  }
  symbol() {
    return this.call('symbol')
  }

  async decimals() {
    if (this._decimals) {
      return this._decimals
    }
    this._decimals = await this.call('decimals')
    return this._decimals
  }

  async totalSupply() {
    const dec = await this.decimals()
    const num = await this.call('totalSupply')
    return this.balanceNum(num, dec)
  }

  async balanceOf(account, decimal) {
    const dec = await this.decimals()
    if (!account) {
      account = await this.account()
    }
    const num = await this.call('balanceOf', account)
    return this.balanceNum(num, decimal || dec)
  }

  transfer(address, val) {
    return this.send('transfer', address, val.toString())()
  }

  transferFrom(from, to, val) {
    return this.send('transferFrom', from, to, val.toString())()
  }
}

export class MintERC20 extends ERC20 {
  mint(to, amount) {
    const num = this.balanceNum(amount)
    return this.send('mint', to, amount)()
  }
}