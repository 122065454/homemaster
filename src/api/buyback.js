import request from '@/utils/request'

const Base_url = 'https://burn.mdex.cc/v2/'

// 创建一个新的axios实例
const buyBackRequest = request(Base_url)

// 获取回购销毁信息
export const  getRepechInfo=(params)=>{
    return buyBackRequest({
        url:'repurch/info',
        method:'get',
        params
    }) 
}
// 获取当前总数
export const getDatenums=(params)=>{
    return buyBackRequest({
        url:'repurch/index',
        method:'get',
        params
    }) 
}
// 获取燃烧池记录
export const getRscinfo=(params)=>{
    return buyBackRequest({
        url:'destroy/info',
        method:'get',
        params
    }) 
}

// 获取地址列表
export const getListInfo=(params)=>{
    return buyBackRequest({
        url:'repurch/records',
        method:'get',
        params
    }) 
}
// 获取salt
export const getSalt=(params)=>{
    return buyBackRequest({
        url:'repurch/blocksalt',
        method:'get',
        params
    }) 
}

// 获取燃烧销毁记录
export const fnGetCombustionList = (chainId) => {
    return buyBackRequest({
      url:`/destroy/list?mdex_chainid=${chainId}`,
      method:'get'  
    })
}