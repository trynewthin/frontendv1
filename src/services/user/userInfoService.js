// 导入API服务

import { api } from '@/api/apiService';
import logService from '@/services/utils/logService';

/**
 * 用户信息服务
 * 处理用户信息相关的操作
 */
class UserInfoService {
  /**
   * 获取用户详细信息
   * @param {string} userId - 用户ID
   * @returns {Promise<{success: boolean, data: any, message: string}>} - 包含用户信息的响应对象
   */
  async getUserInfo(userId) {
    if (!userId) {
      console.warn('获取用户信息失败: 用户ID不能为空');
      return { success: false, message: '用户ID不能为空', data: null };
    }

    try {
      console.log('正在获取用户信息:', userId);
      const response = await api.getUserDetail(userId);
      console.log('获取用户详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功
        const userData = response.data;
        
        if (!userData) {
          console.warn('未找到该用户信息:', userId);
          return {
            success: false,
            message: '未找到该用户信息',
            data: null
          };
        }
        
        // 如果是经销商用户，确保dealerInfo字段可用
        if (userData.userType === 'DEALER' && !userData.dealerInfo) {
          console.warn('经销商用户缺少dealerInfo字段', { userId, userData });
          userData.dealerInfo = {
            dealerId: null,
            dealerName: '',
            address: '',
            businessLicense: '',
            contactPerson: '',
            contactPhone: '',
            status: null,
            description: ''
          };
        }
        
        return {
          success: true,
          message: '获取用户信息成功',
          data: userData
        };
      }
      
      // 获取失败
      console.warn('获取用户信息失败:', response.message);
      return {
        success: false,
        message: response.message || '获取用户信息失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户信息过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '获取用户信息失败',
        data: null
      };
    }
  }
  
  /**
   * 判断用户是否为经销商
   * 
   * @param {Object} userData 用户数据
   * @returns {boolean} 是否为经销商
   */
  isDealer(userData) {
    return userData && userData.userType === 'DEALER';
  }
  
  /**
   * 获取用户显示名称
   * 对于经销商用户，返回经销商名称；对于普通用户，返回用户名
   * 
   * @param {Object} userData 用户数据
   * @returns {string} 用户显示名称
   */
  getUserDisplayName(userData) {
    if (!userData) return '';
    
    if (this.isDealer(userData) && userData.dealerInfo) {
      return userData.dealerInfo.dealerName || userData.username;
    }
    
    return userData.username || '';
  }
  
  /**
   * 获取用户头像
   * 
   * @param {Object} userData 用户数据
   * @returns {string} 用户头像URL
   */
  getUserAvatar(userData) {
    if (!userData) return '';
    
    return userData.avatar || '';
  }
}

// 创建单例实例
const userInfoService = new UserInfoService();

// 导出服务实例
export default userInfoService; 