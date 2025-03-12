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
      // 设置默认分页参数
      const opts = {
        keyword: queryParams.keyword,
        verifyStatus: queryParams.verifyStatus,
        region: queryParams.region,
        page: queryParams.page || 1,
        size: queryParams.size || 20
      };

      // 调用API获取经销商列表
      const response = await api.getDealerList(opts);
      console.log('获取经销商列表响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 获取成功，返回数据
        return {
          success: true,
          message: '获取经销商列表成功',
          data: response.data?.content || [],
          total: response.data?.totalElements || 0,
          page: response.data?.number + 1 || 1,
          size: response.data?.size || 20
        };
      }
      
      // 获取失败
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
      return {
        success: false,
        message: error.response?.data?.message || error.message || '获取经销商列表过程中发生错误',
        data: null,
        total: 0,
        page: 1,
        size: 20
      };
    }
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
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!dealerId) {
        return {
          success: false,
          message: '经销商ID不能为空'
        };
      }

      if (status !== 1 && status !== 2) {
        return {
          success: false,
          message: '审核状态无效，必须是1(通过)或2(拒绝)'
        };
      }

      // 创建DealerAuditDTO对象
      const dealerAuditDTO = new DealerAuditDTO(status);
      
      // 设置备注
      if (remarks) {
        dealerAuditDTO.remarks = remarks;
      }

      // 调用API审核经销商
      const response = await api.auditDealer(dealerId, dealerAuditDTO);
      console.log('审核经销商响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0) {
        // 审核成功
        return {
          success: true,
          message: response.message || '经销商审核成功'
        };
      }
      
      // 审核失败
      return {
        success: false,
        message: response.message || '经销商审核失败'
      };
    } catch (error) {
      console.error('审核经销商过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '审核经销商过程中发生错误'
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
        return {
          success: false,
          message: '用户未登录'
        };
      }

      // 验证参数
      if (!dealerId) {
        return {
          success: false,
          message: '经销商ID不能为空'
        };
      }

      // 调用API删除经销商
      const response = await api.deleteDealer(dealerId);
      console.log('删除经销商响应:', response);
      
      // 检查响应状态
      if (response.code === 200 || response.code === 0 || response.code === 204) {
        // 删除成功
        return {
          success: true,
          message: response.message || '经销商删除成功'
        };
      }
      
      // 删除失败
      return {
        success: false,
        message: response.message || '经销商删除失败'
      };
    } catch (error) {
      console.error('删除经销商过程中发生错误:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message || '删除经销商过程中发生错误'
      };
    }
  }
}

// 创建单例实例
const dealerService = new DealerService();

export default dealerService; 