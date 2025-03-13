/**
 * 图标服务 - 用于加载和管理应用程序中使用的图标字体
 */

/**
 * 加载Lucide图标
 * 如果图标已经加载，则不会重复加载
 * @returns {Promise} 返回一个Promise，在图标加载完成后解析
 */
const loadLucideIcons = () => {
  return new Promise((resolve) => {
    if (!document.getElementById('lucide-icons')) {
      console.log('加载Lucide图标...');
      const script = document.createElement('script');
      script.id = 'lucide-icons';
      script.src = 'https://unpkg.com/lucide@latest';
      script.async = true;
      
      // 加载完成后初始化图标
      script.onload = () => {
        if (window.lucide) {
          window.lucide.createIcons();
          console.log('Lucide图标初始化完成');
        }
        resolve(true);
      };
      
      script.onerror = () => {
        console.error('Lucide图标加载失败');
        resolve(false);
      };
      
      document.body.appendChild(script);
    } else {
      // 如果已经加载过，直接尝试初始化
      if (window.lucide) {
        window.lucide.createIcons();
      }
      resolve(true);
    }
  });
};

/**
 * 手动初始化Lucide图标
 * 用于在动态添加图标元素后重新初始化图标
 */
const initLucideIcons = () => {
  if (window.lucide && window.lucide.createIcons) {
    window.lucide.createIcons();
    return true;
  }
  return false;
};

/**
 * 初始化图标服务
 * 加载应用程序所需的所有图标
 */
const init = async () => {
  await loadLucideIcons();
};

// 导出图标服务
const iconService = {
  init,
  loadLucideIcons,
  initLucideIcons
};

export default iconService; 