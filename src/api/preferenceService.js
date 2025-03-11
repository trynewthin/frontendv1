// 导入API客户端与相关模型

import PreferenceDTO from '../../apiclient/src/model/PreferenceDTO';
import { api } from './apiService';

/**
 * 用户偏好设置服务
 * 处理用户偏好设置相关的业务逻辑
 */
class PreferenceService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取当前登录用户的偏好设置
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 获取结果
   */
  async getUserPreference() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 调用API获取用户偏好设置
      const response = await api.getUserPreference();
      console.log('获取用户偏好设置响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取用户偏好设置成功',
          data: response.data
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户偏好设置失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户偏好设置过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户偏好设置过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 更新当前登录用户的偏好设置
   * @param {Object} preferenceData 偏好设置数据
   * @param {number} [preferenceData.priceMin] 最低价格
   * @param {number} [preferenceData.priceMax] 最高价格
   * @param {string} [preferenceData.preferredBrands] 偏好品牌（多个以逗号分隔）
   * @param {string} [preferenceData.preferredCategories] 偏好车型类别（多个以逗号分隔）
   * @param {string} [preferenceData.otherPreferences] 其他偏好
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async updateUserPreference(preferenceData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证价格范围
      if (preferenceData.priceMin !== undefined && preferenceData.priceMax !== undefined) {
        if (preferenceData.priceMin > preferenceData.priceMax) {
          return {
            success: false,
            message: '最低价格不能高于最高价格',
            data: null
          };
        }
      }

      // 创建PreferenceDTO对象
      const preferenceDTO = new PreferenceDTO();
      
      // 设置要更新的字段
      if (preferenceData.priceMin !== undefined) {
        preferenceDTO.priceMin = preferenceData.priceMin;
      }
      
      if (preferenceData.priceMax !== undefined) {
        preferenceDTO.priceMax = preferenceData.priceMax;
      }
      
      if (preferenceData.preferredBrands !== undefined) {
        preferenceDTO.preferredBrands = preferenceData.preferredBrands;
      }
      
      if (preferenceData.preferredCategories !== undefined) {
        preferenceDTO.preferredCategories = preferenceData.preferredCategories;
      }
      
      if (preferenceData.otherPreferences !== undefined) {
        preferenceDTO.otherPreferences = preferenceData.otherPreferences;
      }
      
      // 调用API更新用户偏好设置
      const response = await api.updateUserPreference(preferenceDTO);
      console.log('更新用户偏好设置响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，返回数据
        return {
          success: true,
          message: response.message || '用户偏好设置更新成功',
          data: response.data
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '用户偏好设置更新失败',
        data: null
      };
    } catch (error) {
      console.error('更新用户偏好设置过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新用户偏好设置过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const preferenceService = new PreferenceService();

export default preferenceService; 