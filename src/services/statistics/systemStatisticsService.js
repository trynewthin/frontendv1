/**
 * 系统统计服务
 * 提供管理员后台的系统统计数据接口
 */

import axiosInstance from '../axios/axiosApiService';

/**
 * 获取系统统计数据
 * @param {Object} params 查询参数
 * @param {string} [params.startDate] 起始日期，格式：YYYY-MM-DD
 * @param {string} [params.endDate] 结束日期，格式：YYYY-MM-DD
 * @returns {Promise<Object>} 统计数据结果
 */
export const getSystemStatistics = async (params = {}) => {
  try {
    // 发起请求
    const response = await axiosInstance.get('/admin/statistics/system', { 
      params: params 
    });
    
    return response;
  } catch (error) {
    console.error('获取系统统计数据失败:', error);
    // 返回错误对象
    return {
      code: error.response?.status || 500,
      message: error.message || '获取系统统计数据失败',
      data: null
    };
  }
};

/**
 * 系统统计服务对象
 */
const systemStatisticsService = {
  getSystemStatistics
};

export default systemStatisticsService; 