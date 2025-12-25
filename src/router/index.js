// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import CustomerHome from '../views/CustomerHome.vue'
import ProductList from '../views/customer/ProductList.vue'
import Cart from '../views/customer/Cart.vue'
import Orders from '../views/customer/Orders.vue'
import ShopDashboard from '../views/ShopDashboard.vue'
import GoodsManagement from '../views/shop/GoodsManagement.vue'
import OrderManagement from '../views/shop/OrderManagement.vue'
import ShopSettings from '../views/shop/ShopSettings.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { 
      path: '/', 
      redirect: '/customer'
    },
    {
      path: '/customer',
      component: CustomerHome,
      children: [
        { path: '', name: 'products', component: ProductList }, // 商品列表
        { path: 'cart', name: 'cart', component: Cart }, // 购物车
        { path: 'orders', name: 'orders', component: Orders } // 我的订单
      ]
    },
    { 
      path: '/shop', 
      component: ShopDashboard,
      children: [
        { path: '', name: 'shop-goods', component: GoodsManagement }, // 商品管理
        { path: 'orders', name: 'shop-orders', component: OrderManagement }, // 订单管理
        { path: 'settings', name: 'shop-settings', component: ShopSettings } // 店铺设置
      ]
    },
    { 
      path: '/admin', 
      component: AdminDashboard,
      children: [
        { path: '', name: 'admin-users', component: UserManagement } // 用户管理
      ]
    }
  ]
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  console.log('路由守卫触发，目标路径:', to.path);
  
  const token = localStorage.getItem('token');
  const currentUserStr = localStorage.getItem('currentUser');
  
  console.log('token:', token);
  console.log('currentUser:', currentUserStr);
  
  // 需要登录的页面
  const requiresAuth = ['/shop', '/admin'];
  
  if (requiresAuth.some(path => to.path.startsWith(path))) {
    // 检查是否有用户信息（token 可能不存在，但用户信息存在也算登录）
    if (!currentUserStr) {
      console.log('未登录，跳转到登录页');
      next('/login');
    } else {
      console.log('已登录，允许访问');
      next();
    }
  } else {
    console.log('不需要登录验证，直接放行');
    next();
  }
})

export default router