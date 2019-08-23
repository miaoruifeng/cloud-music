import axios from 'axios'

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  axios.defaults.baseURL = '/api'
} else if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = 'https://v1.itooi.cn/netease/'
}
axios.defaults.timeout = 10000

export default axios
