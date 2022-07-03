

//  回购销毁有关
import {getRepechInfo,getDatenums, fnGetCombustionList} from '@/api/buyback.js'



          
let timer = null
const state = {
    assetBuyData: {}, // 返回的数据
    phase: '', // 当前期 
    states: '', // 当前状态
    id:'', //   回购销毁的ID
    // 董事会-燃烧销毁
    combustionData: {
        total_destroy_mdx: '',
        total_destroy_usdt: '',
        destroy_list: []
    },
}
const mutations = {
    changeData(state, payload) {
        state.assetBuyData = payload;
    },
    // 期数改变
    changePhase(state, payload) {
        state.phase = payload;
    },
    // 更新状态
    changeState(state, payload) {
        state.states = payload
    },
    // 跟新ID
    changId(state, payload){
        state.id = payload
    },
    // 董事会-燃烧销毁
    changeCombustionData(state, payload) {
        state.combustionData = payload;
    },

}
const actions = {
    // 获取回购销毁信息
    getInfoList({ commit, dispatch, rootState }, data = {}) {
        const chainId = rootState.chainId
        const address = rootState.boardRoom.account
        
        const params = Object.assign({mdex_chainid: chainId, address}, data)
        
        const currentTime = Math.round(new Date() / 1000);
       
     
        getRepechInfo(params).then(res => {
            if (res.data.code === 0 && res.data.result) {
           
                const { result } = res.data
                console.log('result', result);
                //  存当前一期的标志 不可更改
               
                   if(result){
                    if (!data.phase) {
                        sessionStorage.setItem('phaseNow', result.phase)
                    }
                    // 更改期数
                    commit('changePhase', result.phase)
                    commit('changeData', result)
                    commit('changId', result.id)
                    // 进行初始化操
                    if (result.start_time > currentTime) {
                        // 还未开始
                        commit('changeState', 'start')
                    } else if (result.status == 1&&result.end_time >currentTime) {
                        // 进行中
                        commit('changeState', "pending")
                    } else if(result.status == 3||result.status ==2){
                        commit('changeState', "result")
                    }else{
                        commit('changeState', "nextperiod")
                    }
                   }
                 
                
            }

        })


    },
    // 获取当前的总期数
    getDateNum({ rootState }) {
        const chainId = rootState.chainId
        return getDatenums({mdex_chainid: chainId})
    },
    // 轮询
    initData({state, dispatch }) {
        clearInterval(timer);
        timer = setInterval(() => {
            if(state.states!=='pending'){
                clearInterval(timer);
                return
            }
            dispatch("getInfoList");
        }, 9000);
    },
    // 董事会-燃烧销毁
    getCombustionData ({commit, dispatch, rootState}) {
        fnGetCombustionList(rootState.chainId).then(res=>{
            if (res.data.code == 0) {
                commit("changeCombustionData", res.data.result)
            }
        })
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,

};
