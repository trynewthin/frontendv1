/**
 * 车辆相关枚举值
 * 集中管理所有车辆相关的枚举，方便维护和统一使用
 */

// 车辆类别枚举
export const CAR_CATEGORIES = [
  { value: '中大型轿车', label: '中大型轿车' },
  { value: '中大型SUV', label: '中大型SUV' },
  { value: '中型SUV', label: '中型SUV' },
  { value: '紧凑型轿车', label: '紧凑型轿车' },
  { value: '小型SUV', label: '小型SUV' },
  { value: '豪华轿车', label: '豪华轿车' },
  { value: '跑车', label: '跑车' },
  { value: 'MPV', label: 'MPV' },
  { value: '皮卡', label: '皮卡' },
  { value: '新能源车', label: '新能源车' },
  { value: '旅行车', label: '旅行车' },
  { value: '微型车', label: '微型车' },
];

// 常见车辆品牌枚举
export const CAR_BRANDS = [
  { value: 'BMW', label: '宝马 (BMW)' },
  { value: 'Mercedes-Benz', label: '奔驰 (Mercedes-Benz)' },
  { value: 'Audi', label: '奥迪 (Audi)' },
  { value: 'Porsche', label: '保时捷 (Porsche)' },
  { value: 'Toyota', label: '丰田 (Toyota)' },
  { value: 'Honda', label: '本田 (Honda)' },
  { value: 'Volkswagen', label: '大众 (Volkswagen)' },
  { value: 'Ford', label: '福特 (Ford)' },
  { value: 'Chevrolet', label: '雪佛兰 (Chevrolet)' },
  { value: 'Nissan', label: '日产 (Nissan)' },
  { value: 'Lexus', label: '雷克萨斯 (Lexus)' },
  { value: 'Volvo', label: '沃尔沃 (Volvo)' },
  { value: 'Hyundai', label: '现代 (Hyundai)' },
  { value: 'Kia', label: '起亚 (Kia)' },
  { value: 'Mazda', label: '马自达 (Mazda)' },
  { value: 'Subaru', label: '斯巴鲁 (Subaru)' },
  { value: 'Tesla', label: '特斯拉 (Tesla)' },
  { value: 'Land Rover', label: '路虎 (Land Rover)' },
  { value: 'Jaguar', label: '捷豹 (Jaguar)' },
  { value: 'Cadillac', label: '凯迪拉克 (Cadillac)' },
  { value: 'Acura', label: '讴歌 (Acura)' },
  { value: 'Infiniti', label: '英菲尼迪 (Infiniti)' },
  { value: 'Buick', label: '别克 (Buick)' },
  { value: 'Jeep', label: '吉普 (Jeep)' },
  { value: 'Maserati', label: '玛莎拉蒂 (Maserati)' },
  { value: 'Bentley', label: '宾利 (Bentley)' },
  { value: 'Rolls-Royce', label: '劳斯莱斯 (Rolls-Royce)' },
  { value: 'Ferrari', label: '法拉利 (Ferrari)' },
  { value: 'Lamborghini', label: '兰博基尼 (Lamborghini)' },
  { value: 'Aston Martin', label: '阿斯顿·马丁 (Aston Martin)' },
  { value: 'BYD', label: '比亚迪 (BYD)' },
  { value: 'NIO', label: '蔚来 (NIO)' },
  { value: 'Xpeng', label: '小鹏 (Xpeng)' },
  { value: 'Li Auto', label: '理想 (Li Auto)' }
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
  { value: '插电混合动力', label: '插电混合动力' },
  { value: '氢燃料', label: '氢燃料' },
  { value: '天然气', label: '天然气' },
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