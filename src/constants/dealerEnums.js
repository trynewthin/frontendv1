/**
 * 经销商相关枚举值
 * 集中管理所有经销商相关的枚举，方便维护和统一使用
 */

// 经销商验证状态枚举
export const DEALER_VERIFY_STATUS = [
  { value: 0, label: '待审核' },
  { value: 1, label: '已通过' },
  { value: 2, label: '已拒绝' }
];

// 常见地区枚举（中国主要城市）
export const DEALER_REGIONS = [
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '广州', label: '广州' },
  { value: '深圳', label: '深圳' },
  { value: '成都', label: '成都' },
  { value: '杭州', label: '杭州' },
  { value: '重庆', label: '重庆' },
  { value: '武汉', label: '武汉' },
  { value: '西安', label: '西安' },
  { value: '南京', label: '南京' }
];

// 排序字段枚举
export const DEALER_SORT_FIELDS = [
  { value: 'createTime', label: '创建时间' },
  { value: 'updateTime', label: '更新时间' }
];

// 排序方向枚举
export const SORT_DIRECTIONS = [
  { value: 'asc', label: '升序' },
  { value: 'desc', label: '降序' }
];

export default {
  DEALER_VERIFY_STATUS,
  DEALER_REGIONS,
  DEALER_SORT_FIELDS,
  SORT_DIRECTIONS
}; 