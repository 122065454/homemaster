// 奖励
import request from '@/utils/request'

export const fnGetTradeList=(chainId)=>{
    return request()({
      url:`/mingpool/swap?mdex_chainid=${chainId}`,
      method:'get'  
    })
  }