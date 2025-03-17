/**
 * API配置
 * 用于集中管理API基础URL和其他配置
 */

// API基础URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// 图片服务器地址
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || '';

// API请求超时时间（毫秒）
export const API_TIMEOUT = 30000;

// 是否在调试模式下
export const IS_DEBUG = import.meta.env.MODE === 'development';

// 调试工具 - 打印API请求信息
export const logApiRequest = (method, url, data) => {
  if (!IS_DEBUG) return;
  console.group(`%c${method} ${url}`, 'color: #1890ff; font-weight: bold;');
  if (data) console.log('请求数据:', data);
  console.groupEnd();
};

// 调试工具 - 打印API响应信息
export const logApiResponse = (method, url, response, error = null) => {
  if (!IS_DEBUG) return;
  if (error) {
    console.group(`%c${method} ${url} [失败]`, 'color: #f5222d; font-weight: bold;');
    console.error('错误:', error);
  } else {
    console.group(`%c${method} ${url} [成功]`, 'color: #52c41a; font-weight: bold;');
    console.log('响应数据:', response);
  }
  console.groupEnd();
}; 