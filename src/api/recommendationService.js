// 导入API客户端

import { api } from './apiService';

/**
 * 推荐服务
 * 处理系统车辆推荐相关功能
 */
class RecommendationService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取偏好推荐
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.limit] 推荐数量限制，默认为10
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 推荐结果
   */
  async getPreferenceRecommendations(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 设置查询参数
      const opts = {
        limit: queryParams.limit || 10
      };

      // 调用API获取偏好推荐
      const response = await api.getPreferenceRecommendations(opts);
      console.log('获取偏好推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取偏好推荐成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取偏好推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取偏好推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取偏好推荐过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取新车推荐
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.category] 车辆类别
   * @param {number} [queryParams.limit] 推荐数量限制，默认为10
   * @param {number} [queryParams.days] 统计天数，默认为30
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 推荐结果
   */
  async getNewCarRecommendations(queryParams = {}) {
    try {
      // 设置查询参数
      const opts = {
        category: queryParams.category,
        limit: queryParams.limit || 10,
        days: queryParams.days || 30
      };

      // 调用API获取新车推荐
      const response = await api.getNewCarRecommendations(opts);
      console.log('获取新车推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取新车推荐成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取新车推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取新车推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取新车推荐过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取热门推荐
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.category] 车辆类别
   * @param {number} [queryParams.limit] 推荐数量限制，默认为10
   * @param {number} [queryParams.days] 统计天数，默认为7
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 推荐结果
   */
  async getHotRecommendations(queryParams = {}) {
    try {
      // 设置查询参数
      const opts = {
        category: queryParams.category,
        limit: queryParams.limit || 10,
        days: queryParams.days || 7
      };

      // 调用API获取热门推荐
      const response = await api.getHotRecommendations(opts);
      console.log('获取热门推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取热门推荐成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取热门推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取热门推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取热门推荐过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取首页推荐
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.limit] 推荐数量限制，默认为10
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 推荐结果
   */
  async getHomeRecommendations(queryParams = {}) {
    try {
      // 设置查询参数
      const opts = {
        limit: queryParams.limit || 10
      };

      // 调用API获取首页推荐
      const response = await api.getHomeRecommendations(opts);
      console.log('获取首页推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取首页推荐成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取首页推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取首页推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取首页推荐过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取行为推荐
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.limit] 推荐数量限制，默认为10
   * @returns {Promise<{success: boolean, message: string, data: Array|null}>} 推荐结果
   */
  async getBehaviorRecommendations(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 设置查询参数
      const opts = {
        limit: queryParams.limit || 10
      };

      // 调用API获取行为推荐
      const response = await api.getBehaviorRecommendations(opts);
      console.log('获取行为推荐响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取行为推荐成功',
          data: response.data || []
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取行为推荐失败',
        data: null
      };
    } catch (error) {
      console.error('获取行为推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取行为推荐过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取所有类型的推荐
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.limit] 每类推荐的数量限制，默认为10
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 推荐结果
   */
  async getAllRecommendations(queryParams = {}) {
    try {
      // 并行获取所有推荐数据
      const [preferenceRec, newCarRec, hotRec, homeRec, behaviorRec] = await Promise.all([
        this.getPreferenceRecommendations(queryParams),
        this.getNewCarRecommendations(queryParams),
        this.getHotRecommendations(queryParams),
        this.getHomeRecommendations(queryParams),
        this.getBehaviorRecommendations(queryParams)
      ]);

      // 整合数据
      return {
        success: true,
        message: '获取所有推荐成功',
        data: {
          preference: preferenceRec.success ? preferenceRec.data : [],
          newCar: newCarRec.success ? newCarRec.data : [],
          hot: hotRec.success ? hotRec.data : [],
          home: homeRec.success ? homeRec.data : null,
          behavior: behaviorRec.success ? behaviorRec.data : []
        }
      };
    } catch (error) {
      console.error('获取所有推荐过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '获取所有推荐过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const recommendationService = new RecommendationService();

export default recommendationService; 