// 首页有关的请求
import request from '@/utils/request'

const base_url = 'https://gateway.mdex.one/v2/'

// const base_url = 'http://47.107.66.145:9501/v2/'

const banner_url = 'https://api.mdex.one/'

const chart_url = 'https://market.mdex.cc/'

//获取币的价格
export const fnGetCurrencyPrice=(chainId)=>{
  return request()({
    url:`/mdex/tokens?mdex_chainid=${chainId}`,
    method:'get'  
  })
}

// 首页数据
export const fnGetHomeData=(chainId)=>{
  return request(base_url)({
      url:`/mdex/charts?mdex_chainid=${chainId}`,
      method:'get'  
    })
}

// 合并数据
export const fnGetAllChain = () => {
  return request()({
    url:`/chains/charts`,
    method:'get'  
  })
}

// banner列表
export const fnGetBannerData = (chainId) => {
  return request(banner_url)({
    url:`/v2/banner/list?chain_id=${chainId}`,
    method:'get'  
  })
}

// 黑名单
export const getBlackList = (chainId, address) => {
  return request(banner_url)({
    url:`/v2/approve/check?mdex_chainid=${chainId}&address=${address}`,
    method:'get',
  })
}

// 校验交易对是否存在
export const fnCheckSymble = (chainId, address) => {
  return request(chart_url)({
    url:`${chainId == 56 ? 'bsc' : ''}/api/v1/market/ticker?pair_token=${address}`,
    method:'get',
  })
}


