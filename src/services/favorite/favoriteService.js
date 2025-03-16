/**
 * 收藏服务
 * 处理用户收藏相关的API请求
 */

import axiosInstance from '@services/axios/axiosApiService';

/**
 * 收藏服务类
 */
class FavoriteService {
  /**
   * 将指定车辆添加到当前用户的收藏列表中
   * @param {number} carId - 车辆ID
   * @returns {Promise<Object>} - 返回添加收藏的结果
   * 
   * 可能的响应:
   * - 成功: {code: 200, message: "操作成功", data: {favorite_id, car_id, create_time}}
   * - 已收藏: {code: 409, message: "已收藏该车辆", data: null}
   * - 参数错误: {code: 400, message: "参数错误：缺少car_id", data: null}
   */
  async addToFavorite(carId) {
    try {
      if (!carId) {
        throw new Error('参数错误：缺少car_id');
      }
      
      // 发送添加收藏请求
      const response = await axiosInstance.post(`/favorites?car_id=${carId}`);
      return response;
    } catch (error) {
      // 如果是已知错误类型，直接返回错误信息
      if (error.response) {
        return error.response.data;
      }
      
      // 未知错误，构造一个错误响应
      return {
        code: error.code || 500,
        message: error.message || '添加收藏失败',
        data: null
      };
    }
  }
  
  /**
   * 检查车辆是否已被收藏
   * @param {number} carId - 车辆ID
   * @returns {Promise<boolean>} - 返回车辆是否已被收藏
   */
  async isCarFavorited(carId) {
    try {
      if (!carId) {
        return false;
      }
      
      // 发送查询收藏状态请求
      const response = await axiosInstance.get(`/favorites/check/${carId}`);
      return response.code === 200 && response.data && response.data.isFavorite === true;
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      return false;
    }
  }

  /**
   * 将指定车辆从当前用户的收藏列表中移除
   * @param {number} carId - 车辆ID
   * @returns {Promise<Object>} - 返回取消收藏的结果
   * 
   * 可能的响应:
   * - 成功: {code: 200, message: "操作成功", data: "取消收藏成功"}
   * - 未收藏: {code: 404, message: "资源不存在", data: null}
   */
  async removeFromFavorite(carId) {
    try {
      if (!carId) {
        throw new Error('参数错误：缺少car_id');
      }
      
      // 发送取消收藏请求
      const response = await axiosInstance.delete(`/favorites/${carId}`);
      return response;
    } catch (error) {
      // 如果是已知错误类型，直接返回错误信息
      if (error.response) {
        return error.response.data;
      }
      
      // 未知错误，构造一个错误响应
      return {
        code: error.code || 500,
        message: error.message || '取消收藏失败',
        data: null
      };
    }
  }
}

// 创建并导出收藏服务实例
const favoriteService = new FavoriteService();
export default favoriteService; 