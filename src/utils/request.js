import axios from "axios";
import { API_URL } from '@/utils/'

// 创建一个新的axios实例
const request = (incomingUrl) => {
    const baseURL = incomingUrl ? incomingUrl : API_URL
    return axios.create({ baseURL })
}
export default request