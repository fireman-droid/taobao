<template>
  <el-container class="admin-layout">
    <el-aside width="200px" class="aside-menu">
      <div class="brand">商家中心</div>
      <el-menu
        active-text-color="#ff5000"
        background-color="#303133"
        text-color="#fff"
        class="el-menu-vertical"
      >
        <el-menu-item index="1">
          <router-link to="/shop" class="menu-link">
            <el-icon><Goods /></el-icon> <span>商品管理</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link to="/shop/orders" class="menu-link">
            <el-icon><List /></el-icon> <span>订单管理</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <span style="margin-right: 10px">店铺名：</span>
          <p>{{ shop.name }}</p>
        </div>
        <el-button type="info" size="small" @click="$router.push('/')"
          >返回商城</el-button
        >
        <el-button size="small" @click="$router.push('/login')"
          >退出登录</el-button
        >
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, provide, onMounted, computed } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { Goods, List } from "@element-plus/icons-vue";

const store = useMainStore();

// 当前选中的店铺ID
const currentShopId = ref(null);

// 店铺信息
const shop = computed(() => ({
  id: store.currentUser?.id,
  name: store.currentUser?.name || "默认店铺"
}));

// 页面加载时设置默认店铺
onMounted(() => {
  if (store.currentUser) {
    currentShopId.value = store.currentUser.id;
  }
});

// 向子组件提供当前店铺ID
provide('currentShopId', currentShopId);
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}
.aside-menu {
  background-color: #303133;
  color: white;
}
.brand {
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  background: #ff5000;
}
.el-menu-vertical {
  border-right: none;
}
.menu-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  width: 100%;
}
.admin-header {
  background: white;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}
.header-left {
  margin-right: auto;
  font-weight: bold;
  display: flex;
  align-items: center;
}
.admin-main {
  background: #f0f2f5;
  padding: 0;
}
</style>
