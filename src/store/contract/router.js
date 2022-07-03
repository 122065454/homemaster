import { MintERC20 } from './erc20'

export default class Router extends MintERC20 {
  constructor(web3, abi) {
    super(web3, abi)
  }
}