<template>
  <div class="customer-layout">
    <!-- 顶部导航 -->
    <div class="site-nav">
      <div class="container nav-content">
        <div class="nav-left">
          <span v-if="store.currentUser" class="welcome">
            <el-icon><User /></el-icon>
            Hi，{{ store.currentUser.name }}
          </span>
          <span
            v-else
            class="welcome text-link"
            @click="$router.push('/login')"
          >
            亲，请登录
          </span>
          <el-divider direction="vertical" v-if="store.currentUser" />
          <span v-if="store.currentUser" class="text-link" @click="logout"
            >退出</span
          >
        </div>
        <div class="nav-right">
          <!-- 管理员/商家入口 -->
          <router-link 
            v-if="store.currentUser?.role === 'admin'" 
            to="/admin" 
            class="nav-item admin-entry"
          >
            <el-icon><Setting /></el-icon> 管理后台
          </router-link>
          <router-link 
            v-if="store.currentUser?.role === 'shop'" 
            to="/shop" 
            class="nav-item shop-entry"
          >
            <el-icon><Shop /></el-icon> 商家中心
          </router-link>
          
          <router-link to="/customer" class="nav-item" :class="{ active: isExactHome }">
            <el-icon><HomeFilled /></el-icon> 首页
          </router-link>
          <router-link
            to="/customer/cart"
            class="nav-item"
            active-class="active"
          >
            <el-icon><ShoppingCart /></el-icon> 购物车
            <el-badge
              :value="cartCount"
              :hidden="cartCount === 0"
              class="cart-badge"
            />
          </router-link>
          <router-link
            to="/customer/orders"
            class="nav-item"
            active-class="active"
          >
            <el-icon><List /></el-icon> 我的订单
          </router-link>
        </div>
      </div>
    </div>

    <!-- 搜索头部 -->
    <div class="header-search">
      <div class="container header-inner">
        <div class="logo" @click="$router.push('/customer')">
          <span class="tb-icon">淘</span>
          <span class="tb-text">淘宝商城</span>
        </div>
        <div class="search-box">
          <el-input
            v-model="searchKey"
            placeholder="搜索你想要的宝贝..."
            size="large"
            clearable
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon> 搜索
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>

    <div class="router-view">
      <!-- 子页面内容 -->
      <router-view :searchKey="searchKey" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useMainStore } from "@/stores/mainStore";
import {
  User,
  HomeFilled,
  ShoppingCart,
  List,
  Search,
  Setting,
  Shop,
} from "@element-plus/icons-vue";

const store = useMainStore();
const router = useRouter();
const searchKey = ref("");

// 调试：打印当前用户信息
console.log('当前用户:', store.currentUser);
console.log('用户角色:', store.currentUser?.role);

const cartCount = computed(() => {
  if (!store.currentUser) return 0;
  return store.cart.filter((item) => item.customerId === store.currentUser.id)
    .length;
});

// 判断当前路由是否精确匹配
const isExactHome = computed(() => {
  return router.currentRoute.value.path === '/customer';
});

const logout = () => {
  store.logout();
  router.push("/login");
};

const handleSearch = () => {
  if (router.currentRoute.value.path !== "/customer") {
    router.push("/customer");
  }
};
</script>

<style scoped>
.customer-layout {
  background: #f5f5f5;
  min-height: 100vh;
}

.container {
  width: 1200px;
  margin: 0 auto;
}

/* 顶部导航 */
.site-nav {
  background: #fff;
  border-bottom: 1px solid #eee;
  height: 40px;
  line-height: 40px;
  font-size: 13px;
  color: #666;
}
.nav-content {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 5px;
}
.welcome {
  display: flex;
  align-items: center;
  gap: 4px;
}
.text-link {
  cursor: pointer;
  color: #ff5000;
}
.text-link:hover {
  text-decoration: underline;
}
.nav-right {
  display: flex;
  gap: 25px;
}
.nav-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative;
  transition: color 0.2s;
  text-decoration: none;
  color: #666;
}
.nav-item:hover {
  color: #ff5000;
}
.nav-item.active {
  color: #ff5000;
  font-weight: 500;
}
.cart-badge {
  position: absolute;
  top: -8px;
  right: -15px;
}

/* 管理员/商家入口特殊样式 */
.admin-entry {
  background: linear-gradient(135deg, #ff5000, #ff7800);
  color: #fff !important;
  padding: 0 12px;
  border-radius: 4px;
  font-weight: 500;
}
.admin-entry:hover {
  background: linear-gradient(135deg, #ff7800, #ff9000);
  color: #fff !important;
}
.shop-entry {
  background: linear-gradient(135deg, #67c23a, #85ce61);
  color: #fff !important;
  padding: 0 12px;
  border-radius: 4px;
  font-weight: 500;
}
.shop-entry:hover {
  /* background: linear-gradient(135deg, #85ce61, #95d475); */
  color: #fff !important;
}

/* 搜索头部 */
.header-search {
  background: #fff;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
.header-inner {
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 60px;
}
.tb-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ff5000, #ff7800);
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
  margin-right: 10px;
}
.tb-text {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
.search-box {
  flex: 1;
  max-width: 550px;
}
.search-box :deep(.el-input-group__append) {
  background: #ff5000;
  border-color: #ff5000;
  color: #fff;
  padding: 0 20px;
}
.search-box :deep(.el-input__wrapper) {
  border-color: #ff5000;
}

.router-view {
  width: 1200px;
  margin: 0 auto;
}
</style>
