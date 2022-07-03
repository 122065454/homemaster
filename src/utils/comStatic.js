// 多语言标识列表
const langSignList = ['zh-CN', 'en', 'zh-HK', 'jp', 'tur', 'kr', 'ru', 'nl', 'th', 'es', 'vi', 'pt', 'tl', 'it', 'ina', 'fa']

// 链信息列表
const chainInfoList = { 
  128: { name: 'Heco', label:'HECO'},
  56: { name: 'Bsc', label:'BSC'}, 
  1: { name: 'Eth', label:'ETH'}
}

// 回购销毁币种列表
const buyBackList = {
  1: 'MDX',
  2: 'HMDX',
  3: 'XMDX'
}

// 销毁的合约地址
const destroyAdrList = {
  Heco: '0xf21880CAD3De9bd4Bd06bcb5E787749Ecd1884FE',
  Bsc: '0xf21880CAD3De9bd4Bd06bcb5E787749Ecd1884FE'
}

// mdx交易合约地址
const mdxTradeAdrList = {
  Heco: '0x615e6285c5944540fd8bd921c9c8c56739fd1e13',
  Bsc: '0xe1cbe92b5375ee6afe1b22b555d257b4357f6c68'
}

// 平台列表(应用于双挖)
const platformList = {
  mdx: 'MDEX',
  cow: 'CoinWind'
}

// 锁仓权重设置
const weightList = {
  0: {time: 0, interval: 0},
  1: {time: 30, interval: 4},
  2: {time: 90, interval: 8},
  3: {time: 180, interval: 10},
  4: {time: 365, interval: 12},
}

// 转译链
const transferChainList = {
  '0x1': 1,
  '0x80': 128,
  '0x38': 56
} 

export {
  transferChainList,
  mdxTradeAdrList,
  destroyAdrList,
  chainInfoList,
  platformList,
  langSignList,
  buyBackList,
  weightList
}
