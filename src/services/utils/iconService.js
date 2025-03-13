/**
 * 图标服务 - 用于加载和管理应用程序中使用的图标字体
 */

/**
 * 加载Lucide图标
 * 如果图标已经加载，则不会重复加载
 */
const loadLucideIcons = () => {
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
    };
    
    document.body.appendChild(script);
    return true;
  }
  return false;
};

/**
 * 初始化图标服务
 * 加载应用程序所需的所有图标
 */
const init = () => {
  loadLucideIcons();
};

// 导出图标服务
const iconService = {
  init,
  loadLucideIcons
};

export default iconService; 