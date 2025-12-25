import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173, // 前端端口
    host: '0.0.0.0', // 允许外部访问
    proxy: {
      // 代理所有 /api 开头的请求
      '/api': {
        target: 'http://26.184.138.207:8080', // 后端地址
        changeOrigin: true, // 允许跨域
        secure: false, // 如果是https接口，需要配置这个参数
        ws: true, // 支持websocket
        rewrite: (path) => path // 不重写路径，保持 /api
      }
    }
  }
})
