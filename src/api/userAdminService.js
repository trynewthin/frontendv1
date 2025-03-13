// 导入API客户端和相关模型

import UserStatusDTO from '../../apiclient/src/model/UserStatusDTO';
import { api } from './apiService';

/**
 * 用户管理服务 - 管理员功能
 * 处理系统管理员对用户的管理操作
 */
class UserAdminService {
  /**
   * 检查是否已登录
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
      // 同时检查role和userType字段，支持两种可能的管理员标识方式
      return (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') || 
             (user.userType === 'ADMIN');
    } catch (e) {
      console.error('解析用户信息出错:', e);
      return false;
    }
  }

  /**
   * 获取用户列表
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.keyword] 关键词（用户名、邮箱或手机号）
   * @param {string} [queryParams.status] 用户状态（ACTIVE、INACTIVE）
   * @param {string} [queryParams.userType] 用户类型（NORMAL_USER、DEALER）
   * @param {string} [queryParams.startDate] 注册起始日期
   * @param {string} [queryParams.endDate] 注册结束日期
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getUserList(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 20
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null,
          total: 0,
          page: 1,
          size: 20
        };
      }

      // 设置默认分页参数
      const opts = {
        keyword: queryParams.keyword,
        status: queryParams.status === 'ACTIVE' ? '1' : queryParams.status === 'INACTIVE' ? '0' : queryParams.status,
        userType: queryParams.userType,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      // 调用API获取用户列表
      const response = await api.getUserList(opts);
      console.log('获取用户列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，处理返回数据结构转换
        const apiData = response.data || {};
        
        // 将API返回的数据转换为前端期望的格式
        const processedUsers = (apiData.list || []).map(user => {
          return {
            id: user.userId,
            username: user.username,
            email: user.email,
            phone: user.phone,
            userType: user.userType,
            registerTime: user.registerTime,
            lastLoginTime: user.lastLoginTime,
            status: user.status === 1 ? 'ACTIVE' : 'INACTIVE',
            avatar: user.avatar
          };
        });
        
        return {
          success: true,
          message: '获取用户列表成功',
          data: processedUsers,
          total: apiData.total || 0,
          page: apiData.pageNum || queryParams.page || 1,
          size: apiData.pageSize || queryParams.size || 20
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    } catch (error) {
      console.error('获取用户列表过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
  }

  /**
   * 获取用户详情
   * @param {number} userId 用户ID
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 查询结果
   */
  async getUserDetail(userId) {
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

      // 验证参数
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空',
          data: null
        };
      }

      // 调用API获取用户详情
      const response = await api.getUserDetail(userId);
      console.log('获取用户详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取用户详情成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户详情失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户详情过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取用户详情（不需要管理员权限）
   * 适用于获取当前登录用户或经销商自己的信息
   * @param {number} userId 用户ID
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 查询结果
   */
  async getUserDetailNoAuth(userId) {
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
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空',
          data: null
        };
      }

      // 调用API获取用户详情
      const response = await api.getUserDetail(userId);
      console.log('获取用户详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取用户详情成功',
          data: response.data || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取用户详情失败',
        data: null
      };
    } catch (error) {
      console.error('获取用户详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取用户详情过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 更新用户状态（启用/禁用）
   * @param {number} userId 用户ID
   * @param {string} status 状态（ACTIVE、INACTIVE）
   * @param {string} [reason] 状态变更原因（禁用时需要提供）
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 更新结果
   */
  async updateUserStatus(userId, status, reason = '') {
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

      // 验证参数
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空',
          data: null
        };
      }

      if (!status) {
        return {
          success: false,
          message: '用户状态不能为空',
          data: null
        };
      }

      // 验证状态值
      if (status !== 'ACTIVE' && status !== 'INACTIVE') {
        return {
          success: false,
          message: '用户状态值无效，必须为ACTIVE或INACTIVE',
          data: null
        };
      }

      // 如果状态为INACTIVE，检查是否提供了原因
      if (status === 'INACTIVE' && !reason) {
        return {
          success: false,
          message: '禁用用户时必须提供原因',
          data: null
        };
      }

      // 将前端状态值转换为API期望的值
      const apiStatus = status === 'ACTIVE' ? 1 : 0;
      
      // 创建状态DTO对象
      const userStatusDTO = {
        status: apiStatus,
        reason: reason || ''
      };

      // 调用API更新用户状态
      const response = await api.updateUserStatus(userId, userStatusDTO);
      console.log('更新用户状态响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 更新成功，返回数据
        return {
          success: true,
          message: response.message || `用户状态已更新为${status === 'ACTIVE' ? '启用' : '禁用'}`,
          data: response.data || null
        };
      }
      
      // 更新失败
      return {
        success: false,
        message: response.message || '更新用户状态失败',
        data: null
      };
    } catch (error) {
      console.error('更新用户状态过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '更新用户状态过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 重置用户密码
   * @param {number} userId 用户ID
   * @param {boolean} [notifyUser=true] 是否通知用户
   * @returns {Promise<{success: boolean, message: string, data: Object|null, newPassword: string|null}>} 重置结果
   */
  async resetUserPassword(userId, notifyUser = true) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null,
          newPassword: null
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限',
          data: null,
          newPassword: null
        };
      }

      // 验证参数
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空',
          data: null,
          newPassword: null
        };
      }

      // 设置查询参数
      const opts = {
        notifyUser: notifyUser
      };

      // 调用API重置用户密码
      const response = await api.resetUserPassword(userId, opts);
      console.log('重置用户密码响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 重置成功，处理返回数据
        let newPassword = null;
        if (response.data && response.data.newPassword) {
          newPassword = response.data.newPassword;
        }
        
        return {
          success: true,
          message: response.message || '用户密码重置成功',
          data: response.data || null,
          newPassword: newPassword
        };
      }
      
      // 重置失败
      return {
        success: false,
        message: response.message || '重置用户密码失败',
        data: null,
        newPassword: null
      };
    } catch (error) {
      console.error('重置用户密码过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '重置用户密码过程中发生错误',
        data: null,
        newPassword: null
      };
    }
  }

  /**
   * 删除用户
   * @param {number} userId 用户ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteUser(userId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 检查是否具有管理员权限
      if (!this.isAdmin()) {
        return {
          success: false,
          message: '无管理员权限'
        };
      }

      // 验证参数
      if (!userId) {
        return {
          success: false,
          message: '用户ID不能为空'
        };
      }

      // 调用API删除用户
      const response = await api.deleteUser(userId);
      console.log('删除用户响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 删除成功
        return {
          success: true,
          message: response.message || '用户删除成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '删除用户失败'
      };
    } catch (error) {
      console.error('删除用户过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除用户过程中发生错误'
      };
    }
  }
}

// 创建单例实例
const userAdminService = new UserAdminService();

export default userAdminService; 