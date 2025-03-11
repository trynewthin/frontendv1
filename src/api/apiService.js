// 导入API客户端

import ApiClient from '../../apiclient/src/ApiClient';
import DefaultApi from '../../apiclient/src/api/DefaultApi';

// 创建API客户端实例
const apiClient = new ApiClient();

// 设置基础URL (可从环境变量获取)
apiClient.basePath = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// 请求拦截器 - 添加token到请求头
const originalCallApi = apiClient.callApi;
apiClient.callApi = function(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, callback) {
  // 从localStorage获取token
  const token = localStorage.getItem('token');
  if (token) {
    headerParams['Authorization'] = token;
  }
  
  // 调用原始的callApi方法
  return originalCallApi.call(this, path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, callback);
};

// 创建API实例
const api = new DefaultApi(apiClient);

// 导出API客户端和实例
export { apiClient, api }; 