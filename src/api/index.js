import axios from 'axios'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // api的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true // 跨域请求是否需要携带cookie
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做一些处理，比如统一添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error) // 用于调试
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    // 根据自定义错误码判断请求是否成功
    if (res.code && res.code !== 200) {
      // 处理特定错误，例如token过期
      if (res.code === 401 || res.code === 403) {
        // 可以在这里处理登出逻辑
      }
      return Promise.reject(new Error(res.message || '未知错误'))
    } else {
      return res
    }
  },
  error => {
    console.log('请求错误: ' + error) // 用于调试
    return Promise.reject(error)
  }
)

export default service 