import './style.css'
import 'vuestic-ui/css'
import './assets/styles/vuestic-override.css'
import './assets/styles/custom.css'

import { createIconsConfig, createVuestic } from 'vuestic-ui'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { iconService } from './services'
import router from './router'

// Vuestic UI








// 初始化图标服务
iconService.init();

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(createVuestic({
  config: {
    colors: {
      variables: {
        primary: '#333333',
        secondary: '#8C9EFF',
        success: '#4CAF50',
        info: '#2196F3',
        danger: '#FF4D4F',
        warning: '#FFC107',
      },
    },
    components: {
      VaButton: {
        color: '#333333',
        textColor: '#ffffff',
        backgroundColor: '#333333',
        hoverBgColor: '#000000',
        hoverTextColor: '#ffffff',
      },
      VaToast: {
        zIndex: 9999,
      },
    },
    // 配置通知组件
    notifications: {
      position: 'top-right',
      duration: 3000,
      showClose: true,
      zIndex: 9999,
    },
    // 全局配置图标，使用Lucide图标
    icons: createIconsConfig({
      aliases: [
        // 重新定义常用的图标别名
        { name: 'expand_more', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'chevron-down' } }) },
        { name: 'expand_less', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'chevron-up' } }) },
        { name: 'arrow_drop', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'chevron-down' } }) },
        { name: 'highlight-expand', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'chevron-right' } }) },
        { name: 'search_off', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'search-x' } }) },
        { name: 'sun', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'sun' } }) },
        { name: 'moon', resolve: () => ({ tag: 'i', attrs: { 'data-lucide': 'moon' } }) },
      ],
      fonts: [
        // 配置Lucide图标
        {
          name: '{icon}',
          resolve: ({ icon }) => ({
            tag: 'i',
            attrs: {
              'data-lucide': icon,
              'aria-hidden': 'true'
            }
          })
        }
      ]
    })
  }
}))

app.mount('#app')
