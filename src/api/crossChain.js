// 跨链请求

import request from '@/utils/request'
import axios from 'axios'
// 存Hash
export const fnSaveHash=(data)=>{
    return request()({
        url:'/cross/record/save',
        method:'post',
        data
    })
}

// 获取资产列表

export const fnGetAssetslist=(chainId)=>{
  return request()({
    url:`/cross/tokens?src_chainid=${chainId}`,
    method:'get' 
  })
}

// 查询记录
export const fnGetchainHistory=(chainId,account)=>{
    return request()({
      url:`/cross/record/list?src_chainid=${chainId}&account=${account}`,
      method:'get' 
    })
  }

// 查询单个记录

export const fnGetOneChainHistory=(hash)=>{
    return request()({
      url:`/cross/record/info?hash=${hash}`,
      method:'get' 
    })
  }

  //  获取获取跨链支持的代币信息列表
  export const getIswapToken=()=>{
    return axios({
      url:`https://gateway.mdex.one/v3/bridge/tokens`,
      method:'get' 
    })
  }