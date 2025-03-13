// 导入API服务

import { api } from '@/api/apiService';
import authService from '@/api/authService';

/**
 * 聊天消息服务
 * 处理聊天消息相关的操作，包括获取、格式化和过滤聊天消息
 */
class ChatMessageService {
  /**
   * 检查是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return authService.isLoggedIn();
  }
  
  /**
   * 获取当前用户ID
   * @returns {number|null} 当前用户ID
   */
  getCurrentUserId() {
    try {
      // 优先尝试从localStorage直接获取
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        // 优先使用userId字段，如果没有再尝试使用id字段
        if (userInfo && (userInfo.userId || userInfo.id)) {
          return userInfo.userId || userInfo.id;
        }
      }
      
      // 作为备选，使用authService
      const userInfoFromService = authService.getCurrentUser();
      if (userInfoFromService && (userInfoFromService.userId || userInfoFromService.id)) {
        return userInfoFromService.userId || userInfoFromService.id;
      }
      
      return null;
    } catch (err) {
      console.error('获取当前用户ID失败', err);
      return null;
    }
  }
  
  /**
   * 获取聊天记录
   * 根据接收者ID获取聊天记录，并过滤出当前用户和该接收者之间的消息
   * 
   * @param {number} receiverId 接收者ID
   * @param {Object} [options] 查询选项
   * @param {number} [options.carId] 关联车辆ID
   * @param {number} [options.page] 页码（从1开始）
   * @param {number} [options.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array, total: number, page: number, size: number, hasMore: boolean}>} 查询结果
   */
  async getChatMessages(receiverId, options = {}) {
    // 验证登录状态
    if (!this.isLoggedIn()) {
      return {
        success: false,
        message: '用户未登录',
        data: [],
        total: 0,
        page: 1,
        size: 20,
        hasMore: false
      };
    }
    
    // 验证参数
    if (!receiverId) {
      return {
        success: false,
        message: '接收者ID不能为空',
        data: [],
        total: 0,
        page: 1,
        size: 20,
        hasMore: false
      };
    }
    
    // 获取当前用户ID
    const currentUserId = this.getCurrentUserId();
    if (!currentUserId) {
      return {
        success: false,
        message: '无法获取当前用户ID',
        data: [],
        total: 0,
        page: 1,
        size: 20,
        hasMore: false
      };
    }
    
    try {
      console.log('正在获取聊天记录:', { receiverId, options });
      
      // 设置查询参数
      const queryParams = {
        carId: options.carId,
        page: options.page || 1,
        size: options.size || 20
      };
      
      // 调用API获取聊天记录
      const response = await api.getChatMessages(receiverId, queryParams);
      
      console.log('获取聊天记录响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，处理数据
        const responseData = response.data || {};
        
        // 支持两种不同的数据结构
        const messageList = responseData.list || responseData.content || [];
        const total = responseData.total || responseData.totalElements || 0;
        const page = responseData.pageNum || (responseData.number !== undefined ? responseData.number + 1 : 1);
        const size = responseData.pageSize || responseData.size || 20;
        
        // 过滤消息，只保留当前用户和接收者之间的消息
        const filteredMessages = messageList.filter(msg => {
          return (msg.fromUserId == currentUserId && msg.toUserId == receiverId) || 
                 (msg.fromUserId == receiverId && msg.toUserId == currentUserId);
        });
        
        // 计算是否有更多消息
        const hasMore = (page * size) < total;
        
        return {
          success: true,
          message: '获取聊天记录成功',
          data: filteredMessages,
          total: total,
          page: page,
          size: size,
          hasMore: hasMore
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取聊天记录失败',
        data: [],
        total: 0,
        page: 1,
        size: 20,
        hasMore: false
      };
    } catch (error) {
      console.error('获取聊天记录过程中发生错误:', error);
      return {
        success: false,
        message: error.message || '获取聊天记录过程中发生错误',
        data: [],
        total: 0,
        page: 1,
        size: 20,
        hasMore: false
      };
    }
  }
  
  /**
   * 格式化消息时间
   * @param {string} dateStr 日期字符串
   * @returns {string} 格式化后的时间字符串（HH:MM格式）
   */
  formatMessageTime(dateStr) {
    if (!dateStr) return '';
    
    try {
      const date = new Date(dateStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${hours}:${minutes}`;
    } catch (err) {
      console.error('格式化消息时间失败:', err);
      return '';
    }
  }
  
  /**
   * 根据ID检查消息是否存在
   * @param {Array} messages 消息数组
   * @param {number|string} messageId 消息ID
   * @returns {boolean} 消息是否存在
   */
  isMessageExists(messages, messageId) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return false;
    }
    
    return messages.some(msg => msg.id === messageId);
  }
  
  /**
   * 创建本地消息对象
   * @param {Object} messageData 消息数据
   * @returns {Object} 本地消息对象
   */
  createLocalMessage(messageData) {
    const currentUserId = this.getCurrentUserId();
    const userInfo = authService.getCurrentUser() || {};
    
    return {
      id: messageData.id || `local-${Date.now()}`,
      fromUserId: currentUserId,
      toUserId: messageData.receiverId,
      fromUserName: userInfo.username || userInfo.nickname || '当前用户',
      fromUserAvatar: userInfo.avatar || '/images/avatars/default.png',
      content: messageData.content || '',
      carId: messageData.carId || null,
      sendTime: new Date().toISOString(),
      read: false,
      isLocal: true,
      interactionType: "CONSULTATION"
    };
  }
}

// 创建单例实例
const chatMessageService = new ChatMessageService();

// 导出服务实例
export default chatMessageService; 