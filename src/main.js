import './style.css'
import 'vuestic-ui/css'

// Vuestic UI
import { createIconsConfig, createVuestic } from 'vuestic-ui'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(createVuestic({
  config: {
    colors: {
      // 可以在这里自定义主题颜色
      primary: '#5D78FF',
      secondary: '#8C9EFF',
      success: '#4CAF50',
      info: '#2196F3',
      danger: '#FF4D4F',
      warning: '#FFC107',
    },
    // 全局配置图标，隐藏Material Icons文本标签
    icons: createIconsConfig({
      aliases: [
        // 重新定义常用的图标别名，使其不显示文本
        { name: 'expand_more', resolve: () => ({ class: 'material-icons', content: '' }) },
        { name: 'expand_less', resolve: () => ({ class: 'material-icons', content: '' }) },
        { name: 'arrow_drop', resolve: () => ({ class: 'material-icons', content: '' }) },
        { name: 'highlight-expand', resolve: () => ({ class: 'material-icons', content: '' }) },
        { name: 'search_off', resolve: () => ({ class: 'material-icons', content: '' }) },
      ],
      fonts: [
        // 修改默认的Material Icons字体配置，使其不显示文本
        {
          name: '{icon}',
          resolve: ({ icon }) => ({
            class: 'material-icons',
            content: '',
            attrs: {
              'data-icon-name': icon,
              'aria-hidden': 'true'
            }
          })
        }
      ]
    })
  }
}))

app.mount('#app')
