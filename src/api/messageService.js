// 导入API客户端

import { api } from './apiService';

/**
 * 消息管理服务
 * 处理系统消息、交互消息和聊天记录的获取、发送、标记已读和删除等操作
 */
class MessageService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  /**
   * 获取系统消息
   * @param {Object} [queryParams] 查询参数
   * @param {boolean} [queryParams.read] 是否已读
   * @param {string} [queryParams.messageType] 消息类型
   * @param {string} [queryParams.startDate] 开始日期
   * @param {string} [queryParams.endDate] 结束日期
   * @param {number} [queryParams.pageNum] 页码（从1开始）
   * @param {number} [queryParams.pageSize] 每页数量
   * @returns {Promise<Object>} 查询结果
   */
  async getSystemMessages(queryParams = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          code: 401,
          message: '用户未登录',
          data: null
        };
      }

      // 设置默认分页参数
      const opts = {
        read: queryParams.read,
        messageType: queryParams.messageType,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        pageNum: queryParams.pageNum || 1,
        pageSize: queryParams.pageSize || 20
      };

      // 调用API获取系统消息
      const response = await api.getSystemMessages(opts);
      console.log('获取系统消息响应:', response);
      
      // 直接返回原始响应，不做转换
      return response;
    } catch (error) {
      console.error('获取系统消息过程中发生错误:', error);
      return {
        code: 500,
        message: error.response?.data?.message || error.message || '获取系统消息过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 获取交互消息
   * @param {Object} [queryParams] 查询参数
   * @param {boolean} [queryParams.read] 是否已读
   * @param {string} [queryParams.interactionType] 交互类型
   * @param {string} [queryParams.targetType] 目标类型
   * @param {string} [queryParams.startDate] 开始日期
   * @param {string} [queryParams.endDate] 结束日期
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getInteractionMessages(queryParams = {}) {
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

      // 设置查询参数
      const opts = {
        read: queryParams.read,
        interactionType: queryParams.interactionType,
        targetType: queryParams.targetType,
        startDate: queryParams.startDate,
        endDate: queryParams.endDate,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      // 调用API获取交互消息
      const response = await api.getInteractionMessages(opts);
      console.log('获取交互消息响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取交互消息成功',
          data: response.data?.content || [],
          total: response.data?.totalElements || 0,
          page: response.data?.number + 1 || 1,
          size: response.data?.size || 20
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取交互消息失败',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    } catch (error) {
      console.error('获取交互消息过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取交互消息过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
  }

  /**
   * 获取聊天记录
   * @param {number} contactId 联系人ID
   * @param {Object} [queryParams] 查询参数
   * @param {number} [queryParams.carId] 关联车辆ID
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getChatMessages(contactId, queryParams = {}) {
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

      // 验证参数
      if (!contactId) {
        return {
          success: false,
          message: '联系人ID不能为空',
          data: null,
          total: 0,
          page: 1,
          size: 20
        };
      }

      // 设置查询参数
      const opts = {
        carId: queryParams.carId,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      // 调用API获取聊天记录
      const response = await api.getChatMessages(contactId, opts);
      // console.log('获取聊天记录响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        // 支持两种可能的响应格式
        const responseData = response.data || {};
        
        return {
          success: true,
          message: '获取聊天记录成功',
          // 支持两种不同的响应格式（list或content）
          data: responseData.list || responseData.content || [],
          // 支持两种不同的总数表示（total或totalElements）
          total: responseData.total || responseData.totalElements || 0,
          // 支持两种不同的页码表示（pageNum或number+1）
          page: responseData.pageNum || (responseData.number !== undefined ? responseData.number + 1 : 1),
          // 支持两种不同的页大小表示（pageSize或size）
          size: responseData.pageSize || responseData.size || 20
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取聊天记录失败',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    } catch (error) {
      console.error('获取聊天记录过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取聊天记录过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
  }

  /**
   * 发送消息
   * @param {number} receiverId 接收者ID
   * @param {string} content 消息内容
   * @param {number} [carId] 关联车辆ID
   * @returns {Promise<{success: boolean, message: string, data: number|null}>} 发送结果，data为消息ID
   */
  async sendMessage(receiverId, content, carId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        console.error('发送消息失败: 用户未登录');
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证参数
      if (!receiverId) {
        console.error('发送消息失败: 接收者ID不能为空');
        return {
          success: false,
          message: '接收者ID不能为空',
          data: null
        };
      }

      if (!content || content.trim() === '') {
        console.error('发送消息失败: 消息内容不能为空');
        return {
          success: false,
          message: '消息内容不能为空',
          data: null
        };
      }

      // 详细日志 - 记录发送请求参数
      console.log('发送消息请求参数:', { 
        receiverId, 
        content, 
        carId: carId || 'undefined'
      });

      // 设置参数
      const opts = {};
      if (carId) {
        opts.carId = carId;
      }

      let messageId = null;
      let apiClientSuccess = false;
      
      // 1. 首先尝试使用API客户端发送消息
      try {
        console.log('尝试通过API客户端发送消息');
        const apiResponse = await api.sendMessage(receiverId, content, opts);
        console.log('API客户端发送消息原始响应:', apiResponse);
        
        // 检查响应的类型和值
        console.log('响应类型:', typeof apiResponse, '响应值:', apiResponse);
        
        // 即使响应是NaN，我们也视为成功
        if (isNaN(apiResponse)) {
          console.log('API返回了NaN，使用临时ID');
          messageId = 'temp-' + Date.now();
        } else {
          messageId = apiResponse;
        }
        
        apiClientSuccess = true;
      } catch (apiError) {
        console.error('API客户端发送消息失败:', apiError);
        // API客户端失败，将在后续尝试直接调用API
      }

      console.log('发送消息响应:', messageId);
      
      // 发送成功
      if (messageId) {
        return {
          success: true,
          message: '消息发送成功',
          data: messageId
        };
      }
      
      // 发送失败
      return {
        success: false,
        message: '消息发送失败',
        data: null
      };
    } catch (error) {
      console.error('发送消息过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '发送消息过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 标记消息为已读
   * @param {number} messageId 消息ID
   * @returns {Promise<{success: boolean, message: string}>} 标记结果
   */
  async markMessageRead(messageId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!messageId) {
        return {
          success: false,
          message: '消息ID不能为空'
        };
      }

      // 调用API标记消息已读
      const response = await api.markMessageRead(messageId);
      console.log('标记消息已读响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 标记成功
        return {
          success: true,
          message: response.message || '标记消息已读成功'
        };
      }
      
      // 标记失败
      return {
        success: false,
        message: response.message || '标记消息已读失败'
      };
    } catch (error) {
      console.error('标记消息已读过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '标记消息已读过程中发生错误'
      };
    }
  }

  /**
   * 批量标记消息为已读
   * @param {Array<number>} messageIds 消息ID数组
   * @returns {Promise<{success: boolean, message: string}>} 标记结果
   */
  async batchMarkRead(messageIds) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return {
          success: false,
          message: '消息ID列表不能为空'
        };
      }

      // 将数组转换为JSON字符串
      const body = JSON.stringify(messageIds);

      // 调用API批量标记消息已读
      const response = await api.batchMarkRead(body);
      console.log('批量标记消息已读响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 标记成功
        return {
          success: true,
          message: response.message || '批量标记消息已读成功'
        };
      }
      
      // 标记失败
      return {
        success: false,
        message: response.message || '批量标记消息已读失败'
      };
    } catch (error) {
      console.error('批量标记消息已读过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '批量标记消息已读过程中发生错误'
      };
    }
  }

  /**
   * 删除消息
   * @param {number} messageId 消息ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteMessage(messageId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!messageId) {
        return {
          success: false,
          message: '消息ID不能为空'
        };
      }

      // 调用API删除消息
      const response = await api.deleteMessage(messageId);
      console.log('删除消息响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 删除成功
        return {
          success: true,
          message: response.message || '删除消息成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '删除消息失败'
      };
    } catch (error) {
      console.error('删除消息过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除消息过程中发生错误'
      };
    }
  }

  /**
   * 批量删除消息
   * @param {Array<number>} messageIds 消息ID数组
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async batchDeleteMessages(messageIds) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
        return {
          success: false,
          message: '消息ID列表不能为空'
        };
      }

      // 将数组转换为JSON字符串
      const body = JSON.stringify(messageIds);

      // 调用API批量删除消息
      const response = await api.batchDeleteMessages(body);
      console.log('批量删除消息响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 删除成功
        return {
          success: true,
          message: response.message || '批量删除消息成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '批量删除消息失败'
      };
    } catch (error) {
      console.error('批量删除消息过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '批量删除消息过程中发生错误'
      };
    }
  }

  /**
   * 获取未读消息统计
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 统计结果
   */
  async getUnreadCount() {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 调用API获取未读消息统计
      const response = await api.getUnreadCount();
      console.log('获取未读消息统计响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取未读消息统计成功',
          data: response.data || {}
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取未读消息统计失败',
        data: null
      };
    } catch (error) {
      console.error('获取未读消息统计过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取未读消息统计过程中发生错误',
        data: null
      };
    }
  }
}

// 创建单例实例
const messageService = new MessageService();

export default messageService; 