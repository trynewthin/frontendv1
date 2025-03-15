import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@home': path.resolve(__dirname, 'src/view_home'),
      '@user': path.resolve(__dirname, 'src/view_user'),
      '@dealer': path.resolve(__dirname, 'src/view_dealer'),
      '@admin': path.resolve(__dirname, 'src/view_admin'),
      '@icons': path.resolve(__dirname, 'public/icons')
    }
  }
})
