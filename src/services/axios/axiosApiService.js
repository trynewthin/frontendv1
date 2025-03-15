/**
 * 基于Axios的API服务
 * 用于处理新增的API请求，不影响已有的apiclient服务
 */

import { API_BASE_URL, API_TIMEOUT, logApiRequest, logApiResponse } from '../../config/apiConfig';

import axios from 'axios';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器 - 添加token和日志记录
axiosInstance.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    
    // 记录请求日志
    logApiRequest(config.method.toUpperCase(), config.url, { 
      params: config.params, 
      data: config.data
    });
    
    // 添加token到请求头
    if (token) {
      config.headers['Authorization'] = token;
    }
    
    return config;
  },
  error => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理响应和错误
axiosInstance.interceptors.response.use(
  response => {
    // 记录成功响应
    logApiResponse(response.config.method.toUpperCase(), response.config.url, response.data);
    
    // 直接返回响应数据
    return response.data;
  },
  error => {
    // 构建完整URL用于日志记录
    const url = error.config ? error.config.url : 'unknown';
    const method = error.config ? error.config.method.toUpperCase() : 'UNKNOWN';
    
    // 记录错误
    logApiResponse(method, url, null, error);
    
    // 处理常见错误
    if (error.response) {
      if (error.response.status === 401) {
        console.warn('API调用未授权，可能需要重新登录');
        // 清除失效的Token
        localStorage.removeItem('token');
      } else if (error.response.status === 403) {
        console.warn('API调用被拒绝，权限不足');
      } else if (error.response.status === 404) {
        console.warn('API路径不存在:', url);
      }
    } else if (error.request) {
      console.error('网络错误，可能是CORS问题或API服务不可用');
    } else {
      console.error('axios配置错误:', error.message);
    }
    
    // 继续传递错误
    return Promise.reject(error);
  }
);

// 导出axios实例
export default axiosInstance; 