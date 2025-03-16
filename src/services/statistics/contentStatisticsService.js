/**
 * 内容统计服务
 * 提供管理员后台的内容统计数据接口
 */

import axiosInstance from '../axios/axiosApiService';

/**
 * 获取内容统计数据
 * @param {Object} params - 请求参数
 * @param {string} [params.startDate] - 开始日期
 * @param {string} [params.endDate] - 结束日期
 * @param {string} [params.contentType='ALL'] - 内容类型
 * @param {string} [params.groupBy='DAY'] - 分组方式
 * @returns {Promise<Object>} 返回请求结果
 */
export const getContentStatistics = async (params = {}) => {
  try {
    const defaultParams = {
      contentType: 'ALL',
      groupBy: 'DAY'
    };

    const requestParams = { ...defaultParams, ...params };
    
    // 发起请求
    const response = await axiosInstance.get('/admin/statistics/content', {
      params: requestParams
    });
    
    return response;
  } catch (error) {
    console.error('获取内容统计数据失败:', error);
    // 返回错误对象
    return {
      code: error.response?.status || 500,
      message: error.message || '获取内容统计数据失败',
      data: null
    };
  }
};

/**
 * 内容统计服务对象
 */
const contentStatisticsService = {
  getContentStatistics
};

export default contentStatisticsService; 