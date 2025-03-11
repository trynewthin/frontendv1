import './style.css'
import 'vuestic-ui/css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Vuestic UI
import { createVuestic } from 'vuestic-ui'
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
    }
  }
}))

app.mount('#app')
