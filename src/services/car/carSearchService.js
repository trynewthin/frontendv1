/**
 * 车辆搜索服务
 * 提供车辆搜索相关的API调用
 */

import axiosInstance from '../axios/axiosApiService';

/**
 * 搜索车辆
 * @param {string} keyword - 搜索关键词，支持品牌、型号、类别等
 * @param {number} page - 页码，默认为1
 * @param {number} size - 每页数量，默认为10
 * @returns {Promise} - 返回搜索结果的Promise对象
 */
export const searchCars = (keyword, page = 1, size = 10) => {
  return axiosInstance.get('/cars/search', {
    params: {
      keyword,
      page,
      size
    }
  });
};

/**
 * 格式化车辆数据
 * @param {Object} carData - 原始车辆数据
 * @returns {Object} - 格式化后的车辆数据
 */
export const formatCarData = (carData) => {
  if (!carData || !carData.cars) {
    return {
      cars: [],
      total: 0,
      current: 1,
      pages: 0
    };
  }

  return {
    cars: carData.cars.map(car => ({
      ...car,
      // 可以在这里添加数据转换逻辑
      // 例如：格式化日期、价格等
      formattedPrice: `¥${(car.price / 10000).toFixed(2)}万`,
      fullName: `${car.brand} ${car.model} ${car.year}款`
    })),
    total: carData.total,
    current: carData.current,
    pages: carData.pages
  };
};

export default {
  searchCars,
  formatCarData
}; 