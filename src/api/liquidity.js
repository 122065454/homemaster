// 流动性有关请求
import request from '@/utils/request'

const base_url = 'https://gateway.mdex.one/v3/'

// 获取apy列表
export const fnGetApyList=(chainId)=>{
  return request(base_url)({
    url:`/mingpool/lps?mdex_chainid=${chainId}`,
    method:'get'  
  })
}