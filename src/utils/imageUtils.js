/**
 * 图片处理工具函数
 */

/**
 * 获取图片服务器基础URL
 * @returns {string} 图片服务器基础URL
 */
export const getImageBaseUrl = () => {
  // 始终使用localhost:8090，而不是Docker内部的resource-server
  return import.meta.env.VITE_API_IMAGE_URL || 'http://localhost:8090';
};

/**
 * 获取完整的图片URL
 * @param {string} url - 图片路径
 * @param {string} type - 图片类型，如'avatars', 'cars'等，默认为空
 * @returns {string} 完整的图片URL
 */
export const getFullImageUrl = (url, type = '') => {
  // 如果URL为空，返回默认图片
  if (!url) {
    return getDefaultImageUrl(type);
  }
  
  // 如果已经是完整URL，直接返回
  if (url.startsWith('http')) {
    return url;
  }
  
  // 如果是相对路径并且不是以/开头，添加/
  let path = url;
  if (!path.startsWith('/')) {
    path = '/' + path;
  }
  
  // 返回完整URL
  return getImageBaseUrl() + path;
};

/**
 * 获取默认图片URL
 * @param {string} type - 图片类型，如'avatars', 'cars'等
 * @returns {string} 默认图片URL
 */
export const getDefaultImageUrl = (type = '') => {
  const baseUrl = getImageBaseUrl();
  
  switch (type) {
    case 'avatars':
      return `${baseUrl}/images/avatars/default.png`;
    case 'cars':
      return `${baseUrl}/images/cars/default.png`;
    default:
      return `${baseUrl}/images/default.png`;
  }
};

/**
 * 处理图片加载错误
 * @param {Event} event - 错误事件
 * @param {string} type - 图片类型，如'avatars', 'cars'等
 */
export const handleImageError = (event, type = '') => {
  console.warn(`图片加载失败: ${type || '未知类型'}`, event.target.src);
  const defaultUrl = getDefaultImageUrl(type);
  
  if (event.target.src !== defaultUrl) {
    event.target.src = defaultUrl;
  }
};

/**
 * 获取带时间戳的图片URL（用于强制刷新图片）
 * @param {string} url - 图片路径
 * @param {string} type - 图片类型
 * @returns {string} 带时间戳的完整图片URL
 */
export const getImageUrlWithTimestamp = (url, type = '') => {
  const fullUrl = getFullImageUrl(url, type);
  const timestamp = Date.now();
  const separator = fullUrl.includes('?') ? '&' : '?';
  
  return `${fullUrl}${separator}t=${timestamp}`;
}; 