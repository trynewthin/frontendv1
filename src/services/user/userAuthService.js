/**
 * 用户认证服务
 * 提供用户登录状态检查功能
 */

import { api } from '../../api/apiService';

/**
 * 用户认证服务类
 */
class UserAuthService {
  /**
   * 检查用户是否已登录
   * 首先检查本地存储，如果有token则通过API验证登录状态
   * @param {boolean} [validateWithApi=false] - 是否通过API验证登录状态
   * @returns {Promise<boolean>|boolean} 如果validateWithApi为true，返回Promise<boolean>；否则返回boolean
   */
  isLoggedIn() {
    // 检查本地存储
    const hasToken = !!localStorage.getItem('token');
    
    // 如果本地没有token或不需要API验证，直接返回结果
    if (!hasToken) {
      return hasToken;
    }
    
    // 通过API验证登录状态
    return this.validateWithApi();
  }
  
  /**
   * 通过API验证登录状态
   * @private
   * @returns {Promise<boolean>} 是否已登录
   */
  async validateWithApi() {
    try {
      // 调用API获取用户资料
      const response = await api.getUserProfile();
      
      // 如果返回码为401，表示未登录或登录已过期
      if (response.code === 401) {
        // 清除本地存储的登录信息
        this.clearLoginInfo();
        return false;
      }
      
      // 如果返回码为200或0，表示已登录
      return (response.code === 200 || response.code === 0);
    } catch (error) {
      console.error('验证登录状态过程中发生错误:', error);
      
      // 如果是401错误，清除本地登录信息
      if (error.response && error.response.status === 401) {
        this.clearLoginInfo();
      }
      
      return false;
    }
  }
  
  /**
   * 清除本地存储的登录信息
   * @private
   */
  clearLoginInfo() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenName');
    localStorage.removeItem('userInfo');
  }

  /**
   * 获取当前登录用户信息
   * @returns {Object|null} 用户信息
   */
  getCurrentUser() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  }

  /**
   * 获取用户Token
   * @returns {string|null} 用户Token
   */
  getToken() {
    return localStorage.getItem('token');
  }
}

// 创建单例实例
const userAuthService = new UserAuthService();

export default userAuthService; 