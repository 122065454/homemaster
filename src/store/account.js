// import connector from './connector'


export default {
  namespaced: true,
  state: {
    address: '',
    totalSupply: 0,
  },
  getters: {
    isLogin: state => !!state.address
  },

  actions: {
  }
}