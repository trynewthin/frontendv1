// 导入API服务

import { api } from '@/api/apiService';
import logService from '@/services/utils/logService';

/**
 * 经销商用户服务
 * 处理经销商用户相关的操作
 */
class DealerUserService {
  /**
   * 获取经销商用户ID
   * 登录时调用，根据经销商ID获取经销商的用户ID
   * 
   * @param {number} dealerId 经销商ID
   * @returns {Promise<{success: boolean, message: string, userId: string|null}>} 经销商用户ID
   */
  async getDealerUserId(dealerId) {
    try {
      // 验证参数
      if (!dealerId) {
        logService.warn('获取经销商用户ID失败: 经销商ID不能为空');
        return {
          success: false,
          message: '经销商ID不能为空',
          userId: null
        };
      }

      // 记录请求
      logService.info('获取经销商用户ID请求参数:', { dealerId });

      // 调用API获取经销商详情
      const response = await api.getDealerDetail(dealerId);
      logService.info('获取经销商详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，只返回用户ID
        const dealerData = response.data;
        const userId = dealerData?.userId;
        
        if (!userId) {
          return {
            success: false,
            message: '该经销商未关联用户ID',
            userId: null
          };
        }
        
        return {
          success: true,
          message: '获取经销商用户ID成功',
          userId: userId
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取经销商详情失败',
        userId: null
      };
    } catch (error) {
      logService.error('获取经销商用户ID过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取经销商用户ID过程中发生错误',
        userId: null
      };
    }
  }

  /**
   * 获取经销商联系人信息
   * 根据经销商ID获取经销商的联系人信息
   * 
   * @param {number} dealerId 经销商ID
   * @returns {Promise<{success: boolean, message: string, contactPerson: string|null, contactPhone: string|null}>} 经销商联系人信息
   */
  async getDealerContactPerson(dealerId) {
    try {
      // 验证参数
      if (!dealerId) {
        logService.warn('获取经销商联系人失败: 经销商ID不能为空');
        return {
          success: false,
          message: '经销商ID不能为空',
          contactPerson: null,
          contactPhone: null
        };
      }

      // 记录请求
      logService.info('获取经销商联系人请求参数:', { dealerId });

      // 调用API获取经销商详情
      const response = await api.getDealerDetail(dealerId);
      logService.info('获取经销商详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，提取联系人信息
        const dealerData = response.data;
        const contactPerson = dealerData?.contactPerson;
        const contactPhone = dealerData?.contactPhone;
        
        if (!contactPerson) {
          return {
            success: false,
            message: '该经销商未设置联系人',
            contactPerson: null,
            contactPhone: null
          };
        }
        
        return {
          success: true,
          message: '获取经销商联系人成功',
          contactPerson: contactPerson,
          contactPhone: contactPhone || null
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取经销商详情失败',
        contactPerson: null,
        contactPhone: null
      };
    } catch (error) {
      logService.error('获取经销商联系人过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取经销商联系人过程中发生错误',
        contactPerson: null,
        contactPhone: null
      };
    }
  }
}

// 创建单例实例
const dealerUserService = new DealerUserService();

// 导出服务实例
export default dealerUserService; 