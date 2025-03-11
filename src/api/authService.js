// 导入API客户端与LoginDTO模型

import LoginDTO from '../../apiclient/src/model/LoginDTO';
import UserDTO from '../../apiclient/src/model/UserDTO';
import { api } from './apiService';

/**
 * 登录服务
 * 处理用户登录相关的业务逻辑
 */
class AuthService {
  /**
   * 用户登录
   * @param {string} loginIdentity - 登录标识（邮箱或手机号）
   * @param {string} password - 密码
   * @param {string} loginType - 登录类型（'phone'或'email'，大小写敏感）
   * @returns {Promise<{success: boolean, message: string, data: any, token: string}>} 登录结果
   */
  async login(loginIdentity, password, loginType) {
    try {
      // 验证必填参数
      if (!loginIdentity || !password) {
        return {
          success: false,
          message: '用户名和密码不能为空',
          data: null,
          token: null
        };
      }
      
      // 验证登录类型（必填且大小写敏感）
      if (!loginType) {
        return {
          success: false,
          message: '登录类型不能为空',
          data: null,
          token: ''
        };
      }
      
      if (loginType !== 'phone' && loginType !== 'email') {
        return {
          success: false,
          message: '登录类型必须是"phone"或"email"',
          data: null,
          token: ''
        };
      }
      
      // 创建登录DTO对象
      const loginDTO = new LoginDTO(loginIdentity, password);
      
      // 设置登录类型
      loginDTO['loginType'] = loginType;
      
      // 调用API执行登录
      const response = await api.login(loginDTO);
      
      console.log('登录响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) { // 通常0或200表示成功
        // 登录成功，处理返回的数据
        const { data } = response;
        
        // 根据实际返回数据结构处理token和用户信息
        if (data) {
          // 保存用户信息
          if (data.user) {
            // 处理头像路径，转换为完整URL
            const userInfo = { ...data.user };
            if (userInfo.avatar && userInfo.avatar.startsWith('/')) {
              userInfo.avatar = `http://localhost:8090${userInfo.avatar}`;
              console.log('头像路径已转换为:', userInfo.avatar);
            }
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          }
          
          // 保存token
          let token = '';
          if (data.tokenInfo && data.tokenInfo.tokenValue) {
            token = data.tokenInfo.tokenValue;
            
            // 保存完整的token值，包括可能的前缀
            const tokenName = data.tokenInfo.tokenName || 'Authorization';
            localStorage.setItem('token', token);
            localStorage.setItem('tokenName', tokenName);
          } else if (data.token) {
            // 兼容直接返回token字段的情况
            token = data.token;
            localStorage.setItem('token', token);
          }
          
          return {
            success: true,
            message: response.message || '登录成功',
            data: data,
            token: token
          };
        }
      }
      
      // 登录失败
      return {
        success: false,
        message: response.message || '登录失败',
        data: null,
        token: null
      };
    } catch (error) {
      // 处理异常
      console.error('登录过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '登录过程中发生错误',
        data: null,
        token: null
      };
    }
  }
  
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  
  /**
   * 注销登录
   * @returns {Promise<{success: boolean, message: string}>} 注销结果
   */
  async logout() {
    try {
      // 调用API执行注销
      const response = await api.logout();
      
      // 无论服务器响应如何，都清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('tokenName');
      localStorage.removeItem('userInfo');
      
      return {
        success: true,
        message: response?.message || '注销成功'
      };
    } catch (error) {
      console.error('注销过程中发生错误:', error);
      
      // 即使API调用失败，也要清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('tokenName');
      localStorage.removeItem('userInfo');
      
      return {
        success: false,
        message: error.message || '注销过程中发生错误，但已清除本地登录状态'
      };
    }
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
   * 用户注册
   * @param {Object} userData 用户注册数据
   * @param {string} userData.username 用户名
   * @param {string} userData.password 密码
   * @param {string} userData.email 电子邮箱
   * @param {string} userData.phone 手机号(可选)
   * @param {string} userData.userType 用户类型(NORMAL_USER或DEALER)
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 注册结果
   */
  async register(userData) {
    try {
      // 验证输入格式
      if (!userData.username || !userData.password || !userData.email || !userData.userType) {
        return {
          success: false,
          message: '请填写所有必填字段(用户名、密码、电子邮箱和用户类型)',
          data: null
        };
      }

      // 验证用户类型是否有效
      if (userData.userType !== 'NORMAL_USER' && userData.userType !== 'DEALER') {
        return {
          success: false,
          message: '用户类型必须是普通用户(NORMAL_USER)或经销商(DEALER)',
          data: null
        };
      }
      
      // 创建UserDTO实例
      const userDTO = new UserDTO(
        userData.username,
        userData.password,
        userData.email,
        userData.userType
      );
      
      // 如果有电话号码，添加到DTO
      if (userData.phone) {
        userDTO.phone = userData.phone;
      }
      
      // 调用注册API
      const response = await api.register(userDTO);
      console.log('注册响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        return {
          success: true,
          message: response.message || '注册成功',
          data: response.data
        };
      }
      
      // 注册失败
      return {
        success: false,
        message: response.message || '注册失败',
        data: null
      };
    } catch (error) {
      console.error('注册过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '注册过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const authService = new AuthService();

export default authService; 