
// 董事会有关请求
import request from '@/utils/request'

const base_url = 'https://gateway.mdex.one/v3/'

// const base_url = 'http://172.16.1.13:9501/v3/'

// 获取回购销毁记录
export const fnGetDestroyList=(chainId)=>{
  return request()({
    url:`/boardroom/repurch/list?mdex_chainid=${chainId}`,
    method:'get'  
  })
}

// 获取董事会列表
export const fnGetBoardroomList =(chainId)=>{
  return request(base_url)({
    url:`/boardroom/pools?mdex_chainid=${chainId}`,
    method:'get'  
  })
}
