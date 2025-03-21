/**
 * 首页轮播图数据
 */
const sampleImageBaseUrl = import.meta.env.VITE_SAMPLE_IMAGE_URL || 'https://img.freepik.com';

export const homeCarouselSlides = [
  {
    imageUrl: `${sampleImageBaseUrl}/free-photo/luxury-car-parked-highway-with-sunset-background_1340-34000.jpg`,
    title: '智能选车，轻松购车',
    description: '基于您的喜好和需求，为您推荐最适合的车型'
  },
  {
    imageUrl: `${sampleImageBaseUrl}/free-photo/blue-sport-sedan-parked-yard_114579-5078.jpg`,
    title: '热门新车推荐',
    description: '探索市场上最新上市的热门车型'
  },
  {
    imageUrl: `${sampleImageBaseUrl}/free-photo/man-signing-car-purchase-agreement_23-2149000727.jpg`,
    title: '专业购车顾问',
    description: '我们的专业顾问将全程为您提供购车建议'
  }
];

/**
 * 促销活动轮播图数据
 */
export const promotionCarouselSlides = [
  {
    imageUrl: `${sampleImageBaseUrl}/free-photo/car-with-discount-tag-it_23-2149398942.jpg`,
    title: '限时优惠',
    description: '本月购车享受高达2万元的优惠'
  },
  {
    imageUrl: `${sampleImageBaseUrl}/free-photo/car-with-special-offer-tag-it_23-2149398941.jpg`,
    title: '0首付购车',
    description: '特定车型可享受0首付、0利率的金融方案'
  }
];