// 导入API客户端

import { api } from './apiService';

/**
 * 数据统计服务
 * 处理系统各类统计数据的获取和处理
 */
class StatisticsService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 检查是否是管理员
   * @returns {boolean} 是否是管理员
   */
  isAdmin() {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return false;
    
    try {
      const user = JSON.parse(userInfo);
      return user.userType === 'ADMIN';
    } catch (e) {
      console.error('解析用户信息出错:', e);
      return false;
    }
  }

  /**
   * 获取用户统计数据
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.startDate] 起始日期(YYYY-MM-DD)
   * @param {string} [queryParams.endDate] 结束日期(YYYY-MM-DD)
   * @param {string} [queryParams.userType] 用户类型(ALL, NORMAL_USER, DEALER)，默认为ALL
   * @param {string} [queryParams.groupBy] 分组方式(DAY, WEEK, MONTH)，默认为DAY
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getUserStatistics(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null
        };
      }

      // 设置查询参数
      const opts = {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        userType: queryParams.userType || 'ALL',
        groupBy: queryParams.groupBy || 'DAY'
      };

      // 调用API获取用户统计
      const response = await api.getUserStatistics(opts);
      console.log('获取用户统计响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取用户统计成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户统计失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户统计过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户统计过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取系统统计数据
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.startDate] 起始日期(YYYY-MM-DD)
   * @param {string} [queryParams.endDate] 结束日期(YYYY-MM-DD)
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getSystemStatistics(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null
        };
      }

      // 设置查询参数
      const opts = {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate
      };

      // 调用API获取系统统计
      const response = await api.getSystemStatistics(opts);
      console.log('获取系统统计响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取系统统计成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取系统统计失败',
        data: null
      };
    } catch (error) {
      console.error('获取系统统计过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取系统统计过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取内容统计数据
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.startDate] 起始日期(YYYY-MM-DD)
   * @param {string} [queryParams.endDate] 结束日期(YYYY-MM-DD)
   * @param {string} [queryParams.contentType] 内容类型(ALL, CAR, ARTICLE, COMMENT)，默认为ALL
   * @param {string} [queryParams.groupBy] 分组方式(DAY, WEEK, MONTH)，默认为DAY
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getContentStatistics(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null
        };
      }

      // 设置查询参数
      const opts = {
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        contentType: queryParams.contentType || 'ALL',
        groupBy: queryParams.groupBy || 'DAY'
      };

      // 调用API获取内容统计
      const response = await api.getContentStatistics(opts);
      console.log('获取内容统计响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取内容统计成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取内容统计失败',
        data: null
      };
    } catch (error) {
      console.error('获取内容统计过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取内容统计过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取所有统计数据（用户、系统、内容）
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.startDate] 起始日期(YYYY-MM-DD)
   * @param {string} [queryParams.endDate] 结束日期(YYYY-MM-DD)
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getAllStatistics(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null
        };
      }

      // 并行获取所有统计数据
      const [userStats, systemStats, contentStats] = await Promise.all([
        this.getUserStatistics(queryParams),
        this.getSystemStatistics(queryParams),
        this.getContentStatistics(queryParams)
      ]);

      // 检查是否所有请求都成功
      if (userStats.success && systemStats.success && contentStats.success) {
        // 整合数据
        return {
          success: true,
          message: '获取所有统计数据成功',
          data: {
            user: userStats.data,
            system: systemStats.data,
            content: contentStats.data
          }
        };
      }
      
      // 至少有一个请求失败
      let failedRequests = [];
      if (!userStats.success) failedRequests.push('用户统计');
      if (!systemStats.success) failedRequests.push('系统统计');
      if (!contentStats.success) failedRequests.push('内容统计');
      
      return {
        success: false,
        message: `获取统计数据部分失败：${failedRequests.join('、')}`,
        data: {
          user: userStats.success ? userStats.data : null,
          system: systemStats.success ? systemStats.data : null,
          content: contentStats.success ? contentStats.data : null
        }
      };
    } catch (error) {
      console.error('获取所有统计数据过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '获取所有统计数据过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const statisticsService = new StatisticsService();

export default statisticsService; 