/**
 * 消息服务
 * 处理系统消息和交互消息相关的操作
 */

import { api } from '@/api/apiService';
import authService from '@/api/authService';
import { logService } from '@/services/utils';

/**
 * 消息服务类
 * 提供获取系统消息、交互消息、标记已读和删除消息等功能
 */
class MessageService {
  /**
   * 检查用户是否已登录
   * @returns {boolean} 是否已登录
   */
  isLoggedIn() {
    return authService.isLoggedIn();
  }
  
  /**
   * 获取系统消息
   * @param {Object} params 查询参数
   * @param {number} params.pageNum 页码（从1开始）
   * @param {number} params.pageSize 每页数量
   * @returns {Promise<Object>} 包含消息列表和分页信息的响应
   */
  async getSystemMessages(params = {}) {
    logService.info('获取系统消息', params);
    
    try {
      const defaultParams = {
        pageNum: 1,
        pageSize: 20
      };
      
      const queryParams = { ...defaultParams, ...params };
      
      const response = await api.getSystemMessages(queryParams);
      
      logService.info('获取系统消息响应', response);
      
      // 转换响应格式为统一格式
      const formattedResponse = {
        success: response.code === 200,
        message: response.message || '',
        data: response.data?.list || [],
        total: response.data?.total || 0,
        hasMore: response.data?.pages > response.data?.pageNum
      };
      
      return formattedResponse;
    } catch (error) {
      logService.error('获取系统消息异常', error);
      return {
        success: false,
        message: `获取系统消息异常: ${error.message || '未知错误'}`,
        data: [],
        total: 0,
        hasMore: false
      };
    }
  }
  
  /**
   * 处理头像URL，确保以正确的基础URL开头
   * @param {string} url 原始头像URL
   * @returns {string} 处理后的完整头像URL
   */
  formatAvatarUrl(url) {
    if (!url) return 'http://localhost:8090/images/avatars/default.png';
    
    // 如果已经是完整URL，直接返回
    if (url.startsWith('http')) return url;
    
    // 否则添加基础URL
    return `http://localhost:8090${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  /**
   * 处理系统消息数据，统一格式以便在UI中显示
   * @param {Array} messages 系统消息数组
   * @param {number|string} currentUserId 当前用户ID
   * @returns {Array} 格式化后的系统消息数组
   */
  formatSystemMessages(messages, currentUserId) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return [];
    }
    
    return messages.map(msg => ({
      id: msg.id,
      fromUserId: msg.fromUserId || 'system',
      toUserId: msg.toUserId || currentUserId,
      fromUserName: msg.fromUserName || '系统通知',
      fromUserAvatar: this.formatAvatarUrl(msg.fromUserAvatar || ''),
      title: msg.title || '',
      content: msg.content || msg.message || '',
      sendTime: msg.sendTime || msg.createTime || new Date().toISOString(),
      read: msg.read || false,
      messageType: msg.messageType || 'SYSTEM',
      isSystemMessage: true
    }));
  }
  
  /**
   * 按发送者ID对消息进行分组
   * @param {Array} messages 消息数组
   * @param {number|string} currentUserId 当前用户ID
   * @returns {Map} 按发送者ID分组的消息Map
   */
  groupMessagesBySender(messages, currentUserId) {
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Map();
    }
    
    const sendersMap = new Map();
    
    // 处理所有消息，按发送者ID分组
    messages.forEach(msg => {
      // 确定消息的发送者和接收者
      const isFromCurrentUser = msg.fromUserId === currentUserId;
      const senderId = isFromCurrentUser ? msg.toUserId : msg.fromUserId;
      const isSystemMessage = msg.isSystemMessage || msg.messageType === 'SYSTEM' || 
                             msg.messageType === 'NOTICE' || msg.messageType === 'MARKETING';
      
      // 如果是系统消息，使用fromUserId作为发送者ID
      const finalSenderId = isSystemMessage ? msg.fromUserId : senderId;
      
      if (!sendersMap.has(finalSenderId)) {
        // 创建新的发送者项
        sendersMap.set(finalSenderId, {
          userId: finalSenderId,
          name: isFromCurrentUser ? msg.toUserName : msg.fromUserName || `用户 #${finalSenderId}`,
          avatar: this.formatAvatarUrl(isFromCurrentUser ? msg.toUserAvatar : msg.fromUserAvatar || null),
          messages: [msg],
          lastMessage: msg.title ? `${msg.title}: ${msg.content}` : msg.content,
          lastTime: msg.sendTime || msg.createTime,
          unreadCount: msg.read ? 0 : (isFromCurrentUser ? 0 : 1),
          isSystem: isSystemMessage
        });
      } else {
        // 更新已有发送者信息
        const sender = sendersMap.get(finalSenderId);
        sender.messages.push(msg);
        
        // 更新最后一条消息和时间
        const msgTime = new Date(msg.sendTime || msg.createTime);
        const lastTime = new Date(sender.lastTime);
        
        if (msgTime > lastTime) {
          sender.lastMessage = msg.title ? `${msg.title}: ${msg.content}` : msg.content;
          sender.lastTime = msg.sendTime || msg.createTime;
        }
        
        // 计算未读消息数量（只计算接收到的未读消息）
        if (!msg.read && !isFromCurrentUser) {
          sender.unreadCount++;
        }
      }
    });
    
    return sendersMap;
  }
  
  /**
   * 获取所有消息并按发送者分组
   * 此方法将同时获取系统消息和交互消息，并合并处理
   * @param {Object} params 查询参数
   * @returns {Promise<Object>} 包含发送者列表的响应
   */
  async getAllMessagesGroupedBySender(params = {}) {
    logService.info('获取所有消息并按发送者分组', params);
    
    try {
      // 获取当前用户ID
      const currentUserId = this.getCurrentUserId();
      if (!currentUserId) {
        logService.warn('获取消息失败: 用户未登录');
        return {
          success: false,
          message: '用户未登录',
          senders: []
        };
      }
      
      // 并行获取交互消息和系统消息
      const [interactionResponse, systemResponse] = await Promise.allSettled([
        this.getInteractionMessages(params),
        this.getSystemMessages(params)
      ]);
      
      // 处理交互消息
      const interactionMessages = interactionResponse.status === 'fulfilled' && 
                                interactionResponse.value.success ? 
                                interactionResponse.value.data : [];
      
      // 处理系统消息
      const rawSystemMessages = systemResponse.status === 'fulfilled' && 
                              systemResponse.value.success ? 
                              systemResponse.value.data : [];
      
      // 格式化系统消息
      const systemMessages = this.formatSystemMessages(rawSystemMessages, currentUserId);
      
      // 合并所有消息
      const allMessages = [...interactionMessages, ...systemMessages];
      
      // 按发送者分组
      const sendersMap = this.groupMessagesBySender(allMessages, currentUserId);
      
      // 转换为数组并按最后消息时间排序
      const sendersList = Array.from(sendersMap.values()).sort((a, b) => {
        return new Date(b.lastTime) - new Date(a.lastTime);
      });
      
      return {
        success: true,
        message: '获取消息成功',
        senders: sendersList,
        hasMoreInteraction: interactionResponse.status === 'fulfilled' ? 
                           interactionResponse.value.hasMore : false,
        hasMoreSystem: systemResponse.status === 'fulfilled' ? 
                      systemResponse.value.hasMore : false
      };
    } catch (error) {
      logService.error('获取所有消息异常', error);
      return {
        success: false,
        message: `获取消息异常: ${error.message || '未知错误'}`,
        senders: []
      };
    }
  }
  
  /**
   * 获取当前用户ID
   * 首先尝试从localStorage获取，然后尝试使用authService
   * @returns {number|string|null} 当前用户ID或null
   */
  getCurrentUserId() {
    try {
      // 尝试从localStorage获取
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr);
        if (userInfo && (userInfo.userId || userInfo.id)) {
          return userInfo.userId || userInfo.id;
        }
      }
      
      // 作为备选，使用authService
      if (authService.isLoggedIn()) {
        const userInfo = authService.getCurrentUser();
        if (userInfo && (userInfo.userId || userInfo.id)) {
          return userInfo.userId || userInfo.id;
        }
      }
      
      return null;
    } catch (err) {
      logService.error('获取当前用户ID失败', err);
      return null;
    }
  }
  
  /**
   * 获取交互消息
   * @param {Object} params 查询参数
   * @param {number} params.page 页码（从1开始）
   * @param {number} params.size 每页数量
   * @returns {Promise<Object>} 包含消息列表和分页信息的响应
   */
  async getInteractionMessages(params = {}) {
    logService.info('获取交互消息', params);
    
    try {
      const defaultParams = {
        page: 1,
        size: 20
      };
      
      const queryParams = { ...defaultParams, ...params };
      
      const response = await api.getInteractionMessages(queryParams);
      
      logService.info('获取交互消息响应', response);
      
      // 格式化响应结果为统一格式
      if (!response || typeof response !== 'object') {
        return {
          success: false,
          message: '获取交互消息失败: 无效的响应',
          data: [],
          total: 0
        };
      }
      
      // 如果API返回的结构是标准格式，直接返回
      if (response.success !== undefined) {
        return response;
      }
      
      // 如果是其他格式，转换为标准格式
      return {
        success: response.code === 200,
        message: response.message || '',
        data: response.data?.list || [],
        total: response.data?.total || 0
      };
    } catch (error) {
      logService.error('获取交互消息异常', error);
      
      return {
        success: false,
        message: `获取交互消息异常: ${error.message || '未知错误'}`,
        data: [],
        total: 0
      };
    }
  }
  
  /**
   * 标记消息为已读
   * @param {number|string} messageId 消息ID
   * @returns {Promise<Object>} 操作结果
   */
  async markMessageRead(messageId) {
    if (!messageId) {
      logService.warn('标记消息已读失败: 消息ID不能为空');
      return {
        code: 400,
        message: '消息ID不能为空'
      };
    }
    
    logService.info('标记消息已读', { messageId });
    
    try {
      const response = await api.markMessageRead(messageId);
      
      logService.info('标记消息已读响应', response);
      
      return response;
    } catch (error) {
      logService.error('标记消息已读异常', error);
      throw error;
    }
  }
  
  /**
   * 批量标记消息为已读
   * @param {Array<number|string>} messageIds 消息ID数组
   * @returns {Promise<Object>} 操作结果
   */
  async batchMarkRead(messageIds) {
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      logService.warn('批量标记消息已读失败: 消息ID不能为空');
      return {
        code: 400,
        message: '消息ID不能为空'
      };
    }
    
    logService.info('批量标记消息已读', { count: messageIds.length });
    
    try {
      const response = await api.batchMarkRead(messageIds);
      
      logService.info('批量标记消息已读响应', response);
      
      return response;
    } catch (error) {
      logService.error('批量标记消息已读异常', error);
      throw error;
    }
  }
  
  /**
   * 删除消息
   * @param {number|string} messageId 消息ID
   * @returns {Promise<Object>} 操作结果
   */
  async deleteMessage(messageId) {
    if (!messageId) {
      logService.warn('删除消息失败: 消息ID不能为空');
      return {
        code: 400,
        message: '消息ID不能为空'
      };
    }
    
    logService.info('删除消息', { messageId });
    
    try {
      const response = await api.deleteMessage(messageId);
      
      logService.info('删除消息响应', response);
      
      return response;
    } catch (error) {
      logService.error('删除消息异常', error);
      throw error;
    }
  }
  
  /**
   * 批量删除消息
   * @param {Array<number|string>} messageIds 消息ID数组
   * @returns {Promise<Object>} 操作结果
   */
  async batchDeleteMessages(messageIds) {
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      logService.warn('批量删除消息失败: 消息ID不能为空');
      return {
        code: 400,
        message: '消息ID不能为空'
      };
    }
    
    logService.info('批量删除消息', { count: messageIds.length });
    
    try {
      const response = await api.batchDeleteMessages(messageIds);
      
      logService.info('批量删除消息响应', response);
      
      return response;
    } catch (error) {
      logService.error('批量删除消息异常', error);
      throw error;
    }
  }
  
  /**
   * 获取未读消息数量
   * @returns {Promise<Object>} 操作结果，包含未读消息数
   */
  async getUnreadCount() {
    logService.info('获取未读消息数量');
    
    try {
      const response = await api.getUnreadMessageCount();
      
      logService.info('获取未读消息数量响应', response);
      
      return response;
    } catch (error) {
      logService.error('获取未读消息数量异常', error);
      throw error;
    }
  }
  
  /**
   * 发送消息
   * @param {number|string} receiverId 接收者ID
   * @param {string} content 消息内容
   * @param {number|string|null} carId 关联车辆ID（可选）
   * @returns {Promise<Object>} 操作结果
   */
  async sendMessage(receiverId, content, carId = null) {
    if (!receiverId) {
      logService.warn('发送消息失败: 接收者ID不能为空');
      return {
        code: 400,
        message: '接收者ID不能为空'
      };
    }
    
    if (!content || content.trim() === '') {
      logService.warn('发送消息失败: 消息内容不能为空');
      return {
        code: 400,
        message: '消息内容不能为空'
      };
    }
    
    logService.info('发送消息', { receiverId, carId });
    
    try {
      const messageData = {
        toUserId: receiverId,
        content: content,
        carId: carId || undefined
      };
      
      const response = await api.sendMessage(messageData);
      
      logService.info('发送消息响应', response);
      
      return response;
    } catch (error) {
      logService.error('发送消息异常', error);
      throw error;
    }
  }
  
  /**
   * 格式化日期显示
   * @param {string} dateString 日期字符串
   * @returns {string} 格式化后的日期显示
   */
  formatDate(dateString) {
    if (!dateString) return '未知时间';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // 计算时间差（毫秒）
      const diff = now.getTime() - date.getTime();
      
      // 1小时内显示"x分钟前"
      if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return minutes <= 0 ? '刚刚' : `${minutes}分钟前`;
      }
      
      // 24小时内显示"x小时前"
      if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours}小时前`;
      }
      
      // 7天内显示星期几
      if (diff < 604800000) {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        return days[date.getDay()];
      }
      
      // 其他情况显示具体日期
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    } catch (error) {
      logService.warn('格式化日期异常', error);
      return '日期格式错误';
    }
  }
}

// 创建单例实例
const messageService = new MessageService();

// 导出服务实例
export default messageService; 