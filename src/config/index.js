// 生产配置
const defaultConfig = {
  // abi: {
  //   ERC20Abi: require('@/config/abi/erc20.json'),
  //   MasterChefAbi: require('@/config/abi/masterchef.json'),
  //   MasterFarmerAbi: require('@/config/abi/master_farmer.json'),
  SushiAbi: require('@/config/abi/heco/hecoMasterchef.json'),
  //   UNIV2PairAbi: require('@/config/abi/uni_v2_lp.json'),
  //   WETHAbi: require('@/config/abi/weth.json'),
  //   UNITokenAbi: require('@/config/abi/uni_token.json'), 
  //   SushiTokenAbi: require('@/config/abi/sushi_token.json'), 
  //   RouterAbi: require('@/config/abi/router.json'),
  //   MultiCallAbi: require('@/config/abi/multicall.json'),
  // },
  pools: [],
  contractAddresses: {},
  addressMap: {},
}

const evm = {
  1: 'https://mainnet.eth.aragon.network/',
  3: 'https://data-seed-pr.BSC-1-s1.binance.org:8545'
}

const MULTICALL_NETWORKS = {
  1: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  3: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  42: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  4: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  5: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e'
}

const WETH_ADDRESS = {
  1:'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  3:'0xc778417E063141139Fce010982780140Aa0cD5Ab',
  4:'0xc778417E063141139Fce010982780140Aa0cD5Ab',
  5:'0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  42:'0xd0A1E359811322d97991E03f863a0C30C2cF029C',
  128: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f'
}

const ORCAL_ADDRESS = {
  128: '0x7b4B0d9Cd226017eA3875D49196Ea63A6ea8C278'
}

const BASE_COIN = {
  128: '0xa71edc38d189767582c38a3145b5873052c3e47a'
}

const UNI_ADDRESS = {
  1: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  4: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  3: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  5: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  42: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  128: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c'
}

const heco = {
  provider: 'https://http-mainnet-node1.hecochain.com',
  networkID: 128,
  id: 'MDX',
  tokenAddress: {
    sushi: '',
    sushiv2: '0x45bf0A6c73E7115e5a8Cda005f6c68bA7CaB0588', // (no use)用来管理交易对Pair。Factory地址
    sushiAddress: '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c', // MDX 合约地址
    masterChefAddress: '0xFB03e11D93632D97a8981158A632Dd5986F5E909', // CoinChef，同Sushi的MasterChef,用户抵押和赎回LP合约，合约地址
    weth: '0x5545153ccfca01fbd7dd11c0b23ba694d9509a6f', // WHT地址
    router: '0x1f3A433C6F3678dfB61Dc1EF8a41ab92373A2374', // (no use)UniswapV2Router02同uniswap的Router，用来发起ERC20交易。Router地址
    // uniToken: '0x150b2EF884272f61a741EA74Fb63D398f4B74a03', // UNI 代币合约地址
    sushiToken: '0x92E1d0F525894539d55D7e5051A58bE4a492cE74', // (no use)SUSHI 代币合约地址
  },
  get contractAddresses() {
    return {
      sushi: this.tokenAddress.sushiAddress,
      masterChef: this.tokenAddress.masterChefAddress,
      weth: this.tokenAddress.weth,
    }
  },
  pools: require('./pool/liquidity/heco').default,
}


// let config = {
//   ...defaultConfig,
//   // ...prodConfig,
//   // ...sushiConfig,
//   // ...test2Config,
//   // ...ropsten,
//   // ...ropsten2,
//   ...ropsten3,
//   ...(__CONFIG__ || {}),
// }
// console.log(config)

let config = null

Object.defineProperty(module, 'exports', {
  get() {
    if (config) {
      return config
    }
    const conf = (window.__CONFIG__ || {})
    if (!conf.networkID) {
      conf.networkID = 128
    }
    let envConfig
    switch(conf.networkID) {
      case 128: envConfig = heco; break;
      default: envConfig = heco;break;
    }
    config = {
      ...{
        provider: evm[conf.networkID],
        networkID: conf.networkID,
      },
      ...defaultConfig,
      ...envConfig,
      ...conf,
    }
    config.tokenAddress.weth = WETH_ADDRESS[conf.networkID]
    config.tokenAddress.multiCall = MULTICALL_NETWORKS[conf.networkID]
    config.tokenAddress.uniToken = UNI_ADDRESS[conf.networkID]
    config.tokenAddress.orcal = ORCAL_ADDRESS[conf.networkID]
    config.tokenAddress.lpbase = BASE_COIN[conf.networkID]
    // console.log(config)
    return config
  }
})