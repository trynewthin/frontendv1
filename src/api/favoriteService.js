// 导入API客户端

import { api } from './apiService';

/**
 * 收藏管理服务
 * 处理用户对车辆的收藏操作，包括添加收藏、取消收藏、查询收藏等功能
 */
class FavoriteService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取收藏列表
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getFavoriteList(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 10
        };
      }

      // 设置默认分页参数
      const opts = {
        page: queryParams.page || 1,
        size: queryParams.size || 10
      };

      // 调用API获取收藏列表
      const response = await api.getFavoriteList(opts);
      console.log('获取收藏列表响应:', response);
      
      // 检查响应是否为空，如果为空则返回空数组（表示暂无记录）
      if (!response) {
        return {
          success: true,
          message: '暂无收藏记录',
          data: [],
          total: 0,
          page: 1,
          size: 10
        };
      }
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 适配新的数据结构
        const records = response.data?.records || [];
        
        // 将汽车数据转换为前端组件所需格式
        const formattedData = records.map(car => ({
          carId: car.carId,
          carName: `${car.brand} ${car.model}`,
          carPrice: car.price || 0,
          carImage: car.image || '/images/cars/default-car.png',
          brand: car.brand,
          model: car.model,
          favoriteTime: car.favoriteTime || new Date().toISOString()
        }));
        
        return {
          success: true,
          message: response.message || (formattedData.length > 0 ? '获取收藏列表成功' : '暂无收藏记录'),
          data: formattedData,
          total: response.data?.total || 0,
          page: response.data?.current || 1,
          size: response.data?.size || 10
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取收藏列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    } catch (error) {
      console.error('获取收藏列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取收藏列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 10
      };
    }
  }

  /**
   * 添加收藏
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string}>} 添加结果
   */
  async addFavorite(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 创建请求体
      const requestBody = {
        carId: carId
      };

      // 调用API添加收藏
      await api.addFavorite(carId, requestBody);
      console.log('添加收藏成功:', carId);
      
      return {
        success: true,
        message: '添加收藏成功'
      };
    } catch (error) {
      console.error('添加收藏过程中发生错误:', error);
      
      // 处理特定错误
      if (error.response && error.response.status === 409) {
        return {
          success: false,
          message: '该车辆已收藏'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || '添加收藏过程中发生错误'
      };
    }
  }

  /**
   * 取消收藏
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string}>} 取消结果
   */
  async removeFavorite(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空'
        };
      }

      // 调用API取消收藏
      await api.removeFavorite(carId);
      console.log('取消收藏成功:', carId);
      
      return {
        success: true,
        message: '取消收藏成功'
      };
    } catch (error) {
      console.error('取消收藏过程中发生错误:', error);
      
      // 处理特定错误
      if (error.response && error.response.status === 404) {
        return {
          success: false,
          message: '该车辆未收藏'
        };
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || '取消收藏过程中发生错误'
      };
    }
  }

  /**
   * 获取收藏数量
   * @returns {Promise<{success: boolean, message: string, count: number}>} 数量结果
   */
  async getFavoriteCount() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          count: 0
        };
      }

      // 调用API获取收藏数量
      const count = await api.getFavoriteCount();
      console.log('获取收藏数量成功:', count);
      
      return {
        success: true,
        message: '获取收藏数量成功',
        count: count || 0
      };
    } catch (error) {
      console.error('获取收藏数量过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取收藏数量过程中发生错误',
        count: 0
      };
    }
  }

  /**
   * 获取车辆被收藏数量
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, count: number}>} 数量结果
   */
  async getCarFavoriteCount(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          count: 0
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          count: 0
        };
      }

      // 调用API获取车辆被收藏数量
      const count = await api.getCarFavoriteCount(carId);
      console.log('获取车辆被收藏数量成功:', carId, count);
      
      return {
        success: true,
        message: '获取车辆被收藏数量成功',
        count: count || 0
      };
    } catch (error) {
      console.error('获取车辆被收藏数量过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取车辆被收藏数量过程中发生错误',
        count: 0
      };
    }
  }

  /**
   * 检查是否收藏
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, isFavorite: boolean}>} 检查结果
   */
  async checkIsFavorite(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          isFavorite: false
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          isFavorite: false
        };
      }

      // 调用API检查是否收藏
      const isFavorite = await api.checkIsFavorite(carId);
      console.log('检查是否收藏成功:', carId, isFavorite);
      
      return {
        success: true,
        message: '检查是否收藏成功',
        isFavorite: !!isFavorite
      };
    } catch (error) {
      console.error('检查是否收藏过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '检查是否收藏过程中发生错误',
        isFavorite: false
      };
    }
  }

  /**
   * 切换收藏状态
   * @param {number} carId 车辆ID
   * @returns {Promise<{success: boolean, message: string, isFavorite: boolean}>} 切换结果
   */
  async toggleFavorite(carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          isFavorite: false
        };
      }

      // 验证车辆ID
      if (!carId) {
        return {
          success: false,
          message: '车辆ID不能为空',
          isFavorite: false
        };
      }

      // 先检查当前收藏状态
      const checkResult = await this.checkIsFavorite(carId);
      
      if (!checkResult.success) {
        return {
          success: false,
          message: checkResult.message,
          isFavorite: false
        };
      }
      
      let result;
      
      // 根据当前状态进行反向操作
      if (checkResult.isFavorite) {
        // 如果已收藏，则取消收藏
        result = await this.removeFavorite(carId);
        return {
          success: result.success,
          message: result.success ? '取消收藏成功' : result.message,
          isFavorite: false
        };
      } else {
        // 如果未收藏，则添加收藏
        result = await this.addFavorite(carId);
        return {
          success: result.success,
          message: result.success ? '添加收藏成功' : result.message,
          isFavorite: true
        };
      }
    } catch (error) {
      console.error('切换收藏状态过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '切换收藏状态过程中发生错误',
        isFavorite: false
      };
    }
  }
}

// 创建单例实例
const favoriteService = new FavoriteService();

export default favoriteService; 