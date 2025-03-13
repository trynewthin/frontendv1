// 导入API客户端

import { API_BASE_URL, API_TIMEOUT, logApiRequest, logApiResponse } from '../config/apiConfig';

import ApiClient from '../../apiclient/src/ApiClient';
import DefaultApi from '../../apiclient/src/api/DefaultApi';

// 创建API客户端实例
const apiClient = new ApiClient();

// 设置基础URL
apiClient.basePath = API_BASE_URL;

// 设置请求超时时间
apiClient.timeout = API_TIMEOUT;

// 请求拦截器 - 添加token到请求头
const originalCallApi = apiClient.callApi;
apiClient.callApi = function(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, callback) {
  // 从localStorage获取token
  const token = localStorage.getItem('token');
  
  // 记录请求日志
  const requestUrl = this.buildUrl(path, pathParams);
  logApiRequest(httpMethod, requestUrl, { 
    queryParams, 
    bodyParam, 
    headerParams
  });
  
  if (token) {
    // 根据Sa-Token的配置，token名称为 'Authorization'
    headerParams['Authorization'] = token;
  }
  
  // 调用原始的callApi方法
  return originalCallApi.call(this, path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, callback)
    .then(result => {
      // 记录成功响应
      logApiResponse(httpMethod, requestUrl, result);
      return result;
    })
    .catch(error => {
      // 记录错误
      logApiResponse(httpMethod, requestUrl, null, error);
      
      // 处理常见错误
      if (error.status === 401) {
        console.warn('API调用未授权，可能需要重新登录');
        // 清除失效的Token
        localStorage.removeItem('token');
      } else if (error.status === 403) {
        console.warn('API调用被拒绝，权限不足');
      } else if (error.status === 404) {
        console.warn('API路径不存在:', path);
      } else if (!error.status) {
        console.error('网络错误，可能是CORS问题或API服务不可用');
      }
      
      // 继续传递错误
      throw error;
    });
};

// 创建API实例
const api = new DefaultApi(apiClient);

// 导出API客户端和实例
export { apiClient, api }; 