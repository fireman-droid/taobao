// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CustomerHome from '../views/CustomerHome.vue'
import ShopDashboard from '../views/ShopDashboard.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/', name: 'home', component: CustomerHome }, // 顾客/游客主页
    { path: '/shop', name: 'shop', component: ShopDashboard }, // 店铺后台
    { path: '/admin', name: 'admin', component: AdminDashboard } // 运营商后台
  ]
})

// 简单的路由守卫：如果没有登录，且不是去登录页或主页，强制跳回登录
router.beforeEach((to, from, next) => {
  // 实际项目中需要检查 Pinia store 的 currentUser，这里简化处理
  next()
})

export default router