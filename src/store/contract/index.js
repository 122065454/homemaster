import config from '@/config'
import Web3 from 'web3';
import Contract from './contract'
// import BigNumber from 'bignumber.js';
import Sushi from './sushi'
import MasterChef from './masterChef'
import Router from './router'
import ERC20 from './erc20'
import Multicall from './multicall'
import UniPairToken from './uniPair'

class ContractCollect {
  constructor(web3, options) {
    this.Contract = Contract
    this.ERC20 = ERC20

    this.web3 = web3;
    this.defaultConfirmations = options.defaultConfirmations;
    this.autoGasMultiplier = options.autoGasMultiplier || 1.5;
    this.confirmationType = options.confirmationType || 1;
    this.defaultGas = options.defaultGas;
    this.defaultGasPrice = options.defaultGasPrice;

    // this.sushi = new Sushi(this.web3, config.abi.SushiAbi)
    this.bnp = this.sushi
    // this.masterChef = new MasterChef(this.web3, config.abi.MasterChefAbi)
    // this.masterChef = new MasterChef(this.web3, config.abi.MasterFarmerAbi)
    // this.weth = new ERC20(this.web3, config.abi.ERC20Abi)
    // this.router = new Router(this.web3, config.abi.RouterAbi)
    // this.multicall = new Multicall(this.web3, config.abi.MultiCallAbi)
    // this.uniToken = new ERC20(this.web3, config.abi.UNITokenAbi)
    // this.sushiToken = new ERC20(this.web3, config.abi.SushiTokenAbi)

    // this.sushi = new this.web3.eth.Contract(SushiAbi);
    // this.bnpToken = this.sushi
    // this.masterChef = new this.web3.eth.Contract(MasterChefAbi);
    // this.weth = new this.web3.eth.Contract(WETHAbi);
    // this.router = new this.web3.eth.Contract(config.abi.RouterAbi)
    // this.multicall = new this.web3.eth.Contract(config.abi.MultiCallAbi)
    // this.uniToken = new this.web3.eth.Contract(config.abi.UNITokenAbi)
    // this.sushiToken = new this.web3.eth.Contract(config.abi.SushiTokenAbi)
    // console.log('config.pools:', config.pools)
    // this.pools = config.pools.map((pool) => Object.assign(pool, {
    //   lpAddress: pool.lpAddresses,
    //   tokenAddress: pool.tokenAddresses,
    //   lpContract: new UniPairToken(this.web3, config.abi.UNIV2PairAbi),
    //   tokenContract: new ERC20(this.web3, config.abi.ERC20Abi),
    // })).map(({ pid, name, symbol, iconA, iconB, tokenAddress, tokenSymbol, tokenContract, lpAddress, lpContract, earnPercent, decimal, islp}) => ({
    //   pid,
    //   id: symbol,
    //   name,
    //   lpToken: symbol,
    //   lpTokenAddress: lpAddress,
    //   lpContract,
    //   tokenAddress,
    //   tokenSymbol,
    //   tokenContract,
    //   earnPercent,
    //   earnToken: config.id,
    //   earnTokenAddress: config.tokenAddress.sushi,
    //   iconA,
    //   iconB,
    //   decimal,
    //   islp
    // }))
    // console.log('this.pools:', this.pools)
    this.setProvider(config.provider);
    this.setAccount(this.web3.eth.defaultAccount);
  }
  setProvider(provider) {
    // this.web3.setProvider(provider)
    // this.sushi.setProvider(config.tokenAddress.sushiAddress)
    // this.bnp.setProvider(config.tokenAddress.sushiAddress)
    // this.masterChef.setProvider(config.tokenAddress.masterChefAddress)
    // this.weth.setProvider(config.tokenAddress.weth)
    // this.router.setProvider(config.tokenAddress.router)
    // this.multicall.setProvider(config.tokenAddress.multiCall)
    // this.uniToken.setProvider(config.tokenAddress.uniToken)
    // this.sushiToken.setProvider(config.tokenAddress.sushiToken)
    // this.pools.forEach(({ lpContract, lpTokenAddress, tokenContract, tokenAddress }) => {
    //   lpContract.setProvider(lpTokenAddress)
    //   tokenContract.setProvider(tokenAddress)
    // })
  }
  setAccount(account) {
    // this.sushi.setAccount(account)
    // this.bnp.setAccount(account)
    // this.masterChef.setAccount(account)
    // this.weth.setAccount(account)
    // this.router.setAccount(account)
    // this.multicall.setAccount(account)
    // this.uniToken.setAccount(account)
    // this.sushiToken.setAccount(account)
  }
}

let web3 = window.web3

try {
  // 检查新版MetaMask
  if (window.ethereum) {
    web3 = window.ethereum;
  } else if (window.web3) {
  // 老版 MetaMask
    web3 = window.web3?.currentProvider;
  } else {
  // 如果没有注入的web3实例，回退到使用 Ganache
    web3 = new Web3.providers.HttpProvider(config.provider);
  }
} catch (error) {
  
}

web3 = new Web3(web3)

const contract = new ContractCollect(web3, {
  defaultAccount: config.provider.selectedAddress,
  defaultConfirmations: 1,
  autoGasMultiplier: 1.5,
  testing: false,
  defaultGas: '6000000',
  defaultGasPrice: '1000000000000',
  accounts: [],
  ethereumNodeTimeout: 10000,
})

// console.log(web3)

// setTimeout(async () =>{
//   if (!window.ethereum) {
//     return
//   }
//   try {
//     console.log('try unlock')
//     // 请求用户账号授权
//     const [account, provider] = await window.ethereum.enable();
//     console.log(account, window.ethereum)
//     contract.setProvider(provider)
//     contract.setAccount(account)
//   } catch (error) {
//     // 用户拒绝了访问
//     console.error(error)
//     console.error("User denied account access")
//   }
// }, 100)

export default contract