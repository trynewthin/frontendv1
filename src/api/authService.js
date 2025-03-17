// 导入API客户端与LoginDTO模型

import LoginDTO from '../../apiclient/src/model/LoginDTO';
import PasswordUpdateDTO from '../../apiclient/src/model/PasswordUpdateDTO';
import UserDTO from '../../apiclient/src/model/UserDTO';
import UserProfileDTO from '../../apiclient/src/model/UserProfileDTO';
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
              userInfo.avatar = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${userInfo.avatar}`;
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
   * 获取当前登录用户的最新资料信息并更新本地存储
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 获取结果
   */
  async fetchUserProfile() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 调用API获取用户资料
      const response = await api.getUserProfile();
      console.log('获取用户资料响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，处理返回的数据
        const userData = response.data;
        
        if (userData) {
          // 处理头像路径，转换为完整URL
          if (userData.avatar && userData.avatar.startsWith('/')) {
            userData.avatar = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${userData.avatar}`;
            console.log('头像路径已转换为:', userData.avatar);
          }
          
          // 更新本地存储的用户信息
          localStorage.setItem('userInfo', JSON.stringify(userData));
          
          return {
            success: true,
            message: '获取用户资料成功',
            data: userData
          };
        }
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户资料失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户资料过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户资料过程中发生错误',
        data: null
      };
    }
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

  /**
   * 上传用户/更新头像
   * @param {File} file 头像文件 - 支持的格式：JPG、PNG、GIF - 最大大小：2MB
   * @returns {Promise<{success: boolean, message: string, data: Object|null, avatarUrl: string|null}>} 上传结果
   */
  async uploadAvatar(file) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          avatarUrl: null
        };
      }

      // 验证文件
      if (!file) {
        return {
          success: false,
          message: '请选择要上传的头像文件',
          data: null,
          avatarUrl: null
        };
      }

      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          message: '头像文件格式不支持，请使用JPG、PNG或GIF格式',
          data: null,
          avatarUrl: null
        };
      }

      // 验证文件大小 (最大2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        return {
          success: false,
          message: '头像文件大小超过限制，最大支持2MB',
          data: null,
          avatarUrl: null
        };
      }

      // 调用API上传头像
      const response = await api.uploadAvatar(file);
      console.log('上传头像响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 上传成功，处理返回的数据
        const { data } = response;
        let avatarUrl = null;
        
        // 处理服务器可能直接返回URL字符串的情况
        if (typeof data === 'string' && data.includes('/images/avatars/')) {
          // 直接使用服务器返回的URL
          avatarUrl = data;
        }
        // 从响应中获取头像URL (对象形式)
        else if (data && data.avatarPath) {
          avatarUrl = data.avatarPath.startsWith('http') 
            ? data.avatarPath 
            : `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${data.avatarPath}`;
        }
        
        if (avatarUrl) {
          // 更新本地存储中的用户信息
          const userInfo = this.getCurrentUser();
          if (userInfo) {
            userInfo.avatar = avatarUrl;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          }
        }
        
        // 获取最新的用户资料并更新本地存储
        await this.fetchUserProfile();
        
        return {
          success: true,
          message: response.message || '头像上传成功',
          data: data,
          avatarUrl: avatarUrl
        };
      }
      
      // 上传失败
      return {
        success: false,
        message: response.message || '头像上传失败',
        data: null,
        avatarUrl: null
      };
    } catch (error) {
      console.error('上传头像过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '上传头像过程中发生错误',
        data: null,
        avatarUrl: null
      };
    }
  }

  /**
   * 更新当前登录用户的资料信息
   * @param {Object} profileData 要更新的用户资料
   * @param {string} [profileData.email] 电子邮箱
   * @param {string} [profileData.phone] 手机号
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async updateUserProfile(profileData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 获取当前用户信息
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          success: false,
          message: '无法获取当前用户信息',
          data: null
        };
      }

      // 创建UserProfileDTO对象
      const userProfileDTO = new UserProfileDTO();
      
      // 设置要更新的字段
      if (profileData.email !== undefined) {
        userProfileDTO.email = profileData.email;
      }
      
      if (profileData.phone !== undefined) {
        userProfileDTO.phone = profileData.phone;
      }
      
      // 处理头像字段 - 使用本地存储的值，并去掉前缀
      if (currentUser.avatar) {
        let avatarPath = currentUser.avatar;
        const apiImageUrl = import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090';
        
        // 去掉API图片URL前缀
        if (avatarPath.startsWith(apiImageUrl)) {
          avatarPath = avatarPath.substring(apiImageUrl.length);
        }
        
        userProfileDTO.avatar = avatarPath;
      }
      
      // 调用API更新用户资料
      const response = await api.updateUserProfile(userProfileDTO);
      console.log('更新用户资料响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，处理返回的数据
        const userData = response.data;
        
        if (userData) {
          // 处理头像路径，转换为完整URL
          if (userData.avatar && userData.avatar.startsWith('/')) {
            userData.avatar = `${import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090'}${userData.avatar}`;
          }
          
          // 更新本地存储的用户信息
          localStorage.setItem('userInfo', JSON.stringify(userData));
          
          return {
            success: true,
            message: response.message || '用户资料更新成功',
            data: userData
          };
        }
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '用户资料更新失败',
        data: null
      };
    } catch (error) {
      console.error('更新用户资料过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新用户资料过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 修改当前登录用户的密码
   * @param {string} oldPassword 旧密码
   * @param {string} newPassword 新密码
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 修改结果
   */
  async updatePassword(oldPassword, newPassword) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }
      
      // 验证参数
      if (!oldPassword || !newPassword) {
        return {
          success: false,
          message: '旧密码和新密码不能为空',
          data: null
        };
      }
      
      // 验证新密码长度（可根据实际需求调整）
      if (newPassword.length < 6) {
        return {
          success: false,
          message: '新密码长度不能少于6个字符',
          data: null
        };
      }
      
      // 创建PasswordUpdateDTO对象
      const passwordUpdateDTO = new PasswordUpdateDTO(oldPassword, newPassword);
      
      // 调用API修改密码
      const response = await api.updatePassword(passwordUpdateDTO);
      console.log('修改密码响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        return {
          success: true,
          message: response.message || '密码修改成功',
          data: response.data
        };
      }
      
      // 修改失败
      return {
        success: false,
        message: response.message || '密码修改失败',
        data: null
      };
    } catch (error) {
      console.error('修改密码过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '修改密码过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const authService = new AuthService();

export default authService; 