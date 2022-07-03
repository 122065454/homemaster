import { Loading } from 'element-ui'
let loading = null
const showLoading = (params) => {
    if(loading) {
        loading.close()
    }
    let options = {
        fullscreen: false,
        target: document.querySelector('#mainLoad'),
        lock: true,
        text: 'loading...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    }
    Object.assign(
        options,
        params
    )
    loading = Loading.service(options)
}
const hideLoading = () => {
    loading.close()
}
export {
    showLoading,
    hideLoading
}
