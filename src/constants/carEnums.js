/**
 * 车辆相关枚举值
 * 集中管理所有车辆相关的枚举，方便维护和统一使用
 */

// 车辆类别枚举
export const CAR_CATEGORIES = [
  { value: '中大型轿车', label: '中大型轿车' },
  { value: '中大型SUV', label: '中大型SUV' },
  { value: '中型SUV', label: '中型SUV' },
];

// 常见车辆品牌枚举
export const CAR_BRANDS = [
  { value: 'BMW', label: '宝马 (BMW)' },
  { value: 'Mercedes-Benz', label: '奔驰 (Mercedes-Benz)' },
  { value: 'Audi', label: '奥迪 (Audi)' },
  { value: 'Porsche', label: '保时捷 (Porsche)' },
];

// 车辆状态枚举
export const CAR_STATUS = [
  { value: 1, label: '在售' },
  { value: 0, label: '下架' },
  { value: 2, label: '已售' },
];

// 车辆排序字段枚举
export const CAR_SORT_FIELDS = [
  { value: 'price', label: '价格' },
  { value: 'year', label: '年份' },
  { value: 'createTime', label: '创建时间' },
];

// 排序方向枚举
export const SORT_DIRECTIONS = [
  { value: 'asc', label: '升序' },
  { value: 'desc', label: '降序' },
];

// 燃油类型枚举
export const FUEL_TYPES = [
  { value: '汽油', label: '汽油' },
  { value: '柴油', label: '柴油' },
  { value: '电力', label: '电力' },
  { value: '混合动力', label: '混合动力' },
];

// 图片类型枚举
export const IMAGE_TYPES = [
  { value: 'thumbnail', label: '缩略图' },
  { value: 'full', label: '全尺寸图' },
];

export default {
  CAR_CATEGORIES,
  CAR_BRANDS,
  CAR_STATUS,
  CAR_SORT_FIELDS,
  SORT_DIRECTIONS,
  FUEL_TYPES,
  IMAGE_TYPES,
}; 