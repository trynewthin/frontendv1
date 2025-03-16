/**
 * 用户统计服务
 * 提供管理员后台的用户统计数据接口
 */

import axiosInstance from '../axios/axiosApiService';

/**
 * 获取用户统计数据
 * @param {Object} params 查询参数
 * @param {string} [params.startDate] 起始日期，格式：YYYY-MM-DD
 * @param {string} [params.endDate] 结束日期，格式：YYYY-MM-DD
 * @param {string} [params.userType='ALL'] 用户类型，默认为全部
 * @param {string} [params.groupBy='DAY'] 分组方式，可选值：DAY, WEEK, MONTH
 * @returns {Promise<Object>} 统计数据结果
 */
export const getUserStatistics = async (params = {}) => {
  try {
    // 设置默认参数
    const defaultParams = {
      userType: 'ALL',
      groupBy: 'DAY'
    };
    
    // 合并参数
    const queryParams = { ...defaultParams, ...params };
    
    // 发起请求
    const response = await axiosInstance.get('/admin/statistics/users', { 
      params: queryParams 
    });
    
    return response;
  } catch (error) {
    console.error('获取用户统计数据失败:', error);
    // 返回错误对象
    return {
      code: error.response?.status || 500,
      message: error.message || '获取用户统计数据失败',
      data: null
    };
  }
};

/**
 * 用户统计服务对象
 */
const userStatisticsService = {
  getUserStatistics
};

export default userStatisticsService; 