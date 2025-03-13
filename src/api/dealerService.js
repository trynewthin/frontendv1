// 导入API客户端与相关模型

import DealerAuditDTO from '../../apiclient/src/model/DealerAuditDTO';
import DealerDTO from '../../apiclient/src/model/DealerDTO';
import { api } from './apiService';

/**
 * 经销商管理服务
 * 处理经销商信息的增删改查操作
 */
class DealerService {
  /**
   * 检查用户是否已登录
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
   * 获取经销商列表
   * @param {Object} [queryParams] 查询参数
   * @param {string} [queryParams.keyword] 关键词
   * @param {string} [queryParams.verifyStatus] 认证状态
   * @param {string} [queryParams.region] 地区
   * @param {number} [queryParams.page] 页码（从1开始）
   * @param {number} [queryParams.size] 每页数量
   * @returns {Promise<{success: boolean, message: string, data: Array|null, total: number, page: number, size: number}>} 查询结果
   */
  async getDealerList(queryParams = {}) {
    try {
      // 检查是否已登录 (可选，如果不需要登录可以注释掉)
      if (!this.isLoggedIn()) {
        console.warn('获取经销商列表: 用户未登录');
        return {
          success: false,
          message: '用户未登录',
          data: null,
          total: 0,
          page: 1,
          size: 20
        };
      }

      // 设置默认分页参数
      const opts = {
        keyword: queryParams.keyword,
        verifyStatus: queryParams.verifyStatus,
        region: queryParams.region,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      console.log('开始获取经销商列表，参数:', JSON.stringify(opts));

      // 调用API获取经销商列表
      const response = await api.getDealerList(opts);
      console.log('获取经销商列表原始响应:', response);
      
      // 兼容不同的后端接口返回结构
      const responseData = response.data || {};
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据（兼容不同的数据结构）
        const dealersList = responseData.content || responseData.list || responseData.records || (Array.isArray(responseData) ? responseData : []);
        const totalItems = responseData.totalElements || responseData.total || responseData.totalCount || dealersList.length;
        const currentPage = (responseData.number !== undefined) ? responseData.number + 1 : (responseData.pageNum || queryParams.page || 1);
        const pageSize = responseData.size || responseData.pageSize || queryParams.size || 20;
        
        console.log(`获取经销商列表成功: 获取到${dealersList.length}条记录，总共${totalItems}条，当前页${currentPage}，每页${pageSize}条`);
        
        // 映射数据结构确保前端统一格式
        const mappedDealers = dealersList.map(dealer => {
          return {
            id: dealer.dealerId || dealer.id,
            name: dealer.dealerName || dealer.name,
            contactPerson: dealer.contactPerson,
            contactPhone: dealer.contactPhone,
            region: dealer.region || this.extractRegionFromAddress(dealer.address),
            address: dealer.address,
            verifyStatus: dealer.status || dealer.verifyStatus,
            registerTime: dealer.createTime || dealer.registerTime || dealer.createdAt,
            businessLicense: dealer.businessLicense
          };
        });
        
        return {
          success: true,
          message: '获取经销商列表成功',
          data: mappedDealers,
          total: totalItems,
          page: currentPage,
          size: pageSize
        };
      }
      
      // 获取失败
      console.error('获取经销商列表失败:', response.message);
      return {
        success: false,
        message: response.message || '获取经销商列表失败',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    } catch (error) {
      console.error('获取经销商列表过程中发生错误:', error);
      
      // 更详细的错误信息
      let errorMessage = '获取经销商列表过程中发生错误';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = '网络连接错误，请检查网络或API服务器状态';
        } else if (error.message.includes('timeout')) {
          errorMessage = '请求超时，请稍后再试';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
  }

  /**
   * 从地址中提取地区信息（辅助方法）
   * @private
   * @param {string} address 地址文本
   * @return {string} 提取的地区
   */
  extractRegionFromAddress(address) {
    if (!address) return '未知';
    
    const regions = [
      '北京', '上海', '广州', '深圳', 
      '天津', '重庆', '河北', '山西', 
      '辽宁', '吉林', '黑龙江', '江苏', 
      '浙江', '安徽', '福建', '江西', 
      '山东', '河南', '湖北', '湖南', 
      '广东', '海南', '四川', '贵州', 
      '云南', '陕西', '甘肃', '青海', 
      '台湾', '内蒙古', '广西', '西藏', 
      '宁夏', '新疆', '香港', '澳门'
    ];
    
    for (const region of regions) {
      if (address.includes(region)) {
        return region;
      }
    }
    
    return '未知';
  }

  /**
   * 获取经销商详情
   * @param {number} dealerId 经销商ID
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 查询结果
   */
  async getDealerDetail(dealerId) {
    try {
      // 验证参数
      if (!dealerId) {
        return {
          success: false,
          message: '经销商ID不能为空',
          data: null
        };
      }

      // 调用API获取经销商详情
      const response = await api.getDealerDetail(dealerId);
      console.log('获取经销商详情响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取经销商详情成功',
          data: response.data
        };
      }
      
      // 获取失败
      return {
        success: false,
        message: response.message || '获取经销商详情失败',
        data: null
      };
    } catch (error) {
      console.error('获取经销商详情过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取经销商详情过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 提交/更新经销商信息
   * @param {Object} dealerData 经销商信息
   * @param {string} dealerData.dealerName 经销商名称
   * @param {string} [dealerData.address] 地址
   * @param {string} [dealerData.businessLicense] 营业执照号
   * @param {string} [dealerData.contactPerson] 联系人
   * @param {string} [dealerData.contactPhone] 联系电话
   * @param {string} [dealerData.description] 描述
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 提交结果
   */
  async submitDealerInfo(dealerData) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 验证必填字段
      if (!dealerData.dealerName) {
        return {
          success: false,
          message: '经销商名称不能为空',
          data: null
        };
      }

      // 创建DealerDTO对象
      const dealerDTO = new DealerDTO(dealerData.dealerName);
      
      // 设置可选字段
      if (dealerData.address !== undefined) {
        dealerDTO.address = dealerData.address;
      }
      
      if (dealerData.businessLicense !== undefined) {
        dealerDTO.businessLicense = dealerData.businessLicense;
      }
      
      if (dealerData.contactPerson !== undefined) {
        dealerDTO.contactPerson = dealerData.contactPerson;
      }
      
      if (dealerData.contactPhone !== undefined) {
        dealerDTO.contactPhone = dealerData.contactPhone;
      }
      
      if (dealerData.description !== undefined) {
        dealerDTO.description = dealerData.description;
      }

      // 调用API提交经销商信息
      const response = await api.submitDealerInfo(dealerDTO);
      console.log('提交经销商信息响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 201) {
        // 提交成功，返回数据
        return {
          success: true,
          message: response.message || '经销商信息提交成功',
          data: response.data
        };
      }
      
      // 提交失败
      return {
        success: false,
        message: response.message || '经销商信息提交失败',
        data: null
      };
    } catch (error) {
      console.error('提交经销商信息过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '提交经销商信息过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 提交审核申请
   * @param {Object} reviewData 审核申请数据
   * @param {string} [reviewData.remarks] 备注说明
   * @returns {Promise<{success: boolean, message: string, data: Object|null}>} 提交结果
   */
  async submitReviewRequest(reviewData = {}) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        return {
          success: false,
          message: '用户未登录',
          data: null
        };
      }

      // 创建审核申请对象
      const reviewRequestDTO = {
        remarks: reviewData.remarks || ''
      };

      // 调用API提交审核申请
      const response = await api.submitDealerReview(reviewRequestDTO);
      console.log('提交审核申请响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 201) {
        // 提交成功，返回数据
        return {
          success: true,
          message: response.message || '审核申请提交成功',
          data: response.data
        };
      }
      
      // 提交失败
      return {
        success: false,
        message: response.message || '审核申请提交失败',
        data: null
      };
    } catch (error) {
      console.error('提交审核申请过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '提交审核申请过程中发生错误',
        data: null
      };
    }
  }

  /**
   * 审核经销商
   * @param {number} dealerId 经销商ID
   * @param {number} status 审核状态（1=通过, 2=拒绝）
   * @param {string} [remarks] 备注说明
   * @returns {Promise<{success: boolean, message: string}>} 审核结果
   */
  async auditDealer(dealerId, status, remarks) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        console.warn('审核经销商失败: 用户未登录');
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 检查是否有管理员权限
      if (!this.isAdmin()) {
        console.warn('审核经销商失败: 无管理员权限');
        return {
          success: false,
          message: '您没有审核经销商的权限'
        };
      }

      // 验证参数
      if (!dealerId) {
        console.warn('审核经销商失败: 经销商ID不能为空');
        return {
          success: false,
          message: '经销商ID不能为空'
        };
      }

      if (status !== 1 && status !== 2) {
        console.warn('审核经销商失败: 状态无效', status);
        return {
          success: false,
          message: '审核状态无效，必须是1(通过)或2(拒绝)'
        };
      }

      if (status === 2 && !remarks) {
        console.warn('审核经销商失败: 拒绝时必须提供备注');
        return {
          success: false,
          message: '拒绝申请时必须提供备注说明'
        };
      }

      // 记录请求参数
      console.log('审核经销商请求参数:', { dealerId, status, remarks });

      // 创建DealerAuditDTO对象
      const dealerAuditDTO = new DealerAuditDTO(status);
      
      // 设置备注
      if (remarks) {
        dealerAuditDTO.remarks = remarks;
      }

      // 导入日志工具
      try {
        const { logApiRequest, logApiResponse } = require('../config/apiConfig');
        logApiRequest('POST', `/api/dealer/${dealerId}/audit`, { status, remarks });
      } catch (e) {
        console.warn('加载日志工具失败，继续执行流程', e);
      }

      // 调用API审核经销商
      const response = await api.auditDealer(dealerId, dealerAuditDTO);
      console.log('审核经销商响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 审核成功
        return {
          success: true,
          message: response.message || (status === 1 ? '经销商审核通过' : '经销商审核已拒绝'),
          data: response.data
        };
      }
      
      // 审核失败
      return {
        success: false,
        message: response.message || '经销商审核失败'
      };
    } catch (error) {
      console.error('审核经销商过程中发生错误:', error);
      
      // 更详细的错误信息
      let errorMessage = '审核经销商失败';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = '网络连接错误，请检查网络连接';
        } else if (error.message.includes('timeout')) {
          errorMessage = '请求超时，请稍后再试';
        } else {
          errorMessage = error.message;
        }
      }
      
      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 401:
            errorMessage = '身份验证失败，请重新登录';
            break;
          case 403:
            errorMessage = '您没有审核经销商的权限';
            break;
          case 404:
            errorMessage = '找不到指定的经销商';
            break;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }

  /**
   * 删除经销商
   * @param {number} dealerId 经销商ID
   * @returns {Promise<{success: boolean, message: string}>} 删除结果
   */
  async deleteDealer(dealerId) {
    try {
      // 检查是否已登录
      if (!this.isLoggedIn()) {
        console.warn('删除经销商失败: 用户未登录');
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 检查是否有管理员权限
      if (!this.isAdmin()) {
        console.warn('删除经销商失败: 无管理员权限');
        return {
          success: false,
          message: '您没有删除经销商的权限'
        };
      }

      // 验证参数
      if (!dealerId) {
        console.warn('删除经销商失败: 经销商ID不能为空');
        return {
          success: false,
          message: '经销商ID不能为空'
        };
      }

      // 记录请求
      console.log('删除经销商请求参数:', { dealerId });

      // 导入日志工具
      try {
        const { logApiRequest, logApiResponse } = require('../config/apiConfig');
        logApiRequest('DELETE', `/api/dealer/${dealerId}`, {});
      } catch (e) {
        console.warn('加载日志工具失败，继续执行流程', e);
      }

      // 调用API删除经销商
      const response = await api.deleteDealer(dealerId);
      console.log('删除经销商响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 删除成功
        return {
          success: true,
          message: response.message || '经销商删除成功',
          data: response.data
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '经销商删除失败'
      };
    } catch (error) {
      console.error('删除经销商过程中发生错误:', error);
      
      // 更详细的错误信息
      let errorMessage = '删除经销商失败';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = '网络连接错误，请检查网络连接';
        } else if (error.message.includes('timeout')) {
          errorMessage = '请求超时，请稍后再试';
        } else {
          errorMessage = error.message;
        }
      }
      
      if (error.response) {
        const statusCode = error.response.status;
        switch (statusCode) {
          case 401:
            errorMessage = '身份验证失败，请重新登录';
            break;
          case 403:
            errorMessage = '您没有删除经销商的权限';
            break;
          case 404:
            errorMessage = '找不到指定的经销商';
            break;
          case 409:
            errorMessage = '该经销商无法删除，可能有关联数据';
            break;
        }
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error
      };
    }
  }
}

// 创建单例实例
const dealerService = new DealerService();

export default dealerService; 